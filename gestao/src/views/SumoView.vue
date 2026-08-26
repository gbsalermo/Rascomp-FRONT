<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type {
  Bracket,
  Category,
  ConfigSumo,
  Match,
  MatchResult,
  Registration,
  RoundSumo,
  RoundSumoOutcomeReason,
  RoundSumoStatus
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'
import TournamentBracket from '../components/TournamentBracket.vue'

interface BattleSlot {
  numeroRound: number
  choice?: 'A' | 'B' | 'EMPATADO' | 'ANULADO' | 'CANCELADO'
  motivoResultado: RoundSumoOutcomeReason
  penalidadesA: number
  penalidadesB: number
}

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
const battleDialog = ref(false)
const battleLoading = ref(false)
const inspectionDialog = ref(false)
const battleConfig = ref<ConfigSumo>()
const battleRounds = ref<RoundSumo[]>([])
const battleSlots = ref<BattleSlot[]>([])
const battle = reactive({ matchId: undefined as number | undefined, observacao: '' })
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
const selectedMatch = computed(() => matches.value.find((m) => m.id === battle.matchId))
const projectedBattleScore = computed(() => scoreUntil(Number.POSITIVE_INFINITY, true))
const pendingBattleRounds = computed(() =>
  battleSlots.value.filter((slot) => slot.choice && !existingRound(slot.numeroRound))
)
const battleWinner = computed<'A' | 'B' | undefined>(() => {
  const target = battleConfig.value?.roundsParaVencer || 0
  if (!target) return undefined
  if (projectedBattleScore.value.A >= target) return 'A'
  if (projectedBattleScore.value.B >= target) return 'B'
  return undefined
})

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

async function openBattle(match: Match) {
  if (historicalSelected.value) {
    ElMessage.warning('Chaves históricas são somente leitura. Abra a chave vigente para registrar a batalha.')
    return
  }
  if (!categoryId.value) return

  battle.matchId = match.id
  battle.observacao = ''
  battleRounds.value = []
  battleSlots.value = []
  battleDialog.value = true
  battleLoading.value = true

  try {
    const [rounds, config] = await Promise.all([
      adminApi.rounds(match.id),
      adminApi.sumoConfig(categoryId.value)
    ])
    battleRounds.value = [...rounds].sort((a, b) => a.numeroRound - b.numeroRound)
    battleConfig.value = config

    const totalSlots = config.numeroRounds + (config.permiteRoundDesempate ? 1 : 0)
    battleSlots.value = Array.from({ length: totalSlots }, (_, index) => ({
      numeroRound: index + 1,
      motivoResultado: 'DISPUTA',
      penalidadesA: 0,
      penalidadesB: 0
    }))
  } catch (error: any) {
    battleDialog.value = false
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os rounds da batalha.')
  } finally {
    battleLoading.value = false
  }
}

function existingRound(numeroRound: number) {
  return battleRounds.value.find((round) => round.numeroRound === numeroRound)
}

function roundChoicePayload(slot: BattleSlot) {
  const match = selectedMatch.value
  if (!slot.choice || !match) return undefined

  const common = {
    motivoResultado: slot.choice === 'A' || slot.choice === 'B' ? slot.motivoResultado : 'DISPUTA' as RoundSumoOutcomeReason,
    penalidadesA: slot.penalidadesA,
    penalidadesB: slot.penalidadesB,
    observacao: battle.observacao || undefined
  }

  if (slot.choice === 'A') {
    return { ...common, winnerRegistrationId: match.registrationAId, status: 'FINALIZADO' as RoundSumoStatus }
  }
  if (slot.choice === 'B') {
    return { ...common, winnerRegistrationId: match.registrationBId, status: 'FINALIZADO' as RoundSumoStatus }
  }
  return { ...common, status: slot.choice as RoundSumoStatus }
}

function scoreUntil(numeroRound: number, includePending: boolean) {
  const match = selectedMatch.value
  let A = 0
  let B = 0
  if (!match) return { A, B }

  for (const round of battleRounds.value) {
    if (round.numeroRound >= numeroRound || round.status !== 'FINALIZADO') continue
    if (round.winnerRegistrationId === match.registrationAId) A++
    if (round.winnerRegistrationId === match.registrationBId) B++
  }

  if (includePending) {
    for (const slot of battleSlots.value) {
      if (slot.numeroRound >= numeroRound) continue
      if (existingRound(slot.numeroRound)) continue
      if (slot.choice === 'A') A++
      if (slot.choice === 'B') B++
    }
  }

  return { A, B }
}

function scoreIncludingAll(includePending: boolean) {
  const max = (battleConfig.value?.numeroRounds || 0) + 2
  return scoreUntil(max, includePending)
}

function roundEnabled(numeroRound: number) {
  if (!battleConfig.value || existingRound(numeroRound)) return false

  const target = battleConfig.value.roundsParaVencer
  const before = scoreUntil(numeroRound, true)
  if (before.A >= target || before.B >= target) return false

  for (let previous = 1; previous < numeroRound; previous++) {
    if (existingRound(previous)) continue
    const slot = battleSlots.value.find((item) => item.numeroRound === previous)
    if (!slot?.choice) return false
  }

  if (numeroRound === battleConfig.value.numeroRounds + 1) {
    if (!battleConfig.value.permiteRoundDesempate) return false
    const afterRegular = scoreUntil(numeroRound, true)
    return afterRegular.A < target && afterRegular.B < target
  }

  return numeroRound <= battleConfig.value.numeroRounds
}

function clearRoundsAfter(numeroRound: number) {
  const target = battleConfig.value?.roundsParaVencer || 0
  for (const later of battleSlots.value.filter((item) => item.numeroRound > numeroRound)) {
    const before = scoreUntil(later.numeroRound, true)
    if (before.A >= target || before.B >= target) {
      later.choice = undefined
      later.motivoResultado = 'DISPUTA'
      later.penalidadesA = 0
      later.penalidadesB = 0
    }
  }
}

function chooseRound(slot: BattleSlot, choice: BattleSlot['choice']) {
  if (!roundEnabled(slot.numeroRound)) return
  slot.choice = choice
  slot.motivoResultado = 'DISPUTA'
  clearRoundsAfter(slot.numeroRound)
}

function handleRoundChoice(slot: BattleSlot, value: unknown) {
  chooseRound(slot, value as BattleSlot['choice'])
}

function applyWo(slot: BattleSlot, loser: 'A' | 'B') {
  if (!roundEnabled(slot.numeroRound)) return
  slot.choice = loser === 'A' ? 'B' : 'A'
  slot.motivoResultado = 'SUICIDIO_WO'
  clearRoundsAfter(slot.numeroRound)
}

function applyFinish(side: 'A' | 'B') {
  if (!battleConfig.value || !selectedMatch.value) return

  for (const slot of battleSlots.value) {
    if (!existingRound(slot.numeroRound)) {
      slot.choice = undefined
      slot.motivoResultado = 'DISPUTA'
      slot.penalidadesA = 0
      slot.penalidadesB = 0
    }
  }

  const target = battleConfig.value.roundsParaVencer
  let score = scoreIncludingAll(false)[side]

  for (const slot of battleSlots.value) {
    if (score >= target) break
    if (existingRound(slot.numeroRound)) continue
    if (!roundEnabled(slot.numeroRound)) continue
    slot.choice = side
    slot.motivoResultado = 'DISPUTA'
    score++
  }
}

function roundWinnerLabel(round: RoundSumo) {
  if (round.status !== 'FINALIZADO') return round.status.replaceAll('_', ' ')
  const suffix = round.motivoResultado === 'SUICIDIO_WO' ? ' · Suicídio/WO do adversário' : ''
  return round.winnerRobotNome ? `${round.winnerRobotNome} venceu${suffix}` : `Finalizado${suffix}`
}

function existingRoundLabel(numeroRound: number) {
  const round = existingRound(numeroRound)
  return round ? roundWinnerLabel(round) : ''
}

function existingPenaltyLabel(round: RoundSumo) {
  const a = round.penalidadesA || 0
  const b = round.penalidadesB || 0
  return `Penalidades A: ${a} · B: ${b}`
}

async function saveBattle() {
  if (!battle.matchId || historicalSelected.value) return

  const rounds = battleSlots.value
    .filter((slot) => slot.choice && !existingRound(slot.numeroRound))
    .sort((a, b) => a.numeroRound - b.numeroRound)
    .map(roundChoicePayload)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  if (!rounds.length) {
    return ElMessage.warning('Marque ao menos um round antes de salvar.')
  }

  try {
    await adminApi.registerSumoBattle({ matchId: battle.matchId, rounds })
    ElMessage.success(`${rounds.length} round(s) registrado(s). Resultado e progressão recalculados pelo backend.`)
    battleDialog.value = false
    await loadCompetition(bracketId.value)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a batalha.')
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
      <div><span class="eyebrow">Operação · Sumô</span><h1>Sumô</h1><p class="muted">Inspeção, chave, batalhas, rounds e progressão automática.</p></div>
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

    <article>
      <div class="card-heading sumo-bracket-heading">
        <div><span class="eyebrow">Arena</span><h2>Chave do campeonato</h2><p class="muted">O vencedor de cada confronto avança automaticamente pelo backend.</p></div>
      </div>
      <TournamentBracket
        :matches="matches"
        :results="results"
        :read-only="historicalSelected"
        @register="openBattle"
      />
    </article>

    <article class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Auditoria</span><h2>Resultados consolidados</h2></div></div>
      <el-table :data="results" empty-text="Nenhum resultado consolidado">
        <el-table-column prop="matchId" label="Partida" width="100" />
        <el-table-column prop="winnerRobotNome" label="Vencedor" min-width="180" />
        <el-table-column prop="pontosA" label="Vitórias A" width="110" />
        <el-table-column prop="pontosB" label="Vitórias B" width="110" />
      </el-table>
    </article>

    <el-dialog v-model="battleDialog" title="Registrar resultado da batalha" width="min(860px, 96vw)" destroy-on-close>
      <div v-loading="battleLoading" class="battle-dialog-body">
        <template v-if="selectedMatch && battleConfig">
          <div class="battle-scoreboard">
            <div class="battle-robot">
              <span>Robô A</span>
              <strong>{{ selectedMatch.robotANome }}</strong>
              <b>{{ projectedBattleScore.A }}</b>
            </div>
            <div class="battle-rule">
              <span>Melhor de {{ battleConfig.numeroRounds }}</span>
              <strong>{{ battleConfig.roundsParaVencer }} vitórias para vencer</strong>
            </div>
            <div class="battle-robot battle-robot-b">
              <span>Robô B</span>
              <strong>{{ selectedMatch.robotBNome }}</strong>
              <b>{{ projectedBattleScore.B }}</b>
            </div>
          </div>

          <div v-if="!battleWinner" class="battle-shortcuts">
            <span>Atalho</span>
            <el-button @click="applyFinish('A')">Fechar para {{ selectedMatch.robotANome }}</el-button>
            <el-button @click="applyFinish('B')">Fechar para {{ selectedMatch.robotBNome }}</el-button>
          </div>

          <div class="battle-rounds">
            <div
              v-for="slot in battleSlots"
              :key="slot.numeroRound"
              class="battle-round-row"
              :class="{ disabled: !existingRound(slot.numeroRound) && !roundEnabled(slot.numeroRound) }"
            >
              <div class="round-index">
                <span>{{ slot.numeroRound > battleConfig.numeroRounds ? 'Extra' : `Round ${slot.numeroRound}` }}</span>
                <small v-if="existingRound(slot.numeroRound)">Registrado</small>
                <small v-else-if="slot.numeroRound > battleConfig.numeroRounds">Desempate</small>
              </div>

              <div v-if="existingRound(slot.numeroRound)" class="round-existing">
                <div class="round-existing-main">
                  <StatusBadge :value="existingRound(slot.numeroRound)?.status" />
                  <strong>{{ existingRoundLabel(slot.numeroRound) }}</strong>
                </div>
                <small>{{ existingPenaltyLabel(existingRound(slot.numeroRound)!) }}</small>
              </div>

              <div v-else class="round-entry">
                <el-radio-group
                  :model-value="slot.choice"
                  :disabled="!roundEnabled(slot.numeroRound)"
                  class="round-choice-group"
                  @update:model-value="handleRoundChoice(slot, $event)"
                >
                  <el-radio-button value="A">{{ selectedMatch.robotANome }}</el-radio-button>
                  <el-radio-button value="B">{{ selectedMatch.robotBNome }}</el-radio-button>
                  <el-radio-button value="EMPATADO">Empate</el-radio-button>
                  <el-radio-button value="ANULADO">Anulado</el-radio-button>
                  <el-radio-button value="CANCELADO">Cancelado</el-radio-button>
                </el-radio-group>

                <div class="round-operations">
                  <div class="round-penalties">
                    <span>Penalidades no round</span>
                    <label>
                      {{ selectedMatch.robotANome }}
                      <el-input-number v-model="slot.penalidadesA" :min="0" :max="2" :disabled="!roundEnabled(slot.numeroRound)" size="small" />
                    </label>
                    <label>
                      {{ selectedMatch.robotBNome }}
                      <el-input-number v-model="slot.penalidadesB" :min="0" :max="2" :disabled="!roundEnabled(slot.numeroRound)" size="small" />
                    </label>
                  </div>

                  <div class="round-wo-actions">
                    <span>Perda automática do round</span>
                    <el-button size="small" :disabled="!roundEnabled(slot.numeroRound)" @click="applyWo(slot, 'A')">
                      Suicídio/WO · {{ selectedMatch.robotANome }}
                    </el-button>
                    <el-button size="small" :disabled="!roundEnabled(slot.numeroRound)" @click="applyWo(slot, 'B')">
                      Suicídio/WO · {{ selectedMatch.robotBNome }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="battleWinner" class="battle-projection">
            <strong>{{ battleWinner === 'A' ? selectedMatch.robotANome : selectedMatch.robotBNome }} fecha a batalha</strong>
            <span>Placar projetado: {{ projectedBattleScore.A }} × {{ projectedBattleScore.B }}</span>
          </div>

          <p class="battle-rule-note">Penalidades são registradas para auditoria com limite provisório de 2 por robô/round. Elas ainda não alteram automaticamente o vencedor até a regra oficial ser confirmada.</p>

          <label class="battle-note">Observação para os novos rounds
            <el-input v-model="battle.observacao" type="textarea" :rows="2" placeholder="Opcional" />
          </label>
        </template>
      </div>

      <template #footer>
        <el-button @click="battleDialog=false">Cancelar</el-button>
        <el-button
          class="brand-button"
          :disabled="historicalSelected || !pendingBattleRounds.length"
          @click="saveBattle"
        >
          Salvar {{ pendingBattleRounds.length || '' }} {{ pendingBattleRounds.length === 1 ? 'round' : 'rounds' }}
        </el-button>
      </template>
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

<style scoped>
.sumo-bracket-heading {
  margin-bottom: 12px;
}

.sumo-bracket-heading p {
  margin: 4px 0 0;
}

.battle-dialog-body {
  min-height: 240px;
}

.battle-scoreboard {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: 12px;
  margin-bottom: 18px;
}

.battle-robot,
.battle-rule {
  border: 1px solid #eadde3;
  border-radius: 14px;
  background: #fffafb;
  padding: 14px;
}

.battle-robot {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 10px;
  align-items: center;
}

.battle-robot > span {
  grid-column: 1 / -1;
  color: #9a8c93;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.battle-robot strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.battle-robot b {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #9f0f3b;
  color: #fff;
  font-size: 18px;
}

.battle-rule {
  display: flex;
  min-width: 150px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background: #f6f1f4;
}

.battle-rule span {
  color: #7d6f76;
  font-size: 11px;
}

.battle-rule strong {
  margin-top: 3px;
  color: #4b3540;
  font-size: 12px;
}

.battle-shortcuts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8f5f7;
}

.battle-shortcuts > span {
  margin-right: 3px;
  color: #8f1238;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.battle-rounds {
  display: grid;
  gap: 10px;
}

.battle-round-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  min-height: 58px;
  padding: 12px;
  border: 1px solid #eadfe4;
  border-radius: 12px;
  background: #fff;
}

.battle-round-row.disabled {
  opacity: .55;
}

.round-index {
  display: flex;
  flex-direction: column;
  padding-top: 3px;
}

.round-index span {
  font-size: 12px;
  font-weight: 800;
}

.round-index small {
  color: #9b8f95;
  font-size: 10px;
}

.round-existing {
  display: grid;
  gap: 5px;
}

.round-existing-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.round-existing strong {
  font-size: 12px;
}

.round-existing small {
  color: #85757d;
  font-size: 10px;
}

.round-entry {
  display: grid;
  gap: 10px;
}

.round-choice-group {
  display: flex;
  flex-wrap: wrap;
}

.round-operations {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px;
}

.round-penalties,
.round-wo-actions {
  display: flex;
  min-width: 0;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  padding: 9px 10px;
  border-radius: 10px;
  background: #faf7f8;
}

.round-penalties > span,
.round-wo-actions > span {
  width: 100%;
  color: #8f1238;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.round-penalties label {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: #65565e;
  font-size: 10px;
}

.round-penalties :deep(.el-input-number) {
  width: 84px;
}

.round-wo-actions .el-button + .el-button {
  margin-left: 0;
}

.battle-projection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid #cfe8d9;
  border-radius: 12px;
  background: #f0faf4;
  color: #276145;
}

.battle-projection span {
  font-size: 11px;
}

.battle-rule-note {
  margin: 12px 0 0;
  padding: 9px 11px;
  border-radius: 10px;
  background: #f8f5f7;
  color: #74656d;
  font-size: 10px;
  line-height: 1.45;
}

.battle-note {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  color: #675a61;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 700px) {
  .battle-scoreboard {
    grid-template-columns: 1fr 1fr;
  }

  .battle-rule {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .battle-round-row,
  .round-operations {
    grid-template-columns: 1fr;
  }
}
</style>