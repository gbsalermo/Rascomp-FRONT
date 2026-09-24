<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type {
  Registration,
  RegistrationCancellationRequest,
  RegistrationStatus,
  RegistrationStatusHistory
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const competition = useCompetitionStore()

const loading = ref(false)
const reviewingId = ref<number>()
const registrationActionId = ref<number>()
const cancellationReviewingId = ref<number>()
const rows = ref<Registration[]>([])
const cancellationRequests = ref<RegistrationCancellationRequest[]>([])
const competitionId = ref<number>()
const status = ref<string>('PENDENTE')
const search = ref('')
const detailsOpen = ref(false)
const selected = ref<Registration>()
const statusHistory = ref<RegistrationStatusHistory[]>([])
const statusHistoryLoading = ref(false)

const statusOptions: RegistrationStatus[] = [
  'PENDENTE',
  'APROVADA',
  'REJEITADA',
  'CANCELADA',
  'DESISTENTE',
  'DESCLASSIFICADA'
]

const pendingCancellationRequests = computed(() =>
  cancellationRequests.value.filter((item) => item.status === 'PENDENTE')
)

const cancellationHistory = computed(() =>
  cancellationRequests.value
    .filter((item) => item.status !== 'PENDENTE')
    .sort(
      (a, b) =>
        new Date(b.reviewedAt || b.dataCadastro || 0).getTime() -
        new Date(a.reviewedAt || a.dataCadastro || 0).getTime()
    )
    .slice(0, 10)
)

const selectedCancellationHistory = computed(() => {
  if (!selected.value) return []
  return cancellationRequests.value
    .filter((item) => item.registrationId === selected.value?.id)
    .sort(
      (a, b) =>
        new Date(b.reviewedAt || b.dataCadastro || 0).getTime() -
        new Date(a.reviewedAt || a.dataCadastro || 0).getTime()
    )
})

const activeCompetition = computed(() =>
  competition.competitions.find((item) => item.id === competitionId.value)
)
const competitionContextLabel = computed(() =>
  auth.isDev ? 'Competição filtrada' : 'Competição vigente'
)

const filtered = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('pt-BR')

  return rows.value.filter((item) => {
    const matchesStatus = !status.value || item.status === status.value
    if (!matchesStatus) return false
    if (!query) return true

    const haystack = [
      item.teamNome,
      item.robotNome,
      item.categoryNome,
      item.requestedByUserNome,
      ...(item.competitorNomes || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('pt-BR')

    return haystack.includes(query)
  })
})

const counts = computed(() => ({
  total: rows.value.length,
  pendente: rows.value.filter((item) => item.status === 'PENDENTE').length,
  aprovada: rows.value.filter((item) => item.status === 'APROVADA').length,
  rejeitada: rows.value.filter((item) => item.status === 'REJEITADA').length
}))

function statusHistoryActionLabel(item: RegistrationStatusHistory) {
  const labels: Record<RegistrationStatusHistory['changeType'], string> = {
    CRIACAO: 'Inscrição criada',
    APROVACAO: 'Inscrição aprovada',
    REJEICAO: 'Inscrição rejeitada',
    CANCELAMENTO: 'Inscrição cancelada',
    DESISTENCIA: 'Desistência registrada',
    REATIVACAO: 'Inscrição reativada',
    DESCLASSIFICACAO: 'Inscrição desclassificada'
  }
  return labels[item.changeType]
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

async function loadBase() {
  loading.value = true
  try {
    await competition.load(true)
    competitionId.value = competition.selectedId || undefined
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar as inscrições.')
  } finally {
    loading.value = false
  }
}

async function load() {
  if (!competitionId.value) {
    rows.value = []
    cancellationRequests.value = []
    return
  }

  loading.value = true
  try {
    const [registrationRows, cancellationRows] = await Promise.all([
      adminApi.registrations({ competitionId: competitionId.value }),
      adminApi.cancellationRequests({
        competitionId: competitionId.value
      })
    ])
    rows.value = registrationRows
    cancellationRequests.value = cancellationRows

    if (selected.value) {
      selected.value = rows.value.find((item) => item.id === selected.value?.id)
      if (!selected.value) detailsOpen.value = false
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar as inscrições.')
  } finally {
    loading.value = false
  }
}

async function openDetails(row: Registration) {
  selected.value = row
  detailsOpen.value = true
  statusHistory.value = []
  statusHistoryLoading.value = true

  try {
    statusHistory.value = await adminApi.registrationStatusHistory(row.id)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar o histórico da inscrição.')
  } finally {
    statusHistoryLoading.value = false
  }
}

function selectStatus(next: string) {
  status.value = status.value === next ? '' : next
}

async function review(row: Registration, next: RegistrationStatus) {
  const approving = next === 'APROVADA'
  let reviewReason: string | undefined

  try {
    if (approving) {
      await ElMessageBox.confirm(
        `Deseja aprovar a inscrição do robô ${row.robotNome}, da equipe ${row.teamNome}?`,
        'Aprovar inscrição',
        {
          type: 'success',
          confirmButtonText: 'Aprovar',
          cancelButtonText: 'Cancelar'
        }
      )
    } else {
      const result = await ElMessageBox.prompt(
        'Informe o motivo da rejeição. Essa justificativa ficará registrada na inscrição.',
        `Rejeitar inscrição · ${row.robotNome}`,
        {
          inputType: 'textarea',
          inputPlaceholder: 'Motivo da rejeição',
          inputValidator: (value) => value?.trim() ? true : 'Informe o motivo da rejeição.',
          confirmButtonText: 'Rejeitar inscrição',
          cancelButtonText: 'Cancelar'
        }
      )
      reviewReason = result.value?.trim()
    }

    reviewingId.value = row.id
    await adminApi.updateRegistration(row.id, {
      ...row,
      status: next,
      reviewReason
    })
    ElMessage.success(approving ? 'Inscrição aprovada.' : 'Inscrição rejeitada com justificativa registrada.')
    detailsOpen.value = false
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a inscrição.')
  } finally {
    reviewingId.value = undefined
  }
}

async function cancelRegistration(row: Registration) {
  if (!['PENDENTE', 'APROVADA'].includes(row.status)) return

  const approved = row.status === 'APROVADA'
  try {
    await ElMessageBox.confirm(
      approved
        ? 'Cancelar uma inscrição aprovada preserva o histórico. Se já houver atividade competitiva, o status será DESISTENTE.'
        : 'Cancelar esta inscrição pendente? Ela poderá ser reativada apenas se a janela de inscrições permitir.',
      `Cancelar inscrição · ${row.robotNome}`,
      {
        type: 'warning',
        confirmButtonText: 'Confirmar cancelamento',
        cancelButtonText: 'Voltar'
      }
    )

    registrationActionId.value = row.id
    await adminApi.cancelRegistration(row.id)
    ElMessage.success('Inscrição cancelada conforme as regras da competição.')
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível cancelar a inscrição.')
  } finally {
    registrationActionId.value = undefined
  }
}

async function disqualifyRegistration(row: Registration) {
  if (row.status !== 'APROVADA') return

  try {
    const result = await ElMessageBox.prompt(
      'Informe o motivo da desclassificação. A inscrição permanecerá no histórico e a decisão será auditada.',
      `Desclassificar · ${row.robotNome}`,
      {
        inputType: 'textarea',
        inputPlaceholder: 'Motivo da desclassificação',
        inputValidator: (value) => value?.trim() ? true : 'Informe o motivo da desclassificação.',
        confirmButtonText: 'Desclassificar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )

    registrationActionId.value = row.id
    await adminApi.disqualifyRegistration(row.id, result.value.trim())
    ElMessage.success('Inscrição desclassificada e decisão registrada no histórico.')
    detailsOpen.value = false
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível desclassificar a inscrição.')
  } finally {
    registrationActionId.value = undefined
  }
}

async function reactivateRegistration(row: Registration) {
  if (!['CANCELADA', 'REJEITADA'].includes(row.status)) return

  try {
    await ElMessageBox.confirm(
      'A inscrição voltará para PENDENTE e precisará ser analisada novamente. A reativação administrativa exige que a competição esteja com inscrições abertas.',
      `Reativar inscrição · ${row.robotNome}`,
      {
        type: 'info',
        confirmButtonText: 'Reativar',
        cancelButtonText: 'Cancelar'
      }
    )

    registrationActionId.value = row.id
    await adminApi.reactivateRegistration(row.id)
    ElMessage.success('Inscrição reativada e devolvida para análise.')
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível reativar a inscrição.')
  } finally {
    registrationActionId.value = undefined
  }
}

async function decideCancellation(request: RegistrationCancellationRequest, approve: boolean) {
  try {
    let resposta = ''
    if (approve) {
      await ElMessageBox.confirm(
        `Aprovar o cancelamento da inscrição de ${request.robotNome || 'este robô'}? O sistema preservará o histórico e usará DESISTENTE se já houver atividade competitiva.`,
        'Aprovar cancelamento',
        {
          type: 'warning',
          confirmButtonText: 'Aprovar cancelamento',
          cancelButtonText: 'Voltar'
        }
      )
    } else {
      const result = await ElMessageBox.prompt(
        'Informe a justificativa que ficará registrada para o participante.',
        'Rejeitar cancelamento',
        {
          inputType: 'textarea',
          inputPlaceholder: 'Justificativa da organização',
          inputValidator: (value) => value?.trim() ? true : 'Informe a justificativa da rejeição.',
          confirmButtonText: 'Rejeitar solicitação',
          cancelButtonText: 'Voltar'
        }
      )
      resposta = result.value?.trim() || ''
    }

    cancellationReviewingId.value = request.id
    if (approve) {
      await adminApi.approveCancellationRequest(request.id)
      ElMessage.success('Cancelamento aprovado.')
    } else {
      await adminApi.rejectCancellationRequest(request.id, resposta)
      ElMessage.success('Solicitação de cancelamento rejeitada.')
    }
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível analisar a solicitação de cancelamento.')
  } finally {
    cancellationReviewingId.value = undefined
  }
}

watch(
  () => competition.selectedId,
  (id) => {
    if (!id || competitionId.value === id) return
    competitionId.value = id
    load()
  }
)

onMounted(loadBase)
</script>

<template>
  <div class="page-stack registrations-page">
    <div class="page-heading registrations-heading">
      <div>
        <span class="eyebrow">Entrada da competição</span>
        <h1>Inscrições</h1>
        <p class="muted">Analise, cancele, reative e acompanhe as inscrições sem perder o histórico competitivo.</p>
      </div>
      <div class="heading-actions">
        <el-button :loading="loading" @click="load">Atualizar</el-button>
      </div>
    </div>

    <article v-if="activeCompetition" class="registrations-focus-strip">
      <div>
        <span>{{ competitionContextLabel }}</span>
        <strong>{{ activeCompetition.nome }}</strong>
      </div>
      <StatusBadge :value="activeCompetition.status || 'PLANEJADA'" />
    </article>

    <article v-if="pendingCancellationRequests.length" class="table-card registrations-table-card" v-loading="loading">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Cancelamentos</span>
          <h2>Solicitações pendentes</h2>
        </div>
        <el-tag type="warning" effect="light">{{ pendingCancellationRequests.length }} pendente(s)</el-tag>
      </div>
      <el-table :data="pendingCancellationRequests" empty-text="Nenhuma solicitação pendente">
        <el-table-column label="Equipe / Robô" min-width="190">
          <template #default="{ row }">
            <div class="registration-main-cell"><strong>{{ row.teamNome }}</strong><span>{{ row.robotNome }}</span></div>
          </template>
        </el-table-column>
        <el-table-column prop="motivo" label="Motivo" min-width="260" show-overflow-tooltip />
        <el-table-column label="Solicitado por" min-width="170">
          <template #default="{ row }">
            <div class="registration-request-cell"><strong>{{ row.requestedByUserNome }}</strong><span>{{ formatDateTime(row.dataCadastro) }}</span></div>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="235" fixed="right">
          <template #default="{ row }">
            <div class="registration-actions">
              <el-button size="small" type="success" plain :loading="cancellationReviewingId === row.id" @click="decideCancellation(row, true)">Aprovar</el-button>
              <el-button size="small" type="danger" plain :loading="cancellationReviewingId === row.id" @click="decideCancellation(row, false)">Rejeitar</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <article v-if="cancellationHistory.length" class="table-card registrations-table-card" v-loading="loading">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Auditoria</span>
          <h2>Histórico de cancelamentos</h2>
        </div>
        <small class="muted">Últimas {{ cancellationHistory.length }} decisões desta competição</small>
      </div>

      <el-table :data="cancellationHistory" empty-text="Nenhuma decisão registrada">
        <el-table-column label="Equipe / Robô" min-width="180">
          <template #default="{ row }">
            <div class="registration-main-cell">
              <strong>{{ row.teamNome }}</strong>
              <span>{{ row.robotNome }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Solicitação" min-width="220">
          <template #default="{ row }">
            <div class="registration-request-cell">
              <strong>{{ row.requestedByUserNome }}</strong>
              <span>{{ formatDateTime(row.dataCadastro) }}</span>
              <span>{{ row.motivo }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Decisão" width="135">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="Análise" min-width="210">
          <template #default="{ row }">
            <div class="registration-request-cell">
              <strong>{{ row.reviewedByUserNome || '—' }}</strong>
              <span>{{ formatDateTime(row.reviewedAt) }}</span>
              <span>{{ row.resposta || 'Sem observação adicional' }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <div class="registrations-metrics">
      <button type="button" class="registration-metric" :class="{ active: status === '' }" @click="status = ''">
        <span>Total</span><strong>{{ counts.total }}</strong>
      </button>
      <button type="button" class="registration-metric pending" :class="{ active: status === 'PENDENTE' }" @click="selectStatus('PENDENTE')">
        <span>Pendentes</span><strong>{{ counts.pendente }}</strong>
      </button>
      <button type="button" class="registration-metric approved" :class="{ active: status === 'APROVADA' }" @click="selectStatus('APROVADA')">
        <span>Aprovadas</span><strong>{{ counts.aprovada }}</strong>
      </button>
      <button type="button" class="registration-metric rejected" :class="{ active: status === 'REJEITADA' }" @click="selectStatus('REJEITADA')">
        <span>Rejeitadas</span><strong>{{ counts.rejeitada }}</strong>
      </button>
    </div>

    <article class="registration-filters">
      <div class="registration-filter-main">
        <el-input
          v-model="search"
          clearable
          placeholder="Buscar equipe, robô, categoria ou participante"
        />
        <el-select
          v-if="auth.isDev"
          v-model="competitionId"
          placeholder="Competição"
          @change="load"
        >
          <el-option
            v-for="item in competition.competitions"
            :key="item.id"
            :label="item.nome"
            :value="item.id"
          />
        </el-select>
        <div v-else class="competition-context-static">
          {{ activeCompetition?.nome || 'Nenhuma competição vigente' }}
        </div>
        <el-select v-model="status" placeholder="Status" clearable>
          <el-option label="Todos" value="" />
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <span class="registration-result-count">{{ filtered.length }} resultado(s)</span>
    </article>

    <article class="table-card registrations-table-card" v-loading="loading">
      <el-table :data="filtered" empty-text="Nenhuma inscrição neste filtro" @row-dblclick="openDetails">
        <el-table-column label="Equipe / Robô" min-width="210">
          <template #default="{ row }">
            <div class="registration-main-cell">
              <strong>{{ row.teamNome }}</strong>
              <span>{{ row.robotNome }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
        <el-table-column label="Competidores" min-width="190">
          <template #default="{ row }">
            <span class="registration-competitors">
              {{ row.competitorNomes?.length ? row.competitorNomes.join(', ') : 'Não informado' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Solicitação" min-width="170">
          <template #default="{ row }">
            <div class="registration-request-cell">
              <strong>{{ row.requestedByUserNome || 'Organização' }}</strong>
              <span>{{ formatDateTime(row.dataCadastro) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="145">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="Ações" width="420" fixed="right">
          <template #default="{ row }">
            <div class="registration-actions">
              <el-button size="small" @click="openDetails(row)">Detalhes</el-button>
              <template v-if="row.status === 'PENDENTE'">
                <el-button size="small" type="success" plain :loading="reviewingId === row.id" @click="review(row, 'APROVADA')">Aprovar</el-button>
                <el-button size="small" type="danger" plain :loading="reviewingId === row.id" @click="review(row, 'REJEITADA')">Rejeitar</el-button>
              </template>
              <el-button
                v-if="row.status === 'APROVADA'"
                size="small"
                type="warning"
                plain
                :loading="registrationActionId === row.id"
                @click="disqualifyRegistration(row)"
              >Desclassificar</el-button>
              <el-button
                v-if="['PENDENTE', 'APROVADA'].includes(row.status)"
                size="small"
                type="danger"
                plain
                :loading="registrationActionId === row.id"
                @click="cancelRegistration(row)"
              >Cancelar</el-button>
              <el-button
                v-else-if="['CANCELADA', 'REJEITADA'].includes(row.status)"
                size="small"
                plain
                :loading="registrationActionId === row.id"
                @click="reactivateRegistration(row)"
              >Reativar</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <el-drawer v-model="detailsOpen" size="min(520px, 94vw)" direction="rtl" class="registration-details-drawer">
      <template #header>
        <div v-if="selected" class="registration-drawer-heading">
          <span class="eyebrow">Detalhes da inscrição</span>
          <h2>{{ selected.teamNome }}</h2>
        </div>
      </template>

      <div v-if="selected" class="registration-details">
        <section class="registration-details-hero">
          <div>
            <small>Robô</small>
            <strong>{{ selected.robotNome }}</strong>
            <span>{{ selected.categoryNome }}</span>
          </div>
          <StatusBadge :value="selected.status" />
        </section>

        <section class="registration-details-section">
          <h3>Participação</h3>
          <dl>
            <div><dt>Competição</dt><dd>{{ selected.competitionNome }}</dd></div>
            <div><dt>Equipe</dt><dd>{{ selected.teamNome }}</dd></div>
            <div><dt>Categoria</dt><dd>{{ selected.categoryNome }}</dd></div>
            <div><dt>Robô</dt><dd>{{ selected.robotNome }}</dd></div>
          </dl>
        </section>

        <section class="registration-details-section">
          <h3>Competidores</h3>
          <div v-if="selected.competitorNomes?.length" class="registration-person-list">
            <span v-for="name in selected.competitorNomes" :key="name">{{ name }}</span>
          </div>
          <p v-else class="muted">Nenhum competidor informado.</p>
        </section>

        <section class="registration-details-section">
          <h3>Solicitação e análise</h3>
          <dl>
            <div><dt>Solicitado por</dt><dd>{{ selected.requestedByUserNome || 'Organização' }}</dd></div>
            <div><dt>Enviado em</dt><dd>{{ formatDateTime(selected.dataCadastro) }}</dd></div>
            <div><dt>Revisado por</dt><dd>{{ selected.reviewedByUserNome || '—' }}</dd></div>
            <div><dt>Revisado em</dt><dd>{{ formatDateTime(selected.reviewedAt) }}</dd></div>
            <div v-if="selected.reviewReason"><dt>Motivo da rejeição</dt><dd>{{ selected.reviewReason }}</dd></div>
          </dl>
        </section>

        <section class="registration-details-section" v-loading="statusHistoryLoading">
          <h3>Histórico de status</h3>
          <el-timeline v-if="statusHistory.length" class="registration-status-history">
            <el-timeline-item
              v-for="item in statusHistory"
              :key="item.id"
              :timestamp="formatDateTime(item.dataCadastro)"
              placement="top"
            >
              <div class="registration-status-history-entry">
                <strong>{{ statusHistoryActionLabel(item) }}</strong>
                <div class="registration-status-transition">
                  <StatusBadge v-if="item.previousStatus" :value="item.previousStatus" />
                  <span v-if="item.previousStatus">→</span>
                  <StatusBadge :value="item.newStatus" />
                </div>
                <small>{{ item.actorUserNome || 'Sistema' }}</small>
                <p v-if="item.reason">{{ item.reason }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
          <p v-else-if="!statusHistoryLoading" class="muted">
            Nenhuma transição auditada ainda. A auditoria detalhada passa a ser registrada a partir da V17.
          </p>
        </section>

        <section v-if="selectedCancellationHistory.length" class="registration-details-section">
          <h3>Solicitações de cancelamento</h3>
          <div class="registration-cancellation-audit-list">
            <article
              v-for="request in selectedCancellationHistory"
              :key="request.id"
              class="registration-cancellation-audit-item"
            >
              <div class="registration-cancellation-audit-heading">
                <strong>{{ request.status === 'PENDENTE' ? 'Solicitação pendente' : (request.status === 'APROVADA' ? 'Cancelamento aprovado' : 'Cancelamento rejeitado') }}</strong>
                <StatusBadge :value="request.status" />
              </div>

              <dl>
                <div><dt>Solicitado por</dt><dd>{{ request.requestedByUserNome || '—' }}</dd></div>
                <div><dt>Solicitado em</dt><dd>{{ formatDateTime(request.dataCadastro) }}</dd></div>
                <div><dt>Motivo</dt><dd>{{ request.motivo || '—' }}</dd></div>
                <div v-if="request.status !== 'PENDENTE'"><dt>Analisado por</dt><dd>{{ request.reviewedByUserNome || '—' }}</dd></div>
                <div v-if="request.status !== 'PENDENTE'"><dt>Analisado em</dt><dd>{{ formatDateTime(request.reviewedAt) }}</dd></div>
                <div v-if="request.resposta"><dt>Resposta da organização</dt><dd>{{ request.resposta }}</dd></div>
              </dl>
            </article>
          </div>
          <p class="muted">
            Este histórico registra a solicitação e a decisão de cancelamento. A linha do tempo acima registra as mudanças de status auditadas pela V17.
          </p>
        </section>

        <section class="registration-details-section">
          <h3>Observação</h3>
          <p class="registration-observation">{{ selected.observacao || 'Nenhuma observação enviada.' }}</p>
        </section>

        <div class="registration-review-footer">
          <template v-if="selected.status === 'PENDENTE'">
            <el-button type="danger" plain :loading="reviewingId === selected.id" @click="review(selected, 'REJEITADA')">Rejeitar</el-button>
            <el-button type="success" :loading="reviewingId === selected.id" @click="review(selected, 'APROVADA')">Aprovar inscrição</el-button>
          </template>
          <el-button
            v-if="selected.status === 'APROVADA'"
            type="warning"
            plain
            :loading="registrationActionId === selected.id"
            @click="disqualifyRegistration(selected)"
          >Desclassificar</el-button>
          <el-button
            v-if="['PENDENTE', 'APROVADA'].includes(selected.status)"
            type="danger"
            plain
            :loading="registrationActionId === selected.id"
            @click="cancelRegistration(selected)"
          >Cancelar inscrição</el-button>
          <el-button
            v-else-if="['CANCELADA', 'REJEITADA'].includes(selected.status)"
            :loading="registrationActionId === selected.id"
            @click="reactivateRegistration(selected)"
          >Reativar inscrição</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
