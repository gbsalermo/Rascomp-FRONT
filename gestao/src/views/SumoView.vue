<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket, Category, Match, MatchResult, Registration } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const route = useRoute()
const competition = useCompetitionStore()
const loading = ref(false)
const ready = ref(false)
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])
const brackets = ref<Bracket[]>([])
const matches = ref<Match[]>([])
const results = ref<MatchResult[]>([])
const competitionId = ref<number>()
const categoryId = ref<number>()
const bracketId = ref<number>()
const roundDialog = ref(false)
const inspectionDialog = ref(false)
const round = reactive({ matchId: undefined as number | undefined, winnerRegistrationId: undefined as number | undefined, status: 'FINALIZADO', observacao: '' })
const inspection = reactive({ registrationId: undefined as number | undefined, pesoMedido: 0, observacao: '' })

const currentBracket = computed(() => brackets.value.find((item) => item.id === bracketId.value))
const historicalSelected = computed(() => currentBracket.value?.atual === false)
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
const approved = computed(() => registrations.value.filter((r) => r.status === 'APROVADA' && r.categoryId === categoryId.value))
const selectedMatch = computed(() => matches.value.find((m) => m.id === round.matchId))

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
    bracketId.value = undefined
    await loadBracket()
    return
  }

  loading.value = true
  try {
    const [br, regs] = await Promise.all([
      adminApi.brackets(competitionId.value),
      adminApi.registrations({ competitionId: competitionId.value })
    ])
    brackets.value = br
    registrations.value = regs

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
  const existingCurrent = filteredBrackets.value.find((item) => item.atual !== false)
  const message = existingCurrent
    ? 'Já existe uma chave vigente para esta categoria. A nova geração se tornará a atual e a anterior será preservada no histórico. Continuar?'
    : 'Gerar o chaveamento agora? Apenas inscrições aptas entrarão.'

  try {
    await ElMessageBox.confirm(message, 'Gerar nova chave')
    const created = await adminApi.generateBracket(competitionId.value, categoryId.value)
    ElMessage.success(existingCurrent ? 'Nova chave criada. A versão anterior foi preservada no histórico.' : 'Chaveamento criado pelo backend.')
    await loadCompetition(created.id)
    bracketId.value = created.id
    await loadBracket()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível gerar a chave.')
  }
}

function openRound(match: Match) {
  if (historicalSelected.value) {
    ElMessage.warning('Chaves históricas são somente leitura. Abra a chave vigente para registrar rounds.')
    return
  }
  round.matchId = match.id
  round.winnerRegistrationId = undefined
  round.status = 'FINALIZADO'
  round.observacao = ''
  roundDialog.value = true
}

async function saveRound() {
  if (!round.matchId || historicalSelected.value) return
  try {
    await adminApi.createRound({ ...round })
    ElMessage.success('Round registrado. Resultado/progressão foram recalculados no backend.')
    roundDialog.value = false
    await loadCompetition(bracketId.value)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar o round.')
  }
}

