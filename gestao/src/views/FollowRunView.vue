<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import type { ConfigFollow, FollowAttempt, RankingItem, Registration } from '../types'
import RobotPhoto from '../components/RobotPhoto.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const config = ref<ConfigFollow>()
const registration = ref<Registration>()
const attempts = ref<FollowAttempt[]>([])
const ranking = ref<RankingItem[]>([])
const selectedTake = ref(1)

const registrationId = computed(() => Number(route.params.registrationId))
const competitionId = computed(() => Number(route.query.competitionId))
const categoryId = computed(() => Number(route.query.categoryId))

const attempt = reactive({
  tempoSegundos: 0,
  checkpointsAlcancados: 0,
  penalidadeSegundos: 0,
  concluida: true,
  valida: true,
  observacao: ''
})

const robotAttempts = computed(() =>
  attempts.value
    .filter((item) => item.registrationId === registrationId.value)
    .sort((a, b) => a.tomada - b.tomada || a.numeroTentativa - b.numeroTentativa)
)

const takeAttempts = computed(() =>
  robotAttempts.value.filter((item) => item.tomada === selectedTake.value)
)

const currentRanking = computed(() =>
  ranking.value.find((item) => item.registrationId === registrationId.value)
)

const completedTakes = computed(() => {
  if (!config.value) return 0
  let total = 0
  for (let tomada = 1; tomada <= config.value.numeroTomadas; tomada++) {
    const count = robotAttempts.value.filter((item) => item.tomada === tomada).length
    if (count >= config.value.tentativasPorTomada) total++
  }
  return total
})

const remainingTakes = computed(() =>
  config.value ? Math.max(0, config.value.numeroTomadas - completedTakes.value) : 0
)

const nextAttemptNumber = computed(() => {
  if (!config.value) return undefined
  for (let number = 1; number <= config.value.tentativasPorTomada; number++) {
    const occupied = takeAttempts.value.some((item) => item.numeroTentativa === number)
    if (!occupied) return number
  }
  return undefined
})

const remainingAttempts = computed(() =>
  config.value ? Math.max(0, config.value.tentativasPorTomada - takeAttempts.value.length) : 0
)

const allCompleted = computed(() =>
  Boolean(config.value && completedTakes.value >= config.value.numeroTomadas)
)

