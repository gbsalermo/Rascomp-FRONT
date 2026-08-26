<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import type { ConfigSumo, Match, RoundSumo, RoundSumoOutcomeReason, RoundSumoStatus } from '../types'
import RobotPhoto from '../components/RobotPhoto.vue'
import StatusBadge from '../components/StatusBadge.vue'

type RoundChoice = 'A' | 'B' | 'EMPATADO' | 'ANULADO' | 'CANCELADO'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const match = ref<Match>()
const config = ref<ConfigSumo>()
const rounds = ref<RoundSumo[]>([])
const form = reactive({
  choice: undefined as RoundChoice | undefined,
  motivoResultado: 'DISPUTA' as RoundSumoOutcomeReason,
  penalidadesA: 0,
  penalidadesB: 0,
  observacao: ''
})

const matchId = computed(() => Number(route.params.matchId))
const readOnly = computed(() =>
  match.value?.bracketAtual === false ||
  match.value?.bracketAtivo === false ||
  match.value?.ativo === false ||
  match.value?.status === 'FINALIZADA' ||
  match.value?.status === 'CANCELADA'
)
const score = computed(() => {
  let A = 0
  let B = 0
  for (const round of rounds.value) {
    if (round.status !== 'FINALIZADO') continue
    if (round.winnerRegistrationId === match.value?.registrationAId) A++
    if (round.winnerRegistrationId === match.value?.registrationBId) B++
  }
  return { A, B }
})
const nextRoundNumber = computed(() => rounds.value.length + 1)
const nextRoundLabel = computed(() => {
  if (!config.value) return `Round ${nextRoundNumber.value}`
  return nextRoundNumber.value > config.value.numeroRounds ? 'Round extra' : `Round ${nextRoundNumber.value}`
})
const currentWinner = computed<'A' | 'B' | undefined>(() => {
  const target = config.value?.roundsParaVencer
  if (!target) return undefined
  if (score.value.A >= target) return 'A'
  if (score.value.B >= target) return 'B'
  return undefined
})
const penaltyLoser = computed<'A' | 'B' | undefined>(() => {
  if (form.penalidadesA === 2 && form.penalidadesB < 2) return 'A'
  if (form.penalidadesB === 2 && form.penalidadesA < 2) return 'B'
  return undefined
})
const bothAtPenaltyLimit = computed(() => form.penalidadesA === 2 && form.penalidadesB === 2)
const canSave = computed(() => Boolean(form.choice) && !readOnly.value && !currentWinner.value && !bothAtPenaltyLimit.value)

function phaseLabel(round: number) {
  return `Rodada ${round}`
}

function chooseWinner(side: 'A' | 'B') {
  if (penaltyLoser.value === side) {
    ElMessage.warning('Um robô com 2 penalidades perde o round automaticamente.')
    return
  }
  form.choice = side
  form.motivoResultado = 'DISPUTA'
}

function chooseWo(loser: 'A' | 'B') {
  if (penaltyLoser.value) {
    ElMessage.warning('O resultado já foi definido automaticamente pelas 2 penalidades.')
    return
  }
  form.choice = loser === 'A' ? 'B' : 'A'
  form.motivoResultado = 'SUICIDIO_WO'
}

function chooseNeutral(status: 'EMPATADO' | 'ANULADO' | 'CANCELADO') {
  form.choice = status
  form.motivoResultado = 'DISPUTA'
}

function roundWinner(round: RoundSumo) {
  if (round.status !== 'FINALIZADO') {
    if (round.status === 'EMPATADO') return 'Round empatado'
    if (round.status === 'ANULADO') return 'Round anulado'
    return 'Round cancelado'
  }
  const detail = round.motivoResultado === 'SUICIDIO_WO'
    ? ' · Suicídio/WO do adversário'
    : round.motivoResultado === 'PENALIDADES'
      ? ' · adversário atingiu 2 penalidades'
      : ''
  return `${round.winnerRobotNome || 'Vencedor'} venceu${detail}`
}

function formatDate(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
  }).format(new Date(value))
}

function resetForm() {
  form.choice = undefined
  form.motivoResultado = 'DISPUTA'
  form.penalidadesA = 0
  form.penalidadesB = 0
  form.observacao = ''
}

watch(
  [() => form.penalidadesA, () => form.penalidadesB],
  () => {
    if (bothAtPenaltyLimit.value) {
      form.choice = undefined
      form.motivoResultado = 'DISPUTA'
      return
    }
    if (penaltyLoser.value === 'A') {
      form.choice = 'B'
      form.motivoResultado = 'PENALIDADES'
      return
    }
    if (penaltyLoser.value === 'B') {
      form.choice = 'A'
      form.motivoResultado = 'PENALIDADES'
      return
    }
    if (form.motivoResultado === 'PENALIDADES') {
      form.choice = undefined
      form.motivoResultado = 'DISPUTA'
    }
  }
)

async function load() {
  if (!Number.isFinite(matchId.value) || matchId.value <= 0) {
    ElMessage.error('Partida inválida.')
    return
  }
  loading.value = true
  try {
    const detail = await adminApi.match(matchId.value)
    match.value = detail
    if (!detail.categoryId) throw new Error('A partida não possui categoria associada.')
    const [sumoConfig, sumoRounds] = await Promise.all([
      adminApi.sumoConfig(detail.categoryId),
      adminApi.rounds(detail.id)
    ])
    config.value = sumoConfig
    rounds.value = [...sumoRounds].sort((a, b) => a.numeroRound - b.numeroRound)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || error?.message || 'Não foi possível carregar a partida.')
  } finally {
    loading.value = false
  }
}

async function saveRound() {
  if (!match.value || !form.choice || !canSave.value) return
  let status: RoundSumoStatus
  let winnerRegistrationId: number | undefined
  if (form.choice === 'A') {
    status = 'FINALIZADO'
    winnerRegistrationId = match.value.registrationAId
  } else if (form.choice === 'B') {
    status = 'FINALIZADO'
    winnerRegistrationId = match.value.registrationBId
  } else {
    status = form.choice
  }
  saving.value = true
  try {
    await adminApi.registerSumoBattle({
      matchId: match.value.id,
      rounds: [{
        winnerRegistrationId,
        status,
        motivoResultado: form.motivoResultado,
        penalidadesA: form.penalidadesA,
        penalidadesB: form.penalidadesB,
        observacao: form.observacao || undefined
      }]
    })
    ElMessage.success(
      form.motivoResultado === 'PENALIDADES'
        ? 'Round registrado com derrota automática por 2 penalidades.'
        : 'Round registrado. Placar e progressão atualizados pelo backend.'
    )
    resetForm()
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar o round.')
  } finally {
    saving.value = false
  }
}

function goBack() {
  if (route.query.bracketId || route.query.categoryId || route.query.competitionId) {
    router.push({
      name: 'sumo',
      query: {
        competitionId: route.query.competitionId,
        categoryId: route.query.categoryId,
        bracketId: route.query.bracketId
      }
    })
    return
  }
  router.back()
}

onMounted(load)
</script>