async function saveInspection() {
  if (!inspection.registrationId || inspection.pesoMedido <= 0) return ElMessage.warning('Informe inscrição e peso.')
  try {
    await adminApi.inspectSumo({ ...inspection })
    ElMessage.success('Inspeção registrada.')
    inspectionDialog.value = false
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a inspeção.')
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
      <div><span class="eyebrow">Operação · Sumô</span><h1>Sumô</h1><p class="muted">Inspeção, chave, partidas, rounds e progressão automática.</p></div>
      <div class="heading-actions"><el-button @click="inspectionDialog=true">Nova inspeção</el-button><el-button class="brand-button" @click="generate">Gerar nova chave</el-button></div>
    </div>

    <article class="filter-bar">
      <el-select v-model="competitionId" placeholder="Competição" style="width:280px"><el-option v-for="item in competition.competitions" :key="item.id" :label="item.nome" :value="item.id" /></el-select>
      <el-select v-model="categoryId" placeholder="Categoria" style="width:260px"><el-option v-for="item in categories" :key="item.id" :label="item.nome" :value="item.id" /></el-select>
      <el-select v-model="bracketId" placeholder="Chaveamento" style="width:320px">
        <el-option
          v-for="item in filteredBrackets"
          :key="item.id"
          :label="`${item.nome}${item.atual !== false ? ' · Atual' : ` · Histórica #${item.id}`}`"
          :value="item.id"
        />
      </el-select>
      <el-button @click="loadCompetition(bracketId)">Atualizar</el-button>
    </article>

    <article v-if="currentBracket" class="feature-card compact" :class="{ 'historical-bracket-banner': historicalSelected }">
      <div>
        <span class="eyebrow">{{ historicalSelected ? 'Consulta histórica · somente leitura' : 'Chave vigente' }}</span>
        <h2>{{ currentBracket.nome }}</h2>
        <p v-if="historicalSelected" class="muted">Esta geração foi substituída por uma chave mais recente e permanece preservada para consulta.</p>
      </div>
      <div class="bracket-selected-status">
        <span v-if="historicalSelected" class="bracket-history-state">Histórica</span>
        <StatusBadge :value="currentBracket.status" />
      </div>
    </article>

    <article class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Arena</span><h2>Partidas da chave</h2></div></div>
      <el-table :data="matches" empty-text="Nenhuma partida — gere ou selecione um chaveamento">
        <el-table-column prop="rodada" label="Rodada" width="90" />
        <el-table-column prop="ordem" label="#" width="60" />
        <el-table-column label="Confronto" min-width="260">
          <template #default="{ row }"><strong>{{ row.robotANome || 'A definir' }}</strong><span class="versus">×</span><strong>{{ row.robotBNome || 'A definir' }}</strong></template>
        </el-table-column>
        <el-table-column label="Status" width="190"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
        <el-table-column label="" width="160">
          <template #default="{ row }"><el-button size="small" :disabled="historicalSelected || !row.registrationAId || !row.registrationBId || row.status === 'FINALIZADA'" @click="openRound(row)">Registrar round</el-button></template>
        </el-table-column>
      </el-table>
    </article>

    <article class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Somente leitura</span><h2>Resultados consolidados</h2></div></div>
      <el-table :data="results" empty-text="Nenhum resultado consolidado">
        <el-table-column prop="matchId" label="Partida" width="100" />
        <el-table-column prop="winnerRobotNome" label="Vencedor" min-width="180" />
        <el-table-column prop="pontosA" label="A" width="70" />
        <el-table-column prop="pontosB" label="B" width="70" />
      </el-table>
    </article>

    <el-dialog v-model="roundDialog" title="Registrar round" width="min(520px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Vencedor
          <el-select v-model="round.winnerRegistrationId" clearable style="width:100%">
            <el-option v-if="selectedMatch?.registrationAId" :label="selectedMatch.robotANome" :value="selectedMatch.registrationAId" />
            <el-option v-if="selectedMatch?.registrationBId" :label="selectedMatch.robotBNome" :value="selectedMatch.registrationBId" />
          </el-select>
        </label>
        <label class="span-2">Status
          <el-select v-model="round.status" style="width:100%">
            <el-option v-for="item in ['FINALIZADO','EMPATADO','ANULADO','CANCELADO']" :key="item" :label="item" :value="item" />
          </el-select>
        </label>
        <label class="span-2">Observação<el-input v-model="round.observacao" type="textarea" /></label>
      </div>
      <template #footer><el-button @click="roundDialog=false">Cancelar</el-button><el-button class="brand-button" :disabled="historicalSelected" @click="saveRound">Registrar</el-button></template>
    </el-dialog>

    <el-dialog v-model="inspectionDialog" title="Inspeção de Sumô" width="min(520px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Inscrição
          <el-select v-model="inspection.registrationId" filterable style="width:100%">
            <el-option v-for="item in approved" :key="item.id" :label="`${item.robotNome} · ${item.teamNome}`" :value="item.id" />
          </el-select>
        </label>
        <label class="span-2">Peso medido<el-input-number v-model="inspection.pesoMedido" :min="0.001" :precision="3" /></label>
        <label class="span-2">Observação<el-input v-model="inspection.observacao" type="textarea" /></label>
      </div>
      <template #footer><el-button @click="inspectionDialog=false">Cancelar</el-button><el-button class="brand-button" @click="saveInspection">Salvar inspeção</el-button></template>
    </el-dialog>
  </div>
</template>
