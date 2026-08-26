<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Category, ConfigFollow, FollowAttempt, RankingItem, Registration } from '../types'

const competition = useCompetitionStore()
const loading = ref(false)
const ready = ref(false)
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])
const ranking = ref<RankingItem[]>([])
const history = ref<FollowAttempt[]>([])
const config = ref<ConfigFollow>()
const competitionId = ref<number>()
const categoryId = ref<number>()
const dialog = ref(false)
const historySearch = ref('')
const historyStatus = ref<'TODOS' | 'VALIDA' | 'INVALIDA' | 'INCOMPLETA'>('TODOS')

const attempt = reactive({
  registrationId: undefined as number | undefined,
  tomada: 1,
  numeroTentativa: 1,
  tempoSegundos: 0,
  checkpointsAlcancados: 0,
  penalidadeSegundos: 0,
  concluida: true,
  valida: true,
  observacao: ''
})

const approved = computed(() =>
  registrations.value.filter(
    (item) => item.status === 'APROVADA' && item.ativo !== false && item.categoryId === categoryId.value
  )
)

const validCompletedCount = computed(() =>
  history.value.filter((item) => item.valida && item.concluida).length
)

const bestTime = computed(() => ranking.value[0]?.tempoFinalSegundos)

const filteredHistory = computed(() => {
  const term = historySearch.value.trim().toLocaleLowerCase('pt-BR')

  return history.value.filter((item) => {
    const matchesTerm = !term
      || item.robotNome?.toLocaleLowerCase('pt-BR').includes(term)
      || item.teamNome?.toLocaleLowerCase('pt-BR').includes(term)

    const matchesStatus = historyStatus.value === 'TODOS'
      || (historyStatus.value === 'VALIDA' && item.valida && item.concluida)
      || (historyStatus.value === 'INVALIDA' && !item.valida)
      || (historyStatus.value === 'INCOMPLETA' && !item.concluida)

    return matchesTerm && matchesStatus
  })
})

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(3)} s`
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

async function initialize() {
  loading.value = true
  try {
    const [, cats] = await Promise.all([
      competition.load(),
      adminApi.categories('FOLLOW_LINE')
    ])

    categories.value = cats.filter((item) => item.ativo !== false)
    competitionId.value = competition.selectedId || competition.competitions[0]?.id
    categoryId.value = categories.value[0]?.id

    await loadContext()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar a operação do Follow Line.')
  } finally {
    loading.value = false
    ready.value = true
  }
}

async function loadContext() {
  if (!competitionId.value || !categoryId.value) {
    registrations.value = []
    ranking.value = []
    history.value = []
    config.value = undefined
    return
  }

  loading.value = true
  try {
    const [regs, rank, attempts, followConfig] = await Promise.all([
      adminApi.registrations({ competitionId: competitionId.value }),
      adminApi.rankingFollow(competitionId.value, categoryId.value),
      adminApi.followAttempts(competitionId.value, categoryId.value),
      adminApi.followConfig(categoryId.value)
    ])

    registrations.value = regs
    ranking.value = rank
    history.value = attempts
    config.value = followConfig
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar os dados do Follow Line.')
  } finally {
    loading.value = false
  }
}

function findNextSlot(registrationId: number) {
  if (!config.value) return undefined

  for (let tomada = 1; tomada <= config.value.numeroTomadas; tomada++) {
    for (let numeroTentativa = 1; numeroTentativa <= config.value.tentativasPorTomada; numeroTentativa++) {
      const occupied = history.value.some(
        (item) => item.registrationId === registrationId
          && item.tomada === tomada
          && item.numeroTentativa === numeroTentativa
      )
      if (!occupied) return { tomada, numeroTentativa }
    }
  }

  return undefined
}

function applyNextSlot(registrationId?: number) {
  if (!registrationId) return
  const slot = findNextSlot(registrationId)
  if (!slot) return
  attempt.tomada = slot.tomada
  attempt.numeroTentativa = slot.numeroTentativa
}

function resetAttempt() {
  attempt.registrationId = approved.value[0]?.id
  attempt.tomada = 1
  attempt.numeroTentativa = 1
  attempt.tempoSegundos = 0
  attempt.checkpointsAlcancados = 0
  attempt.penalidadeSegundos = 0
  attempt.concluida = true
  attempt.valida = true
  attempt.observacao = ''
  applyNextSlot(attempt.registrationId)
}

function openAttemptDialog() {
  if (!config.value) {
    return ElMessage.warning('Esta categoria ainda não possui configuração de Follow Line.')
  }
  if (!approved.value.length) {
    return ElMessage.warning('Não há inscrições aprovadas nesta categoria.')
  }

  resetAttempt()
  if (attempt.registrationId && !findNextSlot(attempt.registrationId)) {
    return ElMessage.warning('Todas as tentativas configuradas para esta inscrição já foram registradas.')
  }
  dialog.value = true
}

async function saveAttempt() {
  if (!attempt.registrationId) return ElMessage.warning('Selecione a inscrição.')

  try {
    await adminApi.createFollowAttempt({
      registrationId: attempt.registrationId,
      tomada: attempt.tomada,
      numeroTentativa: attempt.numeroTentativa,
      tempoSegundos: attempt.tempoSegundos,
      checkpointsAlcancados: attempt.checkpointsAlcancados,
      penalidadeSegundos: attempt.penalidadeSegundos,
      concluida: attempt.concluida,
      valida: attempt.valida,
      observacao: attempt.observacao || undefined
    })
    ElMessage.success('Tentativa registrada. Ranking e histórico atualizados pelo backend.')
    dialog.value = false
    await loadContext()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a tentativa.')
  }
}

watch(competitionId, async (value) => {
  if (!ready.value) return
  if (value && competition.selectedId !== value) competition.select(value)
  await loadContext()
})

watch(categoryId, async () => {
  if (!ready.value) return
  await loadContext()
})

watch(() => attempt.registrationId, (value) => {
  if (dialog.value) applyNextSlot(value)
})

onMounted(initialize)
</script>

<template>
  <div class="page-stack follow-workspace" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Operação · Follow Line</span>
        <h1>Seguidor de Linha</h1>
        <p class="muted">Registre as passagens e acompanhe a classificação oficial calculada pelo backend.</p>
      </div>
      <el-button class="brand-button" @click="openAttemptDialog">Registrar tentativa</el-button>
    </div>

    <article class="filter-bar">
      <el-select v-model="competitionId" placeholder="Competição" style="width:280px">
        <el-option
          v-for="item in competition.competitions"
          :key="item.id"
          :label="item.nome"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="categoryId" placeholder="Categoria" style="width:260px">
        <el-option v-for="item in categories" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-button @click="loadContext">Atualizar</el-button>
    </article>

    <section class="follow-metrics">
      <article class="follow-metric-card">
        <span>Inscrições aptas</span>
        <strong>{{ approved.length }}</strong>
        <small>aprovadas nesta categoria</small>
      </article>
      <article class="follow-metric-card">
        <span>Tentativas registradas</span>
        <strong>{{ history.length }}</strong>
        <small>{{ validCompletedCount }} válidas e concluídas</small>
      </article>
      <article class="follow-metric-card">
        <span>Formato da prova</span>
        <strong>{{ config ? `${config.numeroTomadas} × ${config.tentativasPorTomada}` : '—' }}</strong>
        <small>tomadas × tentativas</small>
      </article>
      <article class="follow-metric-card highlight">
        <span>Melhor tempo</span>
        <strong>{{ formatSeconds(bestTime) }}</strong>
        <small>{{ ranking[0]?.robotNome || 'ranking ainda vazio' }}</small>
      </article>
    </section>

    <article v-if="config" class="follow-config-strip">
      <div>
        <span class="eyebrow">Configuração da categoria</span>
        <strong>{{ config.maxTempoSegundos }} s de tempo máximo</strong>
      </div>
      <div class="follow-config-values">
        <span><b>{{ config.numeroTomadas }}</b> tomadas</span>
        <span><b>{{ config.tentativasPorTomada }}</b> tentativas por tomada</span>
        <span><b>{{ config.numeroCheckpoints }}</b> checkpoints</span>
      </div>
      <small>Checkpoints são registrados operacionalmente; o ranking atual usa tentativas válidas e concluídas, tempo e penalidade.</small>
    </article>

    <article class="table-card follow-ranking-card">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Classificação</span>
          <h2>Ranking oficial</h2>
          <p class="muted">Melhor tentativa válida e concluída de cada robô.</p>
        </div>
      </div>

      <el-table :data="ranking" empty-text="Ranking ainda não disponível">
        <el-table-column label="#" width="66">
          <template #default="{ row }"><strong class="ranking-position">{{ row.posicao }}</strong></template>
        </el-table-column>
        <el-table-column prop="robotNome" label="Robô" min-width="150" />
        <el-table-column prop="teamNome" label="Equipe" min-width="150" />
        <el-table-column label="Melhor passagem" width="135">
          <template #default="{ row }">T{{ row.tomada }} · #{{ row.numeroTentativa }}</template>
        </el-table-column>
        <el-table-column label="Tempo bruto" width="125">
          <template #default="{ row }">{{ formatSeconds(row.tempoBrutoSegundos) }}</template>
        </el-table-column>
        <el-table-column label="Penalidade" width="110">
          <template #default="{ row }">+{{ row.penalidadeSegundos || 0 }} s</template>
        </el-table-column>
        <el-table-column label="Tempo final" width="135">
          <template #default="{ row }"><strong class="ranking-final-time">{{ formatSeconds(row.tempoFinalSegundos) }}</strong></template>
        </el-table-column>
      </el-table>
    </article>

    <article class="table-card follow-history-card">
      <div class="card-heading follow-history-heading">
        <div>
          <span class="eyebrow">Operação</span>
          <h2>Histórico de tentativas</h2>
          <p class="muted">Registro completo das passagens desta competição e categoria.</p>
        </div>
        <div class="follow-history-filters">
          <el-input v-model="historySearch" clearable placeholder="Buscar robô ou equipe" />
          <el-select v-model="historyStatus" style="width:170px">
            <el-option label="Todos os status" value="TODOS" />
            <el-option label="Válidas" value="VALIDA" />
            <el-option label="Inválidas" value="INVALIDA" />
            <el-option label="Não concluídas" value="INCOMPLETA" />
          </el-select>
        </div>
      </div>

      <el-table :data="filteredHistory" empty-text="Nenhuma tentativa registrada">
        <el-table-column label="Robô" min-width="165">
          <template #default="{ row }">
            <div class="follow-robot-cell">
              <strong>{{ row.robotNome || `Inscrição #${row.registrationId}` }}</strong>
              <small>{{ row.teamNome || '—' }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tomada" label="Tomada" width="82" />
        <el-table-column prop="numeroTentativa" label="Tentativa" width="92" />
        <el-table-column label="Tempo" width="112">
          <template #default="{ row }">{{ formatSeconds(row.tempoSegundos) }}</template>
        </el-table-column>
        <el-table-column label="Penalidade" width="105">
          <template #default="{ row }">+{{ row.penalidadeSegundos || 0 }} s</template>
        </el-table-column>
        <el-table-column label="Tempo final" width="125">
          <template #default="{ row }"><strong>{{ formatSeconds(row.tempoFinalSegundos) }}</strong></template>
        </el-table-column>
        <el-table-column label="Checkpoints" width="105">
          <template #default="{ row }">{{ row.checkpointsAlcancados }} / {{ config?.numeroCheckpoints ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="Concluída" width="105">
          <template #default="{ row }">
            <el-tag :type="row.concluida ? 'success' : 'warning'" effect="light" size="small">
              {{ row.concluida ? 'Sim' : 'Não' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Válida" width="95">
          <template #default="{ row }">
            <el-tag :type="row.valida ? 'success' : 'danger'" effect="light" size="small">
              {{ row.valida ? 'Sim' : 'Não' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Registrada em" width="145">
          <template #default="{ row }">{{ formatDate(row.dataCadastro) }}</template>
        </el-table-column>
      </el-table>
    </article>

    <el-dialog v-model="dialog" title="Registrar tentativa" width="min(640px, 94vw)">
      <div class="follow-attempt-dialog">
        <label class="span-2">Inscrição
          <el-select v-model="attempt.registrationId" style="width:100%" filterable>
            <el-option
              v-for="item in approved"
              :key="item.id"
              :label="`${item.robotNome} · ${item.teamNome}`"
              :value="item.id"
            />
          </el-select>
        </label>

        <label>Tomada
          <el-input-number
            v-model="attempt.tomada"
            :min="1"
            :max="config?.numeroTomadas || 1"
            controls-position="right"
          />
        </label>
        <label>Tentativa
          <el-input-number
            v-model="attempt.numeroTentativa"
            :min="1"
            :max="config?.tentativasPorTomada || 1"
            controls-position="right"
          />
        </label>

        <label>Tempo (s)
          <el-input-number
            v-model="attempt.tempoSegundos"
            :min="0"
            :precision="3"
            :step="10"
            :step-strictly="false"
            controls-position="right"
          />
          <small>Os botões variam ±10 s; o valor pode ser digitado com precisão normalmente.</small>
        </label>
        <label>Penalidade (s)
          <el-input-number
            v-model="attempt.penalidadeSegundos"
            :min="0"
            controls-position="right"
          />
        </label>

        <label>Checkpoints alcançados
          <el-input-number
            v-model="attempt.checkpointsAlcancados"
            :min="0"
            :max="config?.numeroCheckpoints || 0"
            controls-position="right"
          />
          <small v-if="config">0 a {{ config.numeroCheckpoints }} conforme configuração.</small>
        </label>

        <div class="follow-attempt-flags">
          <el-checkbox v-model="attempt.concluida">Tentativa concluída</el-checkbox>
          <el-checkbox v-model="attempt.valida">Tentativa válida</el-checkbox>
        </div>

        <label class="span-2">Observação
          <el-input v-model="attempt.observacao" type="textarea" :rows="3" placeholder="Opcional" />
        </label>

        <div v-if="config" class="span-2 follow-attempt-rule-note">
          Limite configurado: {{ config.maxTempoSegundos }} s. Se o tempo ultrapassar esse valor, o backend persiste a passagem como inválida.
        </div>
      </div>

      <template #footer>
        <el-button @click="dialog=false">Cancelar</el-button>
        <el-button class="brand-button" @click="saveAttempt">Registrar tentativa</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.follow-workspace {
  gap: 18px;
}

.follow-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.follow-metric-card {
  display: grid;
  gap: 4px;
  min-height: 112px;
  padding: 17px 18px;
  border: 1px solid #e8dfe4;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(66, 24, 45, .04);
}

.follow-metric-card span,
.follow-metric-card small {
  color: #83747c;
  font-size: 11px;
}

.follow-metric-card strong {
  color: #2b2026;
  font-size: 24px;
  line-height: 1.05;
}

.follow-metric-card.highlight {
  border-color: #e2bac8;
  background: linear-gradient(135deg, #fff 0%, #fff6f9 100%);
}

.follow-metric-card.highlight strong {
  color: #9f0f3b;
}

.follow-config-strip {
  display: grid;
  grid-template-columns: minmax(190px, .8fr) minmax(320px, 1.4fr);
  gap: 8px 22px;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid #eadfe5;
  border-radius: 14px;
  background: #fff;
}

.follow-config-strip > div:first-child {
  display: grid;
  gap: 3px;
}

.follow-config-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.follow-config-values span {
  padding: 7px 10px;
  border-radius: 999px;
  background: #f6f1f4;
  color: #6f5d66;
  font-size: 11px;
}

.follow-config-values b {
  color: #9f0f3b;
}

.follow-config-strip > small {
  grid-column: 1 / -1;
  color: #8b7b83;
  font-size: 10px;
}

.follow-ranking-card,
.follow-history-card {
  overflow: hidden;
}

.ranking-position,
.ranking-final-time {
  color: #9f0f3b;
}

.follow-history-heading {
  gap: 18px;
  align-items: flex-end;
}

.follow-history-filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.follow-history-filters .el-input {
  width: 235px;
}

.follow-robot-cell {
  display: grid;
  gap: 2px;
}

.follow-robot-cell small {
  color: #8a7d84;
  font-size: 10px;
}

.follow-attempt-dialog {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.follow-attempt-dialog label {
  display: grid;
  gap: 7px;
  color: #342830;
  font-size: 12px;
  font-weight: 700;
}

.follow-attempt-dialog label > small {
  color: #8d7e86;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.35;
}

.follow-attempt-dialog .el-input-number {
  width: 100%;
}

.span-2 {
  grid-column: 1 / -1;
}

.follow-attempt-flags {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 40px;
}

.follow-attempt-rule-note {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8f4f6;
  color: #786871;
  font-size: 10px;
  line-height: 1.45;
}

@media (max-width: 1080px) {
  .follow-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .follow-config-strip {
    grid-template-columns: 1fr;
  }

  .follow-config-strip > small {
    grid-column: auto;
  }
}

@media (max-width: 760px) {
  .follow-metrics {
    grid-template-columns: 1fr;
  }

  .follow-history-heading,
  .follow-history-filters {
    align-items: stretch;
    flex-direction: column;
  }

  .follow-history-filters .el-input,
  .follow-history-filters .el-select {
    width: 100% !important;
  }

  .follow-attempt-dialog {
    grid-template-columns: 1fr;
  }

  .follow-attempt-dialog .span-2 {
    grid-column: auto;
  }

  .follow-attempt-flags {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
