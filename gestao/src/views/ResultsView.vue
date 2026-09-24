<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { Bracket, CompetitionCategoryResult, FollowAttempt, Registration } from '../types'

interface ResultRow {
  id: number
  matchId: number
  categoryNome?: string
  bracketNome?: string
  winnerRobotNome?: string
  pontosA?: number
  pontosB?: number
  robotANome?: string
  robotBNome?: string
}

const route = useRoute()
const auth = useAuthStore()
const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<ResultRow[]>([])
const scopedBracket = ref<Bracket>()
const categoryResults = ref<CompetitionCategoryResult[]>([])

const extraDialog = ref(false)
const extraSaving = ref(false)
const extraTarget = ref<CompetitionCategoryResult>()
const extraForm = reactive({
  dataHora: '',
  pista: '',
  ordemExecucao: undefined as number | undefined
})

const manualDialog = ref(false)
const manualSaving = ref(false)
const manualTarget = ref<CompetitionCategoryResult>()
const manualRegistrationId = ref<number>()
const manualReason = ref('')
const manualCandidates = ref<Array<{
  registration: Registration
  maxCheckpoints: number
}>>([])

const sumoLink = computed(() =>
  scopedBracket.value
    ? {
        path: '/sumo',
        query: {
          competitionId: String(scopedBracket.value.competitionId),
          categoryId: String(scopedBracket.value.categoryId),
          bracketId: String(scopedBracket.value.id)
        }
      }
    : '/sumo'
)

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(3)} s`
}

function winnerDetail(item: CompetitionCategoryResult) {
  if (item.status !== 'CONCLUIDO') return 'Resultado ainda pendente'
  if (item.modalidade === 'FOLLOW_LINE') {
    if (item.resolutionType === 'DECISAO_ORGANIZACAO') {
      return 'Definido por decisão da organização'
    }
    return `Melhor tempo: ${formatSeconds(item.tempoFinalSegundos)}`
  }
  return item.pontosA != null && item.pontosB != null
    ? `Final: ${item.pontosA} × ${item.pontosB}`
    : 'Campeão da chave atual'
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

function queryNumber(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function openExtraTake(item: CompetitionCategoryResult) {
  extraTarget.value = item
  extraForm.dataHora = ''
  extraForm.pista = ''
  extraForm.ordemExecucao = undefined
  extraDialog.value = true
}

async function saveExtraTake() {
  const item = extraTarget.value
  if (!item || !competition.selectedId || !item.extraTakeNumber) return

  if (!extraForm.dataHora) {
    return ElMessage.warning('Informe data e horário da Tomada Extra.')
  }

  extraSaving.value = true
  try {
    await adminApi.createExtraFollowSchedule({
      competitionId: competition.selectedId,
      categoryId: item.categoryId,
      tomada: item.extraTakeNumber,
      dataHora: extraForm.dataHora,
      pista: extraForm.pista.trim() || undefined,
      ordemExecucao: extraForm.ordemExecucao,
      status: 'AGENDADA',
      ativo: true
    })
    ElMessage.success(`Tomada Extra ${item.extraTakeNumber} criada e adicionada à Agenda.`)
    extraDialog.value = false
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível criar a Tomada Extra.')
  } finally {
    extraSaving.value = false
  }
}

async function openManualDecision(item: CompetitionCategoryResult) {
  if (!competition.selectedId) return

  manualTarget.value = item
  manualRegistrationId.value = undefined
  manualReason.value = ''
  manualCandidates.value = []

  try {
    const [registrations, attempts] = await Promise.all([
      adminApi.registrations({ competitionId: competition.selectedId }),
      adminApi.followAttempts(competition.selectedId, item.categoryId)
    ])

    const byRegistration = new Map<number, FollowAttempt[]>()
    for (const attempt of attempts) {
      const list = byRegistration.get(attempt.registrationId) || []
      list.push(attempt)
      byRegistration.set(attempt.registrationId, list)
    }

    manualCandidates.value = registrations
      .filter((registration) =>
        registration.categoryId === item.categoryId
          && registration.status === 'APROVADA'
          && registration.ativo !== false
      )
      .map((registration) => ({
        registration,
        maxCheckpoints: Math.max(
          0,
          ...(byRegistration.get(registration.id) || []).map((attempt) => attempt.checkpointsAlcancados || 0)
        )
      }))
      .sort((a, b) => b.maxCheckpoints - a.maxCheckpoints || a.registration.id - b.registration.id)

    manualDialog.value = true
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os candidatos do Follow.')
  }
}

async function saveManualDecision() {
  const item = manualTarget.value
  if (!item || !competition.selectedId || !manualRegistrationId.value) {
    return ElMessage.warning('Selecione o robô definido pela organização.')
  }
  if (!manualReason.value.trim()) {
    return ElMessage.warning('Informe a justificativa da decisão.')
  }

  manualSaving.value = true
  try {
    await adminApi.defineFollowManualResult({
      competitionId: competition.selectedId,
      categoryId: item.categoryId,
      winnerRegistrationId: manualRegistrationId.value,
      justificativa: manualReason.value.trim()
    })
    ElMessage.success('Resultado do Follow definido e auditado.')
    manualDialog.value = false
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a decisão da organização.')
  } finally {
    manualSaving.value = false
  }
}

async function load() {
  loading.value = true
  try {
    await competition.load()

    const requestedCompetition = queryNumber(route.query.competitionId)
    if (requestedCompetition && competition.competitions.some((item) => item.id === requestedCompetition)) {
      if (competition.selectedId !== requestedCompetition) competition.select(requestedCompetition)
    }

    if (!competition.selectedId) {
      rows.value = []
      categoryResults.value = []
      scopedBracket.value = undefined
      return
    }

    const brackets = await adminApi.brackets(competition.selectedId)
    const requestedBracket = queryNumber(route.query.bracketId)
    scopedBracket.value = requestedBracket ? brackets.find((item) => item.id === requestedBracket) : undefined
    const sourceBrackets = scopedBracket.value
      ? [scopedBracket.value]
      : brackets.filter((item) => item.atual !== false && item.ativo !== false)

    categoryResults.value = scopedBracket.value
      ? []
      : await adminApi.competitionResults(competition.selectedId)

    const groups = await Promise.all(
      sourceBrackets.map(async (bracket) => {
        const [matches, results] = await Promise.all([
          adminApi.matches(bracket.id),
          adminApi.results(bracket.id)
        ])
        return results.map((result) => {
          const match = matches.find((item) => item.id === result.matchId)
          return {
            id: result.id,
            matchId: result.matchId,
            categoryNome: bracket.categoryNome,
            bracketNome: bracket.nome,
            winnerRobotNome: result.winnerRobotNome,
            pontosA: result.pontosA,
            pontosB: result.pontosB,
            robotANome: match?.robotANome,
            robotBNome: match?.robotBNome
          }
        })
      })
    )
    rows.value = groups.flat().sort((a, b) => b.matchId - a.matchId)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os resultados.')
  } finally {
    loading.value = false
  }
}

watch(() => competition.selectedId, load)
watch(() => route.fullPath, load)
onMounted(load)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">{{ scopedBracket?.atual === false ? 'Consulta histórica' : 'Competição ao vivo' }}</span>
        <h1>Resultados</h1>
        <p class="muted">{{ scopedBracket ? `Resultados de ${scopedBracket.nome}.` : 'Vencedores por categoria e resultados consolidados da edição operacional.' }}</p>
      </div>
      <div class="heading-actions"><router-link :to="sumoLink" class="link-button">Abrir no Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip" :class="{ 'historical-bracket-banner': scopedBracket?.atual === false }">
      <div>
        <span class="eyebrow">{{ scopedBracket ? (scopedBracket.atual === false ? 'Chave histórica · somente leitura' : 'Chave vigente') : (auth.isDev ? 'Competição em foco' : 'Competição vigente') }}</span>
        <h2>{{ scopedBracket?.nome || competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2>
      </div>
      <strong>{{ rows.length }} resultado(s)</strong>
    </article>

    <section v-if="!scopedBracket" class="results-winners-section">
      <div class="section-mini-heading">
        <div>
          <span class="eyebrow">Classificação final</span>
          <strong>Vencedores por categoria</strong>
        </div>
        <span>{{ categoryResults.filter((item) => item.status === 'CONCLUIDO').length }}/{{ categoryResults.length }} definidos</span>
      </div>

      <div v-if="categoryResults.length" class="category-winners-grid">
        <article v-for="item in categoryResults" :key="item.categoryId" class="category-winner-card" :class="{ pending: item.status !== 'CONCLUIDO' }">
          <div class="winner-card-top">
            <el-tag :type="item.modalidade === 'FOLLOW_LINE' ? 'success' : 'danger'" effect="light">
              {{ item.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}
            </el-tag>
            <span>{{ item.status === 'CONCLUIDO' ? 'Definido' : 'Pendente' }}</span>
          </div>
          <small>{{ item.categoryNome }}</small>
          <template v-if="item.status === 'CONCLUIDO'">
            <strong>{{ item.winnerRobotNome }}</strong>
            <span>{{ item.winnerTeamNome }}</span>
            <em>{{ winnerDetail(item) }}</em>
            <div v-if="item.resolutionType === 'DECISAO_ORGANIZACAO'" class="follow-manual-result-note">
              <small>{{ item.resolutionReason }}</small>
              <span>{{ item.resolutionActorNome || 'Organização' }} · {{ formatDateTime(item.resolutionAt) }}</span>
            </div>
          </template>
          <template v-else>
            <strong>Campeão ainda não definido</strong>
            <span v-if="item.modalidade === 'FOLLOW_LINE' && item.extraTakeActive">
              Tomada Extra {{ item.extraTakeNumber }} em disputa.
            </span>
            <span v-else>{{ winnerDetail(item) }}</span>

            <div
              v-if="item.modalidade === 'FOLLOW_LINE' && (item.extraTakeAvailable || item.manualDecisionAvailable)"
              class="follow-resolution-actions"
            >
              <el-button
                v-if="item.extraTakeAvailable"
                size="small"
                class="edition-action-button"
                @click="openExtraTake(item)"
              >
                Criar Tomada Extra
              </el-button>
              <el-button
                v-if="item.manualDecisionAvailable"
                size="small"
                type="warning"
                plain
                @click="openManualDecision(item)"
              >
                Decisão da organização
              </el-button>
            </div>
          </template>
          <router-link
            v-if="item.modalidade === 'SUMO' && item.finalMatchId"
            :to="{ name: 'sumo-match', params: { matchId: String(item.finalMatchId) } }"
            class="text-link"
          >Ver final</router-link>
          <router-link
            v-else-if="item.modalidade === 'FOLLOW_LINE'"
            :to="{ name: 'follow', query: { categoryId: String(item.categoryId), competitionId: String(competition.selectedId || '') } }"
            class="text-link"
          >Ver ranking</router-link>
        </article>
      </div>
      <div v-else class="results-winners-empty">Nenhuma categoria com inscrições nesta edição.</div>
    </section>

    <article class="table-card">
      <el-table :data="rows" empty-text="Nenhum resultado consolidado">
        <el-table-column prop="categoryNome" label="Categoria" min-width="170" />
        <el-table-column v-if="!scopedBracket" prop="bracketNome" label="Chave" min-width="210" />
        <el-table-column label="Confronto" min-width="260">
          <template #default="{ row }">{{ row.robotANome || '—' }} <span class="versus">×</span> {{ row.robotBNome || '—' }}</template>
        </el-table-column>
        <el-table-column prop="winnerRobotNome" label="Vencedor" min-width="180" />
        <el-table-column label="Placar" width="110"><template #default="{ row }"><strong>{{ row.pontosA ?? 0 }} × {{ row.pontosB ?? 0 }}</strong></template></el-table-column>
        <el-table-column prop="matchId" label="Partida" width="90" />
      </el-table>
    </article>

    <el-dialog v-model="extraDialog" title="Criar Tomada Extra" width="min(560px, 94vw)">
      <div v-if="extraTarget" class="follow-resolution-dialog">
        <div class="follow-resolution-context">
          <span class="eyebrow">{{ extraTarget.categoryNome }}</span>
          <strong>Tomada Extra {{ extraTarget.extraTakeNumber }}</strong>
          <small>
            Esta chamada é excepcional e não altera o formato oficial de tomadas da categoria.
          </small>
        </div>
        <label>Data e horário
          <el-date-picker
            v-model="extraForm.dataHora"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            format="DD/MM/YYYY HH:mm"
            style="width:100%"
          />
        </label>
        <label>Pista
          <el-input v-model="extraForm.pista" maxlength="80" placeholder="Ex.: Pista A" />
        </label>
        <label>Ordem geral
          <el-input-number v-model="extraForm.ordemExecucao" :min="1" style="width:100%" />
        </label>
      </div>
      <template #footer>
        <el-button @click="extraDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="extraSaving" @click="saveExtraTake">Criar Tomada Extra</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="manualDialog" title="Decisão da organização" width="min(680px, 94vw)">
      <div v-if="manualTarget" class="follow-resolution-dialog">
        <div class="follow-resolution-context">
          <span class="eyebrow">{{ manualTarget.categoryNome }}</span>
          <strong>Definir vencedor sem tempo classificável</strong>
          <small>
            Os checkpoints abaixo servem apenas como apoio. A escolha é administrativa e exige justificativa.
          </small>
        </div>

        <el-radio-group v-model="manualRegistrationId" class="follow-manual-candidates">
          <el-radio
            v-for="candidate in manualCandidates"
            :key="candidate.registration.id"
            :value="candidate.registration.id"
            border
          >
            <span>{{ candidate.registration.robotNome }} · {{ candidate.registration.teamNome }}</span>
            <small>{{ candidate.maxCheckpoints }} checkpoint(s) alcançado(s)</small>
          </el-radio>
        </el-radio-group>

        <label>Justificativa
          <el-input
            v-model="manualReason"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="Explique o critério utilizado pela organização para definir o vencedor."
          />
        </label>
      </div>
      <template #footer>
        <el-button @click="manualDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="manualSaving" @click="saveManualDecision">
          Registrar decisão
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>


<style scoped>
.follow-resolution-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.follow-manual-result-note { display:grid; gap:3px; margin-top:6px; padding:8px 10px; border-radius:10px; background:#f7f1f4; }
.follow-manual-result-note small { color:#5f5058; line-height:1.4; }
.follow-manual-result-note span { color:#8a7880; font-size:10px; }
.follow-resolution-dialog { display:grid; gap:16px; }
.follow-resolution-dialog > label { display:grid; gap:7px; color:#3a2b33; font-size:12px; font-weight:800; }
.follow-resolution-context { display:grid; gap:4px; padding:12px 14px; border:1px solid #eadde3; border-radius:12px; background:#fff8fa; }
.follow-resolution-context .eyebrow { margin:0; }
.follow-resolution-context small { color:#7d6d75; line-height:1.45; }
.follow-manual-candidates { display:grid; gap:8px; }
.follow-manual-candidates :deep(.el-radio) { width:100%; height:auto; min-height:48px; margin:0; padding:10px 12px; }
.follow-manual-candidates :deep(.el-radio__label) { display:grid; gap:2px; white-space:normal; }
.follow-manual-candidates small { color:#87777f; font-size:10px; }
.results-winners-section { display:grid; gap:12px; }
.category-winners-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
.category-winner-card { display:grid; gap:6px; min-height:180px; padding:16px; border:1px solid #e8dce2; border-radius:15px; background:linear-gradient(145deg,#fff,#fff8fa); box-shadow:0 8px 22px rgba(69,23,45,.04); }
.category-winner-card.pending { background:#fcfafb; }
.winner-card-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.winner-card-top > span { color:#88777f; font-size:10px; font-weight:800; text-transform:uppercase; }
.category-winner-card > small { color:#8c7d84; }
.category-winner-card > strong { margin-top:5px; color:#31242a; font-size:20px; }
.category-winner-card > span { color:#6f6067; font-size:12px; }
.category-winner-card > em { color:#9f0f3b; font-size:12px; font-style:normal; font-weight:800; }
.category-winner-card .text-link { margin-top:auto; }
.results-winners-empty { padding:28px; border:1px dashed #ddd0d6; border-radius:14px; color:#84757d; text-align:center; }
@media (max-width:1000px) { .category-winners-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:680px) { .category-winners-grid { grid-template-columns:1fr; } }
</style>
