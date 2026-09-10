<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket, Category, CompetitionJudge, Match, MatchResult, Registration } from '../types'
import StatusBadge from '../components/StatusBadge.vue'
import TournamentBracket from '../components/TournamentBracket.vue'

const route = useRoute()
const competition = useCompetitionStore()
const loading = ref(false)
const ready = ref(false)
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])
const brackets = ref<Bracket[]>([])
const matches = ref<Match[]>([])
const results = ref<MatchResult[]>([])
const judges = ref<CompetitionJudge[]>([])
const competitionId = ref<number>()
const categoryId = ref<number>()
const bracketId = ref<number>()
const inspectionDialog = ref(false)
const judgeDialog = ref(false)
const inspection = reactive({
  registrationId: undefined as number | undefined,
  aprovada: undefined as boolean | undefined,
  pesoMedido: undefined as number | undefined,
  observacao: ''
})
const judgeForm = reactive({ nome: '' })

const currentCompetition = computed(() => competition.competitions.find((item) => item.id === competitionId.value))
const currentCategory = computed(() => categories.value.find((item) => item.id === categoryId.value))
const currentBracket = computed(() => brackets.value.find((item) => item.id === bracketId.value))
const historicalSelected = computed(() => currentBracket.value?.atual === false)
const canGenerate = computed(() => currentCompetition.value?.status === 'INSCRICOES_ENCERRADAS')
const filteredBrackets = computed(() =>
  brackets.value
    .filter((item) => !categoryId.value || item.categoryId === categoryId.value)
    .sort((a, b) => {
      const currentDiff = Number(b.atual !== false) - Number(a.atual !== false)
      if (currentDiff !== 0) return currentDiff
      const dateA = a.dataCadastro ? new Date(a.dataCadastro).getTime() : a.id
      const dateB = b.dataCadastro ? new Date(b.dataCadastro).getTime() : b.id
      return dateB - dateA
    })
)
const approved = computed(() =>
  registrations.value.filter((item) => item.status === 'APROVADA' && item.categoryId === categoryId.value)
)