<template>
  <div class="arena-page" v-loading="loading">
    <header class="arena-header">
      <button type="button" class="arena-back" @click="goBack" aria-label="Voltar para a chave">←</button>
      <div class="arena-title">
        <span class="eyebrow">Operação de arena</span>
        <h1>Partida #{{ match?.id || '—' }}</h1>
        <p>{{ match?.competitionNome || 'Competição' }} · {{ match?.categoryNome || 'Sumô' }} · {{ match ? phaseLabel(match.rodada) : '' }}</p>
      </div>
      <StatusBadge v-if="match?.status" :value="match.status" />
    </header>

    <template v-if="match && config">
      <section class="arena-scoreboard">
        <article class="arena-competitor">
          <div class="robot-photo-placeholder">
            <RobotPhoto :robot-id="match.robotAId" :robot-name="match.robotANome" />
          </div>
          <div class="robot-meta">
            <span>Robô A</span>
            <strong>{{ match.robotANome }}</strong>
            <small>{{ match.teamANome || 'Equipe' }}</small>
          </div>
          <b class="arena-score score-a">{{ score.A }}</b>
        </article>

        <div class="arena-versus">
          <span>VS</span>
          <small>{{ config.roundsParaVencer }} vitórias para vencer</small>
        </div>

        <article class="arena-competitor arena-competitor-b">
          <b class="arena-score score-b">{{ score.B }}</b>
          <div class="robot-meta robot-meta-b">
            <span>Robô B</span>
            <strong>{{ match.robotBNome }}</strong>
            <small>{{ match.teamBNome || 'Equipe' }}</small>
          </div>
          <div class="robot-photo-placeholder">
            <RobotPhoto :robot-id="match.robotBId" :robot-name="match.robotBNome" />
          </div>
        </article>
      </section>

      <div v-if="match.bracketAtual === false" class="arena-readonly-banner">
        Esta partida pertence a uma chave histórica. Consulta somente leitura.
      </div>

      <div class="arena-workspace">
        <section class="arena-round-history">
          <div class="arena-card-heading">
            <div><span class="eyebrow">Rounds</span><h2>Histórico da batalha</h2></div>
            <span class="arena-counter">{{ rounds.length }} registrados</span>
          </div>

          <div v-if="!rounds.length" class="arena-empty-rounds">Nenhum round registrado ainda.</div>

          <article v-for="round in rounds" :key="round.id" class="arena-round-item">
            <div class="round-number-badge">{{ round.numeroRound }}</div>
            <div class="round-summary">
              <div class="round-summary-top"><strong>Round {{ round.numeroRound }}</strong><StatusBadge :value="round.status" /></div>
              <span>{{ roundWinner(round) }}</span>
              <small>
                Penalidades: {{ match.robotANome }} {{ round.penalidadesA || 0 }} · {{ match.robotBNome }} {{ round.penalidadesB || 0 }}
                <template v-if="round.dataCadastro"> · {{ formatDate(round.dataCadastro) }}</template>
              </small>
              <em v-if="round.observacao">{{ round.observacao }}</em>
            </div>
          </article>
        </section>

        <aside class="arena-control-panel">
          <div class="arena-card-heading">
            <div><span class="eyebrow">Registro rápido</span><h2>{{ nextRoundLabel }}</h2></div>
            <span v-if="currentWinner" class="arena-finished">Batalha encerrada</span>
          </div>

          <template v-if="!currentWinner && !readOnly">
            <div class="control-section">
              <span class="control-label">Vitória no round</span>
              <div class="winner-actions">
                <button
                  type="button"
                  class="arena-action winner-a"
                  :class="{ selected: form.choice === 'A', 'penalty-winner': form.choice === 'A' && form.motivoResultado === 'PENALIDADES' }"
                  :disabled="penaltyLoser === 'A'"
                  @click="chooseWinner('A')"
                >
                  <small>{{ form.choice === 'A' && form.motivoResultado === 'PENALIDADES' ? 'Vitória automática' : 'Vitória' }}</small>
                  <strong>{{ match.robotANome }}</strong>
                </button>
                <button
                  type="button"
                  class="arena-action winner-b"
                  :class="{ selected: form.choice === 'B', 'penalty-winner': form.choice === 'B' && form.motivoResultado === 'PENALIDADES' }"
                  :disabled="penaltyLoser === 'B'"
                  @click="chooseWinner('B')"
                >
                  <small>{{ form.choice === 'B' && form.motivoResultado === 'PENALIDADES' ? 'Vitória automática' : 'Vitória' }}</small>
                  <strong>{{ match.robotBNome }}</strong>
                </button>
              </div>
            </div>

            <div class="control-section">
              <span class="control-label">Penalidades do round</span>
              <div class="penalty-grid">
                <div class="penalty-box" :class="{ 'penalty-limit-hit': form.penalidadesA === 2 }">
                  <strong>{{ match.robotANome }}</strong>
                  <div class="penalty-control">
                    <button type="button" @click="form.penalidadesA = Math.max(0, form.penalidadesA - 1)">−</button>
                    <b>{{ form.penalidadesA }}</b>
                    <button type="button" :disabled="form.penalidadesA >= 2 || form.penalidadesB >= 2" @click="form.penalidadesA = Math.min(2, form.penalidadesA + 1)">+</button>
                  </div>
                </div>
                <div class="penalty-box" :class="{ 'penalty-limit-hit': form.penalidadesB === 2 }">
                  <strong>{{ match.robotBNome }}</strong>
                  <div class="penalty-control">
                    <button type="button" @click="form.penalidadesB = Math.max(0, form.penalidadesB - 1)">−</button>
                    <b>{{ form.penalidadesB }}</b>
                    <button type="button" :disabled="form.penalidadesB >= 2 || form.penalidadesA >= 2" @click="form.penalidadesB = Math.min(2, form.penalidadesB + 1)">+</button>
                  </div>
                </div>
              </div>
              <small class="penalty-rule">
                <template v-if="penaltyLoser === 'A'">{{ match.robotANome }} atingiu 2 penalidades e perdeu o round. Vitória automática de {{ match.robotBNome }}.</template>
                <template v-else-if="penaltyLoser === 'B'">{{ match.robotBNome }} atingiu 2 penalidades e perdeu o round. Vitória automática de {{ match.robotANome }}.</template>
                <template v-else>Regra: ao atingir 2 penalidades, o robô perde o round automaticamente.</template>
              </small>
              <small v-if="bothAtPenaltyLimit" class="penalty-error">O round deve terminar na segunda penalidade de um dos robôs; não registre 2 penalidades para os dois lados.</small>
            </div>

            <div class="control-section">
              <span class="control-label">Perda por Suicídio / WO</span>
              <div class="wo-actions">
                <button type="button" class="wo-button" :class="{ selected: form.choice === 'B' && form.motivoResultado === 'SUICIDIO_WO' }" @click="chooseWo('A')">Suicídio/WO de {{ match.robotANome }}</button>
                <button type="button" class="wo-button" :class="{ selected: form.choice === 'A' && form.motivoResultado === 'SUICIDIO_WO' }" @click="chooseWo('B')">Suicídio/WO de {{ match.robotBNome }}</button>
              </div>
            </div>

            <div class="control-section">
              <span class="control-label">Outras ocorrências</span>
              <div class="neutral-actions">
                <button type="button" :class="{ selected: form.choice === 'EMPATADO' }" @click="chooseNeutral('EMPATADO')">Empate</button>
                <button type="button" :class="{ selected: form.choice === 'ANULADO' }" @click="chooseNeutral('ANULADO')">Anular</button>
                <button type="button" :class="{ selected: form.choice === 'CANCELADO' }" @click="chooseNeutral('CANCELADO')">Cancelar</button>
              </div>
            </div>

            <label class="arena-note">Observação<el-input v-model="form.observacao" type="textarea" :rows="3" placeholder="Opcional" /></label>
            <button type="button" class="arena-save" :disabled="!canSave || saving" @click="saveRound">{{ saving ? 'Registrando...' : `Registrar ${nextRoundLabel}` }}</button>
          </template>

          <div v-else class="arena-closed-state">
            <strong v-if="currentWinner">{{ currentWinner === 'A' ? match.robotANome : match.robotBNome }} venceu a batalha</strong>
            <strong v-else>Somente leitura</strong>
            <span>O histórico permanece disponível ao lado.</span>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.arena-page { display:grid; gap:18px; }