function firstIncompleteTake() {
  if (!config.value) return 1
  for (let tomada = 1; tomada <= config.value.numeroTomadas; tomada++) {
    const count = robotAttempts.value.filter((item) => item.tomada === tomada).length
    if (count < config.value.tentativasPorTomada) return tomada
  }
  return config.value.numeroTomadas
}

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(3)} s`
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function resetAttemptForm() {
  attempt.tempoSegundos = 0
  attempt.checkpointsAlcancados = 0
  attempt.penalidadeSegundos = 0
  attempt.concluida = true
  attempt.valida = true
  attempt.observacao = ''
}

async function load() {
  if (!Number.isFinite(registrationId.value) || registrationId.value <= 0) {
    ElMessage.error('Inscrição inválida.')
    return router.replace({ name: 'follow' })
  }
  if (!Number.isFinite(competitionId.value) || competitionId.value <= 0 || !Number.isFinite(categoryId.value) || categoryId.value <= 0) {
    ElMessage.error('Contexto da competição ou categoria não informado.')
    return router.replace({ name: 'follow' })
  }

  loading.value = true
  try {
    const [registrations, followConfig, contextAttempts, rank] = await Promise.all([
      adminApi.registrations({ competitionId: competitionId.value }),
      adminApi.followConfig(categoryId.value),
      adminApi.followAttempts(competitionId.value, categoryId.value),
      adminApi.rankingFollow(competitionId.value, categoryId.value)
    ])

    const found = registrations.find(
      (item) => item.id === registrationId.value && item.categoryId === categoryId.value
    )

    if (!found) {
      ElMessage.error('A inscrição selecionada não pertence a esta categoria.')
      return router.replace({ name: 'follow' })
    }

    registration.value = found
    config.value = followConfig
    attempts.value = contextAttempts
    ranking.value = rank
    selectedTake.value = firstIncompleteTake()
    resetAttemptForm()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível abrir a operação da tomada.')
  } finally {
    loading.value = false
  }
}

async function refreshAfterSave() {
  if (!config.value) return
  const [contextAttempts, rank] = await Promise.all([
    adminApi.followAttempts(competitionId.value, categoryId.value),
    adminApi.rankingFollow(competitionId.value, categoryId.value)
  ])
  attempts.value = contextAttempts
  ranking.value = rank

  const currentFull = robotAttempts.value.filter((item) => item.tomada === selectedTake.value).length >= config.value.tentativasPorTomada
  if (currentFull && selectedTake.value < config.value.numeroTomadas) {
    selectedTake.value = firstIncompleteTake()
  }
  resetAttemptForm()
}

async function saveAttempt() {
  if (!registration.value || !config.value) return
  if (!nextAttemptNumber.value) {
    return ElMessage.warning('Todas as tentativas desta tomada já foram registradas.')
  }

  saving.value = true
  try {
    await adminApi.createFollowAttempt({
      registrationId: registration.value.id,
      tomada: selectedTake.value,
      numeroTentativa: nextAttemptNumber.value,
      tempoSegundos: attempt.tempoSegundos,
      checkpointsAlcancados: attempt.checkpointsAlcancados,
      penalidadeSegundos: attempt.penalidadeSegundos,
      concluida: attempt.concluida,
      valida: attempt.valida,
      observacao: attempt.observacao || undefined
    })
    ElMessage.success(`Tentativa ${nextAttemptNumber.value} registrada na tomada ${selectedTake.value}.`)
    await refreshAfterSave()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a tentativa.')
  } finally {
    saving.value = false
  }
}

function backToFollow() {
  router.push({
    name: 'follow',
    query: {
      competitionId: competitionId.value,
      categoryId: categoryId.value
    }
  })
}

onMounted(load)
</script>

<template>
  <div class="page-stack follow-run-page" v-loading="loading">
    <div class="follow-run-header">
      <el-button @click="backToFollow">← Voltar ao Follow Line</el-button>
      <div v-if="registration">
        <span class="eyebrow">Operação de pista · Follow Line</span>
        <h1>{{ registration.robotNome }}</h1>
        <p class="muted">{{ registration.competitionNome }} · {{ registration.categoryNome }}</p>
      </div>
      <el-tag v-if="allCompleted" type="success" effect="light">Programa concluído</el-tag>
      <el-tag v-else type="warning" effect="light">Em operação</el-tag>
    </div>

    <section v-if="registration && config" class="follow-run-hero">
      <div class="follow-run-identity">
        <div class="follow-run-avatar">
          <RobotPhoto :robot-id="registration.robotId" :robot-name="registration.robotNome" />
        </div>
        <div>
          <span>Robô</span>
          <strong>{{ registration.robotNome }}</strong>
          <small>{{ registration.teamNome }}</small>
          <small>Inscrição #{{ registration.id }}</small>
        </div>
      </div>

      <div class="follow-run-score">
        <div><span>Tomada atual</span><strong>{{ selectedTake }} / {{ config.numeroTomadas }}</strong></div>
        <div><span>Tentativas restantes</span><strong>{{ remainingAttempts }}</strong></div>
        <div><span>Tomadas ainda abertas</span><strong>{{ remainingTakes }}</strong></div>
        <div class="highlight"><span>Melhor tempo</span><strong>{{ formatSeconds(currentRanking?.tempoFinalSegundos) }}</strong></div>
      </div>
    </section>

    <nav v-if="config" class="follow-take-tabs" aria-label="Tomadas do robô">
      <button v-for="tomada in config.numeroTomadas" :key="tomada" type="button" :class="{ active: selectedTake === tomada }" @click="selectedTake = tomada">
        <span>Tomada {{ tomada }}</span>
        <small>{{ robotAttempts.filter((item) => item.tomada === tomada).length }} / {{ config.tentativasPorTomada }} tentativas</small>
      </button>
    </nav>

    <section v-if="registration && config" class="follow-run-grid">
      <article class="follow-take-history">
        <div class="follow-run-card-heading">
          <div><span class="eyebrow">Tomada {{ selectedTake }}</span><h2>Tentativas registradas</h2><p class="muted">Cada registro ocupa uma tentativa desta tomada.</p></div>
          <span class="follow-remaining-chip">{{ remainingAttempts }} restantes</span>
        </div>

        <div v-if="takeAttempts.length" class="follow-attempt-list">
          <div v-for="item in takeAttempts" :key="item.id" class="follow-attempt-item">
            <div class="follow-attempt-index"><strong>#{{ item.numeroTentativa }}</strong><small>{{ formatDate(item.dataCadastro) }}</small></div>
            <div class="follow-attempt-result"><strong>{{ formatSeconds(item.tempoFinalSegundos) }}</strong><span>{{ formatSeconds(item.tempoSegundos) }} + {{ item.penalidadeSegundos || 0 }} s</span></div>
            <div class="follow-attempt-meta"><span>{{ item.checkpointsAlcancados }} / {{ config.numeroCheckpoints }} checkpoints</span><span v-if="item.observacao">{{ item.observacao }}</span></div>
            <div class="follow-attempt-statuses">
              <el-tag :type="item.concluida ? 'success' : 'warning'" size="small" effect="light">{{ item.concluida ? 'Concluída' : 'Não concluída' }}</el-tag>
              <el-tag :type="item.valida ? 'success' : 'danger'" size="small" effect="light">{{ item.valida ? 'Válida' : 'Inválida' }}</el-tag>
            </div>
          </div>
        </div>
        <div v-else class="follow-empty-take"><strong>Nenhuma tentativa nesta tomada.</strong><span>O próximo registro será a tentativa #1.</span></div>
      </article>

      <aside class="follow-attempt-console">
        <div class="follow-run-card-heading"><div><span class="eyebrow">Próxima passagem</span><h2 v-if="nextAttemptNumber">Tentativa #{{ nextAttemptNumber }}</h2><h2 v-else>Tomada completa</h2><p class="muted">{{ nextAttemptNumber ? `Tomada ${selectedTake} de ${config.numeroTomadas}` : 'Selecione outra tomada disponível.' }}</p></div></div>

        <template v-if="nextAttemptNumber">
          <label class="follow-console-field"><span>Tempo (s)</span><el-input-number v-model="attempt.tempoSegundos" :min="0" :precision="3" :step="10" :step-strictly="false" controls-position="right" /><small>±10 s pelos controles; digitação livre para ajuste fino.</small></label>
          <div class="follow-console-two">
            <label class="follow-console-field"><span>Penalidade (s)</span><el-input-number v-model="attempt.penalidadeSegundos" :min="0" controls-position="right" /></label>
            <label class="follow-console-field"><span>Checkpoints</span><el-input-number v-model="attempt.checkpointsAlcancados" :min="0" :max="config.numeroCheckpoints" controls-position="right" /></label>
          </div>
          <div class="follow-console-flags"><el-checkbox v-model="attempt.concluida">Tentativa concluída</el-checkbox><el-checkbox v-model="attempt.valida">Tentativa válida</el-checkbox></div>
          <label class="follow-console-field"><span>Observação</span><el-input v-model="attempt.observacao" type="textarea" :rows="3" placeholder="Opcional" /></label>
          <div class="follow-console-note">Tempo máximo configurado: <strong>{{ config.maxTempoSegundos }} s</strong>. Se ultrapassar esse limite, o backend registra a tentativa como inválida.</div>
          <el-button class="brand-button follow-register-attempt" :loading="saving" @click="saveAttempt">Registrar tentativa #{{ nextAttemptNumber }}</el-button>
        </template>
        <div v-else class="follow-console-complete"><strong>Tomada {{ selectedTake }} concluída</strong><span>Todas as {{ config.tentativasPorTomada }} tentativas previstas já foram registradas.</span></div>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.follow-run-page { gap: 18px; }
.follow-run-header { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:18px; }
.follow-run-header h1 { margin:2px 0 0; } .follow-run-header p { margin:2px 0 0; }
.follow-run-hero { display:grid; grid-template-columns:minmax(260px,.8fr) minmax(520px,1.6fr); gap:18px; padding:20px; border:1px solid #e7dce2; border-radius:18px; background:linear-gradient(135deg,#fff 0%,#fff7f9 100%); box-shadow:0 10px 30px rgba(65,18,42,.05); }
.follow-run-identity { display:flex; align-items:center; gap:16px; }
.follow-run-avatar { width:96px; height:96px; flex:0 0 96px; border:3px solid #fff; border-radius:24px; overflow:hidden; box-shadow:0 10px 24px rgba(79,25,103,.18); font-size:28px; }
.follow-run-identity > div:last-child { display:grid; gap:3px; }
.follow-run-identity span,.follow-run-identity small { color:#83737b; font-size:11px; }
.follow-run-identity strong { color:#2e2127; font-size:24px; }
.follow-run-score { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; }
.follow-run-score > div { display:grid; align-content:center; gap:4px; min-height:86px; padding:13px 14px; border:1px solid #eadfe4; border-radius:14px; background:rgba(255,255,255,.86); }
.follow-run-score span { color:#877780; font-size:10px; } .follow-run-score strong { color:#34262d; font-size:21px; } .follow-run-score .highlight { border-color:#e3b7c6; background:#fff3f7; } .follow-run-score .highlight strong { color:#9f0f3b; }
.follow-take-tabs { display:flex; gap:10px; overflow-x:auto; }
.follow-take-tabs button { display:grid; min-width:150px; gap:3px; padding:11px 14px; border:1px solid #dfd2d8; border-radius:12px; background:#fff; color:#5f4f57; text-align:left; cursor:pointer; }
.follow-take-tabs button.active { border-color:#9f0f3b; background:#fff3f7; color:#9f0f3b; box-shadow:inset 0 0 0 1px #9f0f3b; }
.follow-take-tabs span { font-size:12px; font-weight:850; } .follow-take-tabs small { color:#8b7d84; font-size:10px; }
.follow-run-grid { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(340px,.75fr); gap:18px; align-items:start; }
.follow-take-history,.follow-attempt-console { border:1px solid #e8dde3; border-radius:18px; background:#fff; box-shadow:0 8px 26px rgba(58,18,39,.04); }
.follow-take-history { padding:18px; } .follow-attempt-console { position:sticky; top:18px; padding:18px; }
.follow-run-card-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:16px; }
.follow-run-card-heading h2 { margin:2px 0 0; } .follow-run-card-heading p { margin:3px 0 0; }
.follow-remaining-chip { padding:7px 10px; border-radius:999px; background:#f5edf1; color:#8f1238; font-size:10px; font-weight:850; }
.follow-attempt-list { display:grid; gap:10px; }
.follow-attempt-item { display:grid; grid-template-columns:72px 120px minmax(0,1fr) auto; align-items:center; gap:14px; padding:13px 14px; border:1px solid #eee5e9; border-radius:13px; background:#fcfafb; }
.follow-attempt-index,.follow-attempt-result,.follow-attempt-meta { display:grid; gap:3px; }
.follow-attempt-index strong { color:#9f0f3b; font-size:18px; } .follow-attempt-index small,.follow-attempt-result span,.follow-attempt-meta span { color:#887a81; font-size:10px; }
.follow-attempt-result strong { color:#33262c; font-size:16px; } .follow-attempt-statuses { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:6px; }
.follow-empty-take,.follow-console-complete { display:grid; place-items:center; gap:5px; min-height:150px; padding:24px; border:1px dashed #dacbd2; border-radius:14px; background:#fcfafb; color:#776a71; text-align:center; }
.follow-console-field { display:grid; gap:7px; margin-bottom:14px; color:#382b31; font-size:11px; font-weight:800; }
.follow-console-field small { color:#8d7f86; font-size:10px; font-weight:500; } .follow-console-field .el-input-number { width:100%; }
.follow-console-two { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.follow-console-flags { display:flex; flex-wrap:wrap; gap:12px; margin:2px 0 14px; padding:10px 12px; border-radius:11px; background:#f8f4f6; }
.follow-console-note { margin:4px 0 14px; padding:10px 12px; border-radius:11px; background:#f7f3f5; color:#776970; font-size:10px; line-height:1.45; }
.follow-register-attempt { width:100%; min-height:44px; font-weight:850; }
@media (max-width:1100px) { .follow-run-hero { grid-template-columns:1fr; } .follow-run-grid { grid-template-columns:1fr; } .follow-attempt-console { position:static; } }
@media (max-width:760px) { .follow-run-header { grid-template-columns:1fr; } .follow-run-score { grid-template-columns:repeat(2,minmax(0,1fr)); } .follow-attempt-item { grid-template-columns:58px 1fr; } .follow-attempt-meta,.follow-attempt-statuses { grid-column:1 / -1; } .follow-attempt-statuses { justify-content:flex-start; } .follow-console-two { grid-template-columns:1fr; } }
</style>
