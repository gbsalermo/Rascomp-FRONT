<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type {
  AgendaActivity,
  Category,
  FollowCallStatus,
  FollowScheduleStatus,
  FollowTakeSchedule,
  FollowTakeScheduleEntry,
  Match,
  MatchCallStatus
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const competition = useCompetitionStore()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const queueLoading = ref(false)
const competitionId = ref<number>()
const activities = ref<AgendaActivity[]>([])
const categories = ref<Category[]>([])
const modalityFilter = ref('')
const categoryFilter = ref<number>()
const trackFilter = ref('')

const followDialog = ref(false)
const editingFollow = ref<FollowTakeSchedule>()
const followForm = reactive({
  categoryId: undefined as number | undefined,
  tomada: 1,
  dataHora: '',
  pista: '',
  ordemExecucao: undefined as number | undefined,
  status: 'AGENDADA' as FollowScheduleStatus
})

const matchDialog = ref(false)
const editingMatch = ref<Match>()
const matchForm = reactive({
  dataHora: '',
  pista: '',
  ordemExecucao: undefined as number | undefined,
  statusConvocacao: 'NAO_CONVOCADA' as MatchCallStatus
})

const queueDialog = ref(false)
const queueSchedule = ref<FollowTakeSchedule>()
const queue = ref<FollowTakeScheduleEntry[]>([])

const followCategories = computed(() =>
  categories.value.filter((item) => item.modalidade === 'FOLLOW_LINE' && item.ativo !== false)
)

const contextCompetition = computed(() =>
  competition.competitions.find((item) => item.id === competitionId.value)
)

const contextLabel = computed(() => auth.isDev ? 'Competição em foco' : 'Competição vigente')

const filteredActivities = computed(() =>
  activities.value.filter((item) => {
    if (modalityFilter.value && item.modalidade !== modalityFilter.value) return false
    if (categoryFilter.value && item.categoryId !== categoryFilter.value) return false
    const track = trackFilter.value.trim().toLocaleLowerCase('pt-BR')
    if (track && !(item.pista || '').toLocaleLowerCase('pt-BR').includes(track)) return false
    return true
  })
)

function formatDateTime(value?: string) {
  if (!value) return 'Não agendada'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

function modalityLabel(item: AgendaActivity) {
  return item.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô'
}

function statusLabel(value?: string) {
  if (!value) return '—'
  const labels: Record<string, string> = {
    AGENDADA: 'Agendada',
    EM_CHAMADA: 'Em chamada',
    EM_ANDAMENTO: 'Em andamento',
    FINALIZADA: 'Finalizada',
    ADIADA: 'Adiada',
    CANCELADA: 'Cancelada',
    NAO_CONVOCADA: 'Não convocada',
    CONVOCADA: 'Convocada',
    PRONTA: 'Pronta',
    AGUARDANDO: 'Aguardando',
    EM_APRESENTACAO: 'Em apresentação',
    EM_EXECUCAO: 'Em execução',
    CONCLUIDA: 'Concluída',
    AUSENTE: 'Ausente'
  }
  return labels[value] || value.replaceAll('_', ' ')
}

function resetFollowForm() {
  editingFollow.value = undefined
  followForm.categoryId = followCategories.value[0]?.id
  followForm.tomada = 1
  followForm.dataHora = ''
  followForm.pista = ''
  followForm.ordemExecucao = undefined
  followForm.status = 'AGENDADA'
}

function openNewFollow() {
  resetFollowForm()
  followDialog.value = true
}

async function openFollow(activity: AgendaActivity) {
  const schedule = await adminApi.followSchedules(activity.competitionId)
    .then((items) => items.find((item) => item.id === activity.sourceId))
  if (!schedule) return ElMessage.error('Chamada Follow não encontrada.')
  editingFollow.value = schedule
  followForm.categoryId = schedule.categoryId
  followForm.tomada = schedule.tomada
  followForm.dataHora = schedule.dataHora
  followForm.pista = schedule.pista || ''
  followForm.ordemExecucao = schedule.ordemExecucao
  followForm.status = schedule.status || 'AGENDADA'
  followDialog.value = true
}

async function saveFollow() {
  if (!competitionId.value || !followForm.categoryId || !followForm.dataHora) {
    return ElMessage.warning('Informe categoria, tomada e horário da chamada.')
  }
  saving.value = true
  try {
    const payload = {
      id: editingFollow.value?.id || 0,
      competitionId: competitionId.value,
      categoryId: followForm.categoryId,
      tomada: followForm.tomada,
      dataHora: followForm.dataHora,
      pista: followForm.pista.trim() || undefined,
      ordemExecucao: followForm.ordemExecucao,
      status: followForm.status,
      ativo: true
    } as FollowTakeSchedule

    if (editingFollow.value) {
      await adminApi.updateFollowSchedule(editingFollow.value.id, payload)
      ElMessage.success('Chamada do Follow atualizada.')
    } else {
      const { id: _id, ...createPayload } = payload
      await adminApi.createFollowSchedule(createPayload)
      ElMessage.success('Chamada geral da tomada criada.')
    }
    followDialog.value = false
    await loadAgenda()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível salvar a chamada do Follow.')
  } finally {
    saving.value = false
  }
}

async function openMatch(activity: AgendaActivity) {
  if (!activity.matchId) return
  try {
    const match = await adminApi.match(activity.matchId)
    editingMatch.value = match
    matchForm.dataHora = match.dataHora || ''
    matchForm.pista = match.pista || ''
    matchForm.ordemExecucao = match.ordemExecucao
    matchForm.statusConvocacao = match.statusConvocacao || 'NAO_CONVOCADA'
    matchDialog.value = true
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível abrir a agenda da partida.')
  }
}

async function saveMatch() {
  if (!editingMatch.value) return
  saving.value = true
  try {
    await adminApi.updateMatchAgenda(editingMatch.value.id, {
      dataHora: matchForm.dataHora || null,
      pista: matchForm.pista.trim() || null,
      ordemExecucao: matchForm.ordemExecucao || null,
      statusConvocacao: matchForm.statusConvocacao
    })
    matchDialog.value = false
    ElMessage.success('Agenda da batalha atualizada sem alterar a chave.')
    await loadAgenda()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a batalha.')
  } finally {
    saving.value = false
  }
}

async function openQueue(activity: AgendaActivity) {
  const schedules = await adminApi.followSchedules(activity.competitionId)
  const schedule = schedules.find((item) => item.id === activity.sourceId)
  if (!schedule) return ElMessage.error('Chamada Follow não encontrada.')
  queueSchedule.value = schedule
  queueDialog.value = true
  await loadQueue()
}

async function loadQueue() {
  if (!queueSchedule.value) return
  queueLoading.value = true
  try {
    queue.value = await adminApi.followScheduleQueue(queueSchedule.value.id)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar a fila da tomada.')
  } finally {
    queueLoading.value = false
  }
}

async function syncQueue() {
  if (!queueSchedule.value) return
  queueLoading.value = true
  try {
    queue.value = await adminApi.syncFollowScheduleQueue(queueSchedule.value.id)
    ElMessage.success('Fila sincronizada com as inscrições aprovadas.')
    await loadAgenda()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível sincronizar a fila.')
  } finally {
    queueLoading.value = false
  }
}

async function updateCall(entry: FollowTakeScheduleEntry, status: FollowCallStatus) {
  try {
    const updated = await adminApi.updateFollowCall(entry.id, {
      ordemConvocacao: entry.ordemConvocacao,
      status
    })
    Object.assign(entry, updated)
    await loadAgenda()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a convocação.')
  }
}

async function updateCallOrder(entry: FollowTakeScheduleEntry) {
  try {
    const updated = await adminApi.updateFollowCall(entry.id, {
      ordemConvocacao: entry.ordemConvocacao,
      status: entry.status
    })
    Object.assign(entry, updated)
    queue.value.sort((a, b) => a.ordemConvocacao - b.ordemConvocacao)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a ordem.')
  }
}

async function operateTake(entry: FollowTakeScheduleEntry) {
  if (!queueSchedule.value) return

  if (!['EM_APRESENTACAO', 'EM_EXECUCAO'].includes(entry.status)) {
    try {
      const updated = await adminApi.updateFollowCall(entry.id, {
        ordemConvocacao: entry.ordemConvocacao,
        status: 'EM_APRESENTACAO'
      })
      Object.assign(entry, updated)
    } catch (error: any) {
      return ElMessage.error(error?.response?.data?.message || 'Não foi possível iniciar a apresentação.')
    }
  }

  queueDialog.value = false
  router.push({
    name: 'follow-run',
    params: { registrationId: String(entry.registrationId) },
    query: {
      competitionId: String(queueSchedule.value.competitionId),
      categoryId: String(queueSchedule.value.categoryId),
      tomada: String(queueSchedule.value.tomada),
      scheduleId: String(queueSchedule.value.id)
    }
  })
}

function openArena(activity: AgendaActivity) {
  if (!activity.matchId) return
  router.push({
    name: 'sumo-match',
    params: { matchId: String(activity.matchId) },
    query: {
      competitionId: String(activity.competitionId),
      categoryId: String(activity.categoryId),
      ...(activity.bracketId ? { bracketId: String(activity.bracketId) } : {})
    }
  })
}

async function loadAgenda() {
  if (!competitionId.value) {
    activities.value = []
    return
  }
  loading.value = true
  activities.value = []
  try {
    activities.value = await adminApi.agenda(competitionId.value)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar a agenda competitiva.')
  } finally {
    loading.value = false
  }
}

async function initialize() {
  loading.value = true
  try {
    const [, cats] = await Promise.all([competition.load(), adminApi.categories()])
    categories.value = cats.filter((item) => item.ativo !== false)
    competitionId.value = competition.selectedId || competition.competitions[0]?.id
    await loadAgenda()
  } finally {
    loading.value = false
  }
}

watch(() => competition.selectedId, async (value) => {
  if (!value || value === competitionId.value) return
  competitionId.value = value
  categoryFilter.value = undefined
  trackFilter.value = ''
  await loadAgenda()
})

watch(competitionId, async (value) => {
  if (!value) return
  if (auth.isDev && competition.selectedId !== value) competition.select(value)
  categoryFilter.value = undefined
  trackFilter.value = ''
  await loadAgenda()
})

onMounted(initialize)
</script>

<template>
  <div class="page-stack agenda-page" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Operação ao vivo</span>
        <h1>Agenda</h1>
        <p class="muted">Tomadas do Follow e batalhas de Sumô na mesma programação operacional.</p>
      </div>
      <div class="heading-actions">
        <el-button @click="loadAgenda">Atualizar</el-button>
        <el-button class="brand-button" @click="openNewFollow">Agendar tomada Follow</el-button>
      </div>
    </div>

    <article class="agenda-context-card">
      <div>
        <span class="eyebrow">{{ contextLabel }}</span>
        <strong>{{ contextCompetition?.nome || 'Nenhuma competição selecionada' }}</strong>
        <small>{{ auth.isDev ? 'A troca de foco é local ao DEV.' : 'A GESTAO acompanha a edição vigente definida pelo DEV.' }}</small>
      </div>
      <StatusBadge v-if="contextCompetition?.status" :value="contextCompetition.status" />
    </article>

    <article class="filter-bar agenda-filter-bar">
      <el-select v-if="auth.isDev" v-model="competitionId" placeholder="Competição em foco" style="width:280px">
        <el-option v-for="item in competition.competitions" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-select v-model="modalityFilter" clearable placeholder="Todas as modalidades" style="width:190px">
        <el-option label="Follow Line" value="FOLLOW_LINE" />
        <el-option label="Sumô" value="SUMO" />
      </el-select>
      <el-select v-model="categoryFilter" clearable placeholder="Todas as categorias" style="width:240px">
        <el-option v-for="item in categories" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-input v-model="trackFilter" clearable placeholder="Filtrar pista/dohyo" style="width:210px" />
    </article>

    <article class="table-card agenda-table-card">
      <el-table :data="filteredActivities" empty-text="Nenhuma atividade na agenda">
        <el-table-column label="Ordem" width="82">
          <template #default="{ row }"><strong>{{ row.ordemExecucao || '—' }}</strong></template>
        </el-table-column>
        <el-table-column label="Horário" width="155">
          <template #default="{ row }">{{ formatDateTime(row.dataHora) }}</template>
        </el-table-column>
        <el-table-column label="Modalidade" width="125">
          <template #default="{ row }">
            <el-tag :type="row.modalidade === 'FOLLOW_LINE' ? 'success' : 'danger'" effect="light">{{ modalityLabel(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categoryNome" label="Categoria" min-width="170" />
        <el-table-column label="Atividade" min-width="230">
          <template #default="{ row }">
            <div class="agenda-activity-name">
              <strong>{{ row.titulo }}</strong>
              <small v-if="row.tipo === 'FOLLOW_TAKE'">{{ row.concluidos || 0 }}/{{ row.totalFila || 0 }} concluídos · {{ row.ausentes || 0 }} ausência(s)</small>
              <small v-else>Batalha da chave atual</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Pista / Dohyo" width="140">
          <template #default="{ row }">{{ row.pista || '—' }}</template>
        </el-table-column>
        <el-table-column label="Estado" width="150">
          <template #default="{ row }"><span class="agenda-status">{{ statusLabel(row.status) }}</span></template>
        </el-table-column>
        <el-table-column label="Ações" width="260" fixed="right" align="right">
          <template #default="{ row }">
            <div class="agenda-actions">
              <template v-if="row.tipo === 'FOLLOW_TAKE'">
                <el-button link type="primary" @click="openQueue(row)">Fila</el-button>
                <el-button link @click="openFollow(row)">Editar</el-button>
              </template>
              <template v-else>
                <el-button link type="primary" @click="openMatch(row)">Agenda</el-button>
                <el-button link @click="openArena(row)">Partida</el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <el-dialog v-model="followDialog" :title="editingFollow ? 'Editar chamada Follow' : 'Agendar tomada Follow'" width="min(600px, 94vw)">
      <div class="form-grid">
        <label>Categoria
          <el-select v-model="followForm.categoryId" :disabled="Boolean(editingFollow)" style="width:100%">
            <el-option v-for="item in followCategories" :key="item.id" :label="item.nome" :value="item.id" />
          </el-select>
        </label>
        <label>Tomada
          <el-input-number v-model="followForm.tomada" :min="1" :max="3" :disabled="Boolean(editingFollow)" style="width:100%" />
        </label>
        <label class="span-2">Data e horário
          <el-date-picker v-model="followForm.dataHora" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" format="DD/MM/YYYY HH:mm" style="width:100%" />
        </label>
        <label>Pista
          <el-input v-model="followForm.pista" maxlength="80" placeholder="Ex.: Pista A" />
        </label>
        <label>Ordem geral
          <el-input-number v-model="followForm.ordemExecucao" :min="1" style="width:100%" />
        </label>
        <label class="span-2">Estado da chamada
          <el-select v-model="followForm.status" style="width:100%">
            <el-option label="Agendada" value="AGENDADA" />
            <el-option label="Em chamada" value="EM_CHAMADA" />
            <el-option label="Em andamento" value="EM_ANDAMENTO" />
            <el-option label="Adiada" value="ADIADA" />
            <el-option label="Cancelada" value="CANCELADA" />
          </el-select>
        </label>
        <p class="span-2 muted agenda-dialog-hint">A fila é formada pelas inscrições aprovadas da categoria e pode ser sincronizada sem apagar o histórico existente.</p>
      </div>
      <template #footer>
        <el-button @click="followDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="saving" @click="saveFollow">Salvar chamada</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="matchDialog" title="Agenda da batalha de Sumô" width="min(580px, 94vw)">
      <div v-if="editingMatch" class="form-grid">
        <div class="span-2 agenda-match-context">
          <span class="eyebrow">Estrutura protegida</span>
          <strong>{{ editingMatch.robotANome || 'A definir' }} × {{ editingMatch.robotBNome || 'A definir' }}</strong>
          <small>Rodada {{ editingMatch.rodada }} · posição {{ editingMatch.ordem }}</small>
        </div>
        <label class="span-2">Data e horário
          <el-date-picker v-model="matchForm.dataHora" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" format="DD/MM/YYYY HH:mm" style="width:100%" />
        </label>
        <label>Pista / Dohyo
          <el-input v-model="matchForm.pista" maxlength="80" />
        </label>
        <label>Ordem geral
          <el-input-number v-model="matchForm.ordemExecucao" :min="1" style="width:100%" />
        </label>
        <label class="span-2">Convocação
          <el-select v-model="matchForm.statusConvocacao" style="width:100%">
            <el-option label="Não convocada" value="NAO_CONVOCADA" />
            <el-option label="Convocada" value="CONVOCADA" />
            <el-option label="Em chamada" value="EM_CHAMADA" />
            <el-option label="Pronta" value="PRONTA" />
            <el-option label="Adiada" value="ADIADA" />
          </el-select>
        </label>
      </div>
      <template #footer>
        <el-button @click="matchDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="saving" @click="saveMatch">Salvar agenda</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="queueDialog" title="Fila da tomada" width="min(860px, 96vw)">
      <div v-if="queueSchedule" class="agenda-queue-head">
        <div>
          <span class="eyebrow">{{ queueSchedule.categoryNome }}</span>
          <strong>Tomada {{ queueSchedule.tomada }} · {{ formatDateTime(queueSchedule.dataHora) }}</strong>
          <small>{{ queueSchedule.pista || 'Pista não informada' }}</small>
        </div>
        <el-button :loading="queueLoading" @click="syncQueue">Sincronizar inscrições</el-button>
      </div>

      <el-table v-loading="queueLoading" :data="queue" empty-text="Fila vazia">
        <el-table-column label="#" width="90">
          <template #default="{ row }">
            <el-input-number v-model="row.ordemConvocacao" :min="1" size="small" controls-position="right" @change="updateCallOrder(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="robotNome" label="Robô" min-width="150" />
        <el-table-column prop="teamNome" label="Equipe" min-width="160" />
        <el-table-column label="Situação" width="145">
          <template #default="{ row }"><span>{{ statusLabel(row.status) }}</span></template>
        </el-table-column>
        <el-table-column label="Ações" min-width="320" align="right">
          <template #default="{ row }">
            <div class="agenda-actions">
              <el-button v-if="row.status === 'AGUARDANDO'" link type="primary" @click="updateCall(row, 'CONVOCADA')">Convocar</el-button>
              <el-button v-if="['AGUARDANDO','CONVOCADA'].includes(row.status)" link @click="updateCall(row, 'EM_APRESENTACAO')">Apresentação</el-button>
              <el-button v-if="!['AUSENTE','CONCLUIDA'].includes(row.status)" link type="success" @click="operateTake(row)">Operar tomada</el-button>
              <span v-else class="muted">{{ row.status === 'AUSENTE' ? 'Ausente' : 'Concluída' }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped>
.agenda-page { gap:18px; }
.agenda-context-card { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:15px 18px; border:1px solid #eadde3; border-left:4px solid #c31549; border-radius:14px; background:linear-gradient(100deg,#fff7f9,#fff 58%); }
.agenda-context-card > div { display:grid; gap:4px; min-width:0; }
.agenda-context-card .eyebrow { margin:0; }
.agenda-context-card strong { color:#34272e; font-size:15px; }
.agenda-context-card small { color:#7e7077; }
.agenda-table-card { overflow:hidden; }
.agenda-activity-name { display:grid; gap:3px; }
.agenda-activity-name small { color:#897a82; font-size:10px; }
.agenda-status { font-size:11px; font-weight:800; color:#6c5862; }
.agenda-actions { display:flex; align-items:center; justify-content:flex-end; flex-wrap:wrap; gap:6px; }
.agenda-dialog-hint { margin:0; font-size:11px; line-height:1.5; }
.agenda-match-context,.agenda-queue-head { padding:12px 14px; border:1px solid #eadfe4; border-radius:12px; background:#fcfafb; }
.agenda-match-context { display:grid; gap:3px; }
.agenda-match-context small { color:#7e7077; }
.agenda-queue-head { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:14px; }
.agenda-queue-head > div { display:grid; gap:3px; }
.agenda-queue-head small { color:#7e7077; }
@media (max-width:760px) {
  .agenda-context-card,.agenda-queue-head { align-items:flex-start; flex-direction:column; }
  .agenda-filter-bar :deep(.el-select),.agenda-filter-bar :deep(.el-input) { width:100% !important; }
}
</style>
