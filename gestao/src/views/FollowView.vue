<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Category, ConfigFollow, FollowAttempt, RankingItem, Registration } from '../types'

const route = useRoute()
const router = useRouter()
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
const registrationDialog = ref(false)
const selectedRegistrationId = ref<number>()
const historySearch = ref('')
const historyStatus = ref<'TODOS' | 'VALIDA' | 'INVALIDA' | 'INCOMPLETA'>('TODOS')

const approved = computed(() =>
  registrations.value.filter(
    (item) => item.status === 'APROVADA' && item.ativo !== false && item.categoryId === categoryId.value
  )
)

const validCompletedCount = computed(() =>
  history.value.filter((item) => item.valida && item.concluida).length
)

const bestTime = computed(() => ranking.value[0]?.tempoFinalSegundos)

const selectedRegistration = computed(() =>
  approved.value.find((item) => item.id === selectedRegistrationId.value)
)

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

function queryNumber(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
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
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function remainingSlotsFor(registrationId: number) {
  if (!config.value) return 0
  const total = config.value.numeroTomadas * config.value.tentativasPorTomada
  const used = history.value.filter((item) => item.registrationId === registrationId).length
  return Math.max(0, total - used)
}

function progressFor(registrationId: number) {
  if (!config.value) return '—'
  const total = config.value.numeroTomadas * config.value.tentativasPorTomada
  const remaining = remainingSlotsFor(registrationId)
  return `${total - remaining} / ${total} tentativas registradas`
}

async function initialize() {
  loading.value = true
  try {
    const [, cats] = await Promise.all([
      competition.load(),
      adminApi.categories('FOLLOW_LINE')
    ])

    categories.value = cats.filter((item) => item.ativo !== false)

    const requestedCompetition = queryNumber(route.query.competitionId)
    const requestedCategory = queryNumber(route.query.categoryId)

    competitionId.value = competition.competitions.some((item) => item.id === requestedCompetition)
      ? requestedCompetition
      : competition.selectedId || competition.competitions[0]?.id

    categoryId.value = categories.value.some((item) => item.id === requestedCategory)
      ? requestedCategory
      : categories.value[0]?.id

    if (competitionId.value && competition.selectedId !== competitionId.value) competition.select(competitionId.value)
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

function openTakeDialog() {
  if (!config.value) {
    return ElMessage.warning('Esta categoria ainda não possui configuração de Follow Line.')
  }
  if (!approved.value.length) {
    return ElMessage.warning('Não há inscrições aprovadas nesta categoria.')
  }

  selectedRegistrationId.value = approved.value.find((item) => remainingSlotsFor(item.id) > 0)?.id || approved.value[0]?.id
  registrationDialog.value = true
}

function openSelectedTake() {
  if (!selectedRegistrationId.value || !competitionId.value || !categoryId.value) {
    return ElMessage.warning('Selecione uma inscrição.')
  }

  registrationDialog.value = false
  router.push({
    name: 'follow-run',
    params: { registrationId: selectedRegistrationId.value },
    query: {
      competitionId: competitionId.value,
      categoryId: categoryId.value
    }
  })
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

onMounted(initialize)
</script>

<template>
  <div class="page-stack follow-workspace" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Operação · Follow Line</span>
        <h1>Seguidor de Linha</h1>
        <p class="muted">Registre tomadas e acompanhe a classificação oficial calculada pelo backend.</p>
      </div>
      <el-button class="brand-button" @click="openTakeDialog">Registrar tomada</el-button>
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

    <el-dialog v-model="registrationDialog" title="Registrar tomada" width="min(560px, 94vw)">
      <div class="follow-registration-dialog">
        <div>
          <span class="eyebrow">Entrada na pista</span>
          <h3>Qual robô vai realizar a tomada?</h3>
          <p class="muted">Selecione uma inscrição aprovada. A tela operacional abrirá automaticamente na primeira tomada ainda incompleta.</p>
        </div>

        <label>Inscrição
          <el-select v-model="selectedRegistrationId" filterable style="width:100%">
            <el-option
              v-for="item in approved"
              :key="item.id"
              :label="`${item.robotNome} · ${item.teamNome} · ${remainingSlotsFor(item.id)} restantes`"
              :value="item.id"
            />
          </el-select>
        </label>

        <div v-if="selectedRegistration && config" class="follow-registration-preview">
          <div class="follow-registration-avatar">
            {{ selectedRegistration.robotNome?.slice(0, 2).toUpperCase() || 'RB' }}
          </div>
          <div>
            <strong>{{ selectedRegistration.robotNome }}</strong>
            <span>{{ selectedRegistration.teamNome }}</span>
            <small>{{ progressFor(selectedRegistration.id) }}</small>
          </div>
          <b>{{ remainingSlotsFor(selectedRegistration.id) }}</b>
          <small>tentativas restantes</small>
        </div>
      </div>

      <template #footer>
        <el-button @click="registrationDialog=false">Cancelar</el-button>
        <el-button class="brand-button" :disabled="!selectedRegistrationId" @click="openSelectedTake">
          Abrir tomada
        </el-button>
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

.follow-registration-dialog {
  display: grid;
  gap: 18px;
}

.follow-registration-dialog h3 {
  margin: 3px 0 5px;
}

.follow-registration-dialog p {
  margin: 0;
}

.follow-registration-dialog label {
  display: grid;
  gap: 7px;
  color: #342830;
  font-size: 12px;
  font-weight: 800;
}

.follow-registration-preview {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #eadde3;
  border-radius: 14px;
  background: #fff8fa;
}

.follow-registration-avatar {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(145deg, #4f1967, #9f0f3b);
  color: #fff;
  font-weight: 900;
}

.follow-registration-preview > div:nth-child(2) {
  display: grid;
  gap: 2px;
}

.follow-registration-preview span,
.follow-registration-preview small {
  color: #86777f;
  font-size: 10px;
}

.follow-registration-preview b {
  color: #9f0f3b;
  font-size: 24px;
}

.follow-registration-preview > small:last-child {
  grid-column: 3;
  margin-top: -10px;
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

  .follow-registration-preview {
    grid-template-columns: auto 1fr;
  }

  .follow-registration-preview b,
  .follow-registration-preview > small:last-child {
    grid-column: 2;
  }
}
</style>