.arena-header { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:14px; }
.arena-back { display:grid; place-items:center; width:42px; height:42px; border:1px solid #e5d9df; border-radius:12px; background:#fff; color:#5a4650; font-size:22px; cursor:pointer; }
.arena-title h1 { margin:2px 0 3px; font-size:24px; }
.arena-title p { margin:0; color:#756870; font-size:12px; }
.arena-scoreboard { display:grid; grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr); align-items:center; gap:14px; padding:22px; border:1px solid #e8dde2; border-radius:20px; background:linear-gradient(180deg,#fff 0%,#fffafb 100%); box-shadow:0 12px 32px rgba(73,28,49,.07); }
.arena-competitor { display:grid; grid-template-columns:84px minmax(0,1fr) auto; align-items:center; gap:14px; }
.arena-competitor-b { grid-template-columns:auto minmax(0,1fr) 84px; }
.robot-photo-placeholder { width:84px; height:84px; border:2px solid #eadde3; border-radius:50%; overflow:hidden; background:#f3e7ec; color:#8f1238; font-size:22px; font-weight:900; }
.robot-meta { display:grid; gap:2px; }
.robot-meta-b { justify-items:end; text-align:right; }
.robot-meta span { color:#9b8d94; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; }
.robot-meta strong { color:#31242b; font-size:22px; }
.robot-meta small { color:#7e7077; }
.arena-score { display:grid; place-items:center; width:52px; height:52px; border-radius:14px; color:#fff; font-size:26px; }
.score-a { background:#25975e; } .score-b { background:#c31549; }
.arena-versus { display:grid; justify-items:center; gap:5px; color:#685860; }
.arena-versus span { font-size:18px; font-weight:900; }
.arena-versus small { max-width:110px; text-align:center; font-size:10px; }
.arena-readonly-banner { padding:10px 14px; border:1px solid #edd7df; border-radius:12px; background:#fff5f8; color:#8f1238; font-size:12px; font-weight:700; }
.arena-workspace { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(360px,.85fr); gap:18px; align-items:start; }
.arena-round-history,.arena-control-panel { border:1px solid #e8dde2; border-radius:18px; background:#fff; box-shadow:0 10px 28px rgba(73,28,49,.05); }
.arena-round-history { padding:18px; } .arena-control-panel { padding:18px; position:sticky; top:18px; }
.arena-card-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
.arena-card-heading h2 { margin:2px 0 0; font-size:17px; }
.arena-counter,.arena-finished { padding:5px 8px; border-radius:999px; background:#f3edf0; color:#7f6570; font-size:10px; font-weight:800; }
.arena-finished { background:#e9f7ef; color:#25704b; }
.arena-empty-rounds { padding:28px 10px; text-align:center; color:#8c8086; }
.arena-round-item { display:grid; grid-template-columns:38px minmax(0,1fr); gap:12px; padding:13px 0; border-top:1px solid #f1e9ed; }
.round-number-badge { display:grid; place-items:center; width:34px; height:34px; border-radius:10px; background:#f4ebef; color:#9f0f3b; font-weight:900; }
.round-summary { display:grid; gap:3px; }
.round-summary-top { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.round-summary > span { color:#4f4148; font-size:12px; } .round-summary > small { color:#8a7b82; font-size:10px; } .round-summary > em { color:#675a61; font-size:10px; font-style:normal; }
.control-section { display:grid; gap:8px; padding:13px 0; border-top:1px solid #f0e8ec; }
.control-label { color:#6f6067; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
.winner-actions,.wo-actions,.neutral-actions,.penalty-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.arena-action,.wo-button,.neutral-actions button { border:1px solid #e2d3da; border-radius:12px; background:#fff; cursor:pointer; transition:.15s ease; }
.arena-action { min-height:72px; display:grid; align-content:center; justify-items:center; gap:3px; padding:10px; }
.arena-action small { color:#8a7b82; } .arena-action strong { font-size:14px; }
.arena-action:hover,.wo-button:hover,.neutral-actions button:hover { border-color:#c31549; }
.arena-action:disabled { opacity:.45; cursor:not-allowed; }
.winner-a.selected { border-color:#25975e; background:#eefaf3; box-shadow:inset 0 0 0 1px #25975e; }
.winner-b.selected { border-color:#c31549; background:#fff1f5; box-shadow:inset 0 0 0 1px #c31549; }
.arena-action.penalty-winner { border-color:#b56a00; background:#fff8e8; box-shadow:inset 0 0 0 1px #b56a00; }
.penalty-box { display:grid; gap:8px; padding:10px; border:1px solid #eadfe4; border-radius:12px; background:#fbf9fa; }
.penalty-box.penalty-limit-hit { border-color:#c31549; background:#fff0f4; box-shadow:inset 0 0 0 1px rgba(195,21,73,.25); }
.penalty-box > strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px; }
.penalty-control { display:grid; grid-template-columns:38px 1fr 38px; align-items:center; gap:6px; }
.penalty-control button { height:36px; border:1px solid #dfd2d8; border-radius:9px; background:#fff; color:#8f1238; font-size:20px; cursor:pointer; }
.penalty-control button:disabled { opacity:.35; cursor:not-allowed; }
.penalty-control b { text-align:center; font-size:20px; }
.penalty-rule { color:#7f273f; font-size:10px; font-weight:700; line-height:1.4; }
.penalty-error { color:#b42318; font-size:10px; font-weight:800; }
.wo-button { min-height:46px; padding:8px 10px; color:#7f273f; font-size:11px; font-weight:800; }
.wo-button.selected { border-color:#9f0f3b; background:#fff0f4; box-shadow:inset 0 0 0 1px #9f0f3b; }
.neutral-actions { grid-template-columns:repeat(3,1fr); }
.neutral-actions button { min-height:38px; color:#6e5f66; font-size:11px; font-weight:800; }
.neutral-actions button.selected { border-color:#6c5177; background:#f5f0f7; color:#4f1967; }
.arena-note { display:grid; gap:6px; margin-top:12px; color:#6d5d65; font-size:11px; font-weight:700; }
.arena-save { width:100%; min-height:48px; margin-top:14px; border:0; border-radius:12px; background:linear-gradient(90deg,#6f1b7d 0%,#9f0f3b 100%); color:#fff; font-weight:900; cursor:pointer; box-shadow:0 8px 18px rgba(111,27,125,.18); }
.arena-save:disabled { opacity:.45; cursor:not-allowed; }
.arena-closed-state { display:grid; gap:5px; padding:28px 10px; text-align:center; }
.arena-closed-state strong { color:#8f1238; font-size:16px; } .arena-closed-state span { color:#84767d; font-size:11px; }
@media (max-width:980px) { .arena-workspace { grid-template-columns:1fr; } .arena-control-panel { position:static; } }
@media (max-width:760px) { .arena-scoreboard { grid-template-columns:1fr; } .arena-versus { order:2; } .arena-competitor { order:1; } .arena-competitor-b { order:3; } .arena-competitor,.arena-competitor-b { grid-template-columns:72px minmax(0,1fr) auto; } .arena-competitor-b .arena-score { order:3; } .arena-competitor-b .robot-meta { order:2; justify-items:start; text-align:left; } .arena-competitor-b .robot-photo-placeholder { order:1; } .robot-photo-placeholder { width:72px; height:72px; } .winner-actions,.wo-actions,.penalty-grid { grid-template-columns:1fr; } }
</style>