function queryNumber(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function pickBracket(preferredId?: number) {
  const options = filteredBrackets.value
  const preferred = preferredId ? options.find((item) => item.id === preferredId) : undefined
  bracketId.value = preferred?.id || options.find((item) => item.atual !== false)?.id || options[0]?.id
}

function controlModeLabel(category?: Category) {
  if (category?.sumoControlMode === 'AUTONOMO') return 'Autônomo'
  if (category?.sumoControlMode === 'RC') return 'R/C'
  return 'Modo não configurado'
}

function physicalClassLabel(category?: Category) {
  if (category?.sumoPhysicalClass === 'MINI_500G') return 'Mini 500 g'
  if (category?.sumoPhysicalClass === 'SUMO_3KG') return 'Sumô 3 kg'
  return 'Classe não configurada'
}

async function initialize() {
  loading.value = true
  try {
    const [, cats] = await Promise.all([competition.load(), adminApi.categories('SUMO')])
    categories.value = cats

    const requestedCompetition = queryNumber(route.query.competitionId)
    const requestedCategory = queryNumber(route.query.categoryId)
    const requestedBracket = queryNumber(route.query.bracketId)

    const selectedCompetition = competition.competitions.find((item) => item.id === requestedCompetition)
    competitionId.value = selectedCompetition?.id || competition.selectedId || competition.competitions[0]?.id
    if (competitionId.value && competition.selectedId !== competitionId.value) competition.select(competitionId.value)

    categoryId.value = categories.value.some((item) => item.id === requestedCategory)
      ? requestedCategory
      : categories.value[0]?.id

    await loadCompetition(requestedBracket)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar a operação do Sumô.')
  } finally {
    loading.value = false
    ready.value = true
  }
}

async function loadCompetition(preferredBracketId?: number) {
  if (!competitionId.value) {
    brackets.value = []
    registrations.value = []
    judges.value = []
    bracketId.value = undefined
    await loadBracket()
    return
  }

  loading.value = true
  try {
    const [br, regs, competitionJudges] = await Promise.all([
      adminApi.brackets(competitionId.value),
      adminApi.registrations({ competitionId: competitionId.value }),
      adminApi.judges(competitionId.value)
    ])
    brackets.value = br
    registrations.value = regs
    judges.value = competitionJudges

    if (!filteredBrackets.value.some((item) => item.id === bracketId.value)) {
      pickBracket(preferredBracketId)
    }
    await loadBracket()
  } finally {
    loading.value = false
  }
}

async function loadBracket() {
  if (!bracketId.value) {
    matches.value = []
    results.value = []
    return
  }

  ;[matches.value, results.value] = await Promise.all([
    adminApi.matches(bracketId.value),
    adminApi.results(bracketId.value)
  ])
}

async function generate() {
  if (!competitionId.value || !categoryId.value) return
  if (!canGenerate.value) {
    return ElMessage.warning('Chaves só podem ser geradas ou regeneradas quando as inscrições estiverem encerradas.')
  }

  const existingCurrent = filteredBrackets.value.find((item) => item.atual !== false)
  const message = existingCurrent
    ? 'Já existe uma chave vigente para esta categoria. A regeneração só será aceita se nenhuma disputa real tiver começado; a chave anterior será preservada no histórico. Continuar?'
    : 'Gerar o chaveamento agora? Apenas inscrições aprovadas e aptas entrarão.'

  try {
    await ElMessageBox.confirm(message, existingCurrent ? 'Regenerar chave' : 'Gerar chave')
    const created = await adminApi.generateBracket(competitionId.value, categoryId.value)
    ElMessage.success(existingCurrent
      ? 'Nova chave criada. A versão anterior foi preservada no histórico.'
      : 'Chaveamento criado pelo backend.')
    await loadCompetition(created.id)
    bracketId.value = created.id
    await loadBracket()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível gerar a chave.')
  }
}

function resetInspection() {
  inspection.registrationId = undefined
  inspection.aprovada = undefined
  inspection.pesoMedido = undefined
  inspection.observacao = ''
}

async function saveInspection() {
  if (!inspection.registrationId || inspection.aprovada === undefined) {
    return ElMessage.warning('Informe a inscrição e a decisão APTO/INAPTO.')
  }

  try {
    await adminApi.inspectSumo({
      registrationId: inspection.registrationId,
      aprovada: inspection.aprovada,
      pesoMedido: inspection.pesoMedido && inspection.pesoMedido > 0 ? inspection.pesoMedido : undefined,
      observacao: inspection.observacao || undefined
    })
    ElMessage.success(inspection.aprovada ? 'Inspeção registrada como APTO.' : 'Inspeção registrada como INAPTO.')
    inspectionDialog.value = false
    resetInspection()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a inspeção.')
  }
}

async function saveJudge() {
  if (!competitionId.value || !judgeForm.nome.trim()) {
    return ElMessage.warning('Informe o nome do juiz.')
  }
  try {
    await adminApi.createJudge({ competitionId: competitionId.value, nome: judgeForm.nome.trim() })
    judgeForm.nome = ''
    judgeDialog.value = false
    judges.value = await adminApi.judges(competitionId.value)
    ElMessage.success('Juiz cadastrado para a competição.')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível cadastrar o juiz.')
  }
}

watch(competitionId, async (value) => {
  if (!ready.value) return
  if (value && competition.selectedId !== value) competition.select(value)
  bracketId.value = undefined
  await loadCompetition()
})

watch(categoryId, async () => {
  if (!ready.value) return
  pickBracket()
  await loadBracket()
})

watch(bracketId, async () => {
  if (!ready.value) return
  await loadBracket()
})

onMounted(initialize)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Operação · Sumô</span>
        <h1>Sumô</h1>
        <p class="muted">Inspeção humana, chave, batalhas, rounds, juízes e progressão automática.</p>
      </div>
      <div class="heading-actions">
        <el-button @click="judgeDialog = true">Cadastrar juiz</el-button>
        <el-button @click="inspectionDialog = true">Nova inspeção</el-button>
        <el-button
          class="brand-button"
          :disabled="!canGenerate"
          :title="canGenerate ? 'Gerar ou regenerar chave' : 'Disponível somente com inscrições encerradas'"
          @click="generate"
        >Gerar nova chave</el-button>
      </div>
    </div>

    <article class="filter-bar">
      <el-select v-model="competitionId" placeholder="Competição" style="width:280px">
        <el-option v-for="item in competition.competitions" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-select v-model="categoryId" placeholder="Categoria" style="width:260px">
        <el-option v-for="item in categories" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-select v-model="bracketId" placeholder="Chaveamento" style="width:320px">
        <el-option
          v-for="item in filteredBrackets"
          :key="item.id"
          :label="`${item.nome}${item.atual !== false ? ' · Atual' : ` · Histórica #${item.id}`}`"
          :value="item.id"
        />
      </el-select>
      <el-button @click="loadCompetition(bracketId)">Atualizar</el-button>
      <span v-if="currentCompetition && !canGenerate" class="generation-hint">
        Geração disponível somente em INSCRIÇÕES ENCERRADAS.
      </span>
    </article>

    <article v-if="currentCategory" class="feature-card compact sumo-rule-card">
      <div>
        <span class="eyebrow">Regra da categoria</span>
        <h2>{{ currentCategory.nome }}</h2>
        <p class="muted">
          {{ physicalClassLabel(currentCategory) }} · {{ controlModeLabel(currentCategory) }}
          <template v-if="currentCategory.sumoControlMode === 'AUTONOMO'"> · atraso regulamentar de 5 s antes da movimentação</template>
        </p>
      </div>
      <el-tag effect="plain">{{ judges.length }} juiz{{ judges.length === 1 ? '' : 'es' }} ativo{{ judges.length === 1 ? '' : 's' }}</el-tag>
    </article>

    <article
      v-if="currentBracket"
      class="feature-card compact"
      :class="{ 'historical-bracket-banner': historicalSelected }"
    >
      <div>
        <span class="eyebrow">{{ historicalSelected ? 'Consulta histórica · somente leitura' : 'Chave vigente' }}</span>
        <h2>{{ currentBracket.nome }}</h2>
        <p v-if="historicalSelected" class="muted">
          Esta geração foi substituída por uma chave mais recente e permanece preservada para consulta.
        </p>
      </div>
      <div class="bracket-selected-status">
        <span v-if="historicalSelected" class="bracket-history-state">Histórica</span>
        <StatusBadge :value="currentBracket.status" />
      </div>
    </article>

    <article>
      <div class="card-heading sumo-bracket-heading">
        <div>
          <span class="eyebrow">Arena</span>
          <h2>Chave do campeonato</h2>
          <p class="muted">Abra uma partida para operar rounds, penalidades, falha de inicialização e decisão de juiz.</p>
        </div>
      </div>
      <TournamentBracket
        :matches="matches"
        :results="results"
        :read-only="historicalSelected"
      />
    </article>

    <article class="table-card">
      <div class="card-heading">
        <div><span class="eyebrow">Auditoria</span><h2>Resultados consolidados</h2></div>
      </div>
      <el-table :data="results" empty-text="Nenhum resultado consolidado">
        <el-table-column prop="matchId" label="Partida" width="100" />
        <el-table-column prop="winnerRobotNome" label="Vencedor" min-width="180" />
        <el-table-column prop="pontosA" label="Vitórias A" width="110" />
        <el-table-column prop="pontosB" label="Vitórias B" width="110" />
      </el-table>
    </article>

    <el-dialog v-model="inspectionDialog" title="Inspeção de Sumô" width="min(540px, 92vw)" @closed="resetInspection">
      <div class="form-grid">
        <label class="span-2">Inscrição
          <el-select v-model="inspection.registrationId" filterable style="width:100%">
            <el-option
              v-for="item in approved"
              :key="item.id"
              :label="`${item.robotNome} · ${item.teamNome}`"
              :value="item.id"
            />
          </el-select>
        </label>
        <label class="span-2">Decisão da inspeção
          <el-radio-group v-model="inspection.aprovada">
            <el-radio-button :value="true">APTO</el-radio-button>
            <el-radio-button :value="false">INAPTO</el-radio-button>
          </el-radio-group>
        </label>
        <label class="span-2">Peso medido <small class="muted">(opcional e informativo)</small>
          <el-input-number v-model="inspection.pesoMedido" :min="0.001" :precision="3" controls-position="right" />
        </label>
        <label class="span-2">Observação
          <el-input v-model="inspection.observacao" type="textarea" :rows="3" />
        </label>
        <p class="span-2 inspection-hint">O peso não decide automaticamente a aptidão. APTO/INAPTO é uma decisão humana registrada pelo RasComp.</p>
      </div>
      <template #footer>
        <el-button @click="inspectionDialog = false">Cancelar</el-button>
        <el-button class="brand-button" @click="saveInspection">Salvar inspeção</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="judgeDialog" title="Cadastrar juiz" width="min(480px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Nome do juiz
          <el-input v-model="judgeForm.nome" maxlength="150" placeholder="Nome para identificação nas decisões" />
        </label>
        <div class="span-2" v-if="judges.length">
          <span class="eyebrow">Juízes ativos</span>
          <div class="judge-list">
            <el-tag v-for="judge in judges" :key="judge.id" effect="plain">{{ judge.nome }}</el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="judgeDialog = false">Cancelar</el-button>
        <el-button class="brand-button" @click="saveJudge">Cadastrar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.sumo-bracket-heading { margin-bottom: 12px; }
.sumo-bracket-heading p { margin: 4px 0 0; }
.sumo-rule-card { align-items:center; }
.inspection-hint { margin:0; padding:10px 12px; border-radius:10px; background:#f8f3f5; color:#6f6067; font-size:12px; line-height:1.5; }
.judge-list { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.generation-hint { color:#8b6d78; font-size:11px; font-weight:700; }
</style>