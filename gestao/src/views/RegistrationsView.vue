<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type {
  Category,
  Competitor,
  ParticipantCompetitionRegistration,
  ParticipantCompetitionRegistrationStatus,
  Registration,
  RegistrationCancellationRequest,
  UserAccount,
  RegistrationStatus,
  RegistrationStatusHistory,
  RegistrationCompetitorContext,
  RegistrationCompetitorChange
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const competition = useCompetitionStore()

const loading = ref(false)
const reviewingId = ref<number>()
const registrationActionId = ref<number>()
const cancellationReviewingId = ref<number>()
const rows = ref<Registration[]>([])
const participantRows = ref<ParticipantCompetitionRegistration[]>([])
const participantReviewingId = ref<number>()
const cancellationRequests = ref<RegistrationCancellationRequest[]>([])
const competitionId = ref<number>()
const status = ref<string>('PENDENTE')
const search = ref('')
const detailsOpen = ref(false)
const selected = ref<Registration>()
const statusHistory = ref<RegistrationStatusHistory[]>([])
const statusHistoryLoading = ref(false)
const registrationContext = ref<RegistrationCompetitorContext[]>([])
const registrationContextLoading = ref(false)
const compositionChanges = ref<RegistrationCompetitorChange[]>([])
const compositionReviewingId = ref<number>()
const leaderDialog = ref(false)
const leaderTransferSaving = ref(false)
const leaderRegistration = ref<ParticipantCompetitionRegistration>()
const leaderCandidates = ref<Competitor[]>([])
const leaderTransferForm = reactive({
  newResponsibleUserId: undefined as number | undefined,
  motivo: ''
})

const manualDialog = ref(false)
const manualSaving = ref(false)
const manualUsers = ref<UserAccount[]>([])
const manualCategories = ref<Category[]>([])
const manualForm = reactive({
  participantUserId: undefined as number | undefined,
  categoryId: undefined as number | undefined,
  robotNome: '',
  robotDescricao: '',
  justificativa: ''
})

const manualSelectedCategory = computed(() =>
  manualCategories.value.find((item) => item.id === manualForm.categoryId)
)


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
    DESCLASSIFICACAO: 'Inscrição desclassificada',
    ENTRADA_MANUAL: 'Entrada manual DEV',
    AJUSTE_COMPOSICAO: 'Composição competitiva ajustada'
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

function resetManualEntry() {
  manualForm.participantUserId = undefined
  manualForm.categoryId = undefined
  manualForm.robotNome = ''
  manualForm.robotDescricao = ''
  manualForm.justificativa = ''
}

function selectManualParticipant(userId?: number) {
  const user = manualUsers.value.find((item) => item.id === userId)
  if (!user?.competitorTeamId) {
    ElMessage.warning('Este participante ainda não está associado a uma equipe.')
  }
}

async function openManualEntry() {
  if (!auth.isDev || !competitionId.value) return
  resetManualEntry()
  manualDialog.value = true
  try {
    const [users, categories] = await Promise.all([
      adminApi.users('PARTICIPANTE'),
      adminApi.categories()
    ])
    manualUsers.value = users.filter((item) => item.ativo !== false && item.competitorTeamId)
    manualCategories.value = categories.filter((item) => item.ativo !== false)
  } catch (error: any) {
    manualDialog.value = false
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os dados da entrada manual.')
  }
}

async function saveManualEntry() {
  if (!competitionId.value
      || !manualForm.participantUserId
      || !manualForm.categoryId
      || !manualForm.robotNome.trim()
      || !manualForm.justificativa.trim()) {
    return ElMessage.warning('Informe participante, equipe, categoria, robô e justificativa.')
  }

  manualSaving.value = true
  try {
    const registration = await adminApi.manualCompetitionEntry({
      competitionId: competitionId.value,
      participantUserId: manualForm.participantUserId,
      categoryId: manualForm.categoryId,
      robotNome: manualForm.robotNome.trim(),
      robotDescricao: manualForm.robotDescricao.trim() || undefined,
      justificativa: manualForm.justificativa.trim()
    })

    manualDialog.value = false
    status.value = 'APROVADA'
    await load()

    if (manualSelectedCategory.value?.modalidade === 'SUMO') {
      ElMessage.success(
        `${registration.robotNome} foi cadastrado e inscrito. Faça a inspeção de Sumô e depois gere uma nova chave.`
      )
    } else {
      ElMessage.success(
        `${registration.robotNome} foi cadastrado e já pode ser sincronizado nas próximas chamadas do Follow.`
      )
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível realizar a entrada manual.')
  } finally {
    manualSaving.value = false
  }
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
    participantRows.value = []
    compositionChanges.value = []
    cancellationRequests.value = []
    return
  }

  loading.value = true
  try {
    const [registrationRows, participantRegistrationRows, compositionRows, cancellationRows] = await Promise.all([
      adminApi.registrations({ competitionId: competitionId.value }),
      adminApi.participantRegistrations(competitionId.value),
      adminApi.compositionChanges(competitionId.value),
      adminApi.cancellationRequests({
        competitionId: competitionId.value
      })
    ])
    rows.value = registrationRows
    participantRows.value = participantRegistrationRows
    compositionChanges.value = compositionRows
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
  registrationContext.value = []
  statusHistoryLoading.value = true
  registrationContextLoading.value = true

  try {
    const [history, context] = await Promise.all([
      adminApi.registrationStatusHistory(row.id),
      adminApi.registrationCompetitorContext(row.id)
    ])
    statusHistory.value = history
    registrationContext.value = context
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar o histórico da inscrição.')
  } finally {
    statusHistoryLoading.value = false
    registrationContextLoading.value = false
  }
}

async function openBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

async function openParticipantReceipt(row: ParticipantCompetitionRegistration) {
  try {
    await openBlob(await adminApi.participantRegistrationReceipt(row.id))
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível abrir o comprovante do participante.')
  }
}

async function openRobotReceipt(row: Registration) {
  try {
    await openBlob(await adminApi.robotRegistrationReceipt(row.id))
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível abrir o comprovante do robô.')
  }
}

async function reviewParticipant(
  row: ParticipantCompetitionRegistration,
  next: ParticipantCompetitionRegistrationStatus
) {
  const approving = next === 'APROVADA'
  const correction = next === 'CORRECAO_SOLICITADA'
  let motivo: string | undefined

  try {
    if (approving) {
      await ElMessageBox.confirm(
        `Aprovar a inscrição de ${row.competitorNome}? Os robôs associados aparecem nesta linha para conferência.`,
        'Aprovar participante',
        {
          type: 'success',
          confirmButtonText: 'Aprovar participante',
          cancelButtonText: 'Cancelar'
        }
      )
    } else {
      if (next === 'REJEITADA' && row.teamLeader) {
        ElMessage.warning(
          'Este participante é o líder da equipe. Solicite correção ou, como DEV, transfira a liderança antes de rejeitar definitivamente.'
        )
        return
      }

      const result = await ElMessageBox.prompt(
        correction
          ? 'Informe o que precisa ser corrigido. O participante poderá reenviar o comprovante sem perder a equipe.'
          : 'Informe o motivo da rejeição definitiva da inscrição individual.',
        correction
          ? `Solicitar correção · ${row.competitorNome}`
          : `Rejeitar participante · ${row.competitorNome}`,
        {
          inputType: 'textarea',
          inputValidator: (value) => value?.trim() ? true : 'Informe a justificativa.',
          confirmButtonText: correction ? 'Solicitar correção' : 'Rejeitar',
          cancelButtonText: 'Cancelar'
        }
      )
      motivo = result.value?.trim()
    }

    participantReviewingId.value = row.id
    await adminApi.reviewParticipantRegistration(row.id, next, motivo)
    ElMessage.success(
      approving
        ? 'Participante aprovado.'
        : correction
          ? 'Correção solicitada ao participante.'
          : 'Inscrição individual rejeitada.'
    )
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível analisar a inscrição individual.')
  } finally {
    participantReviewingId.value = undefined
  }
}

async function openLeaderTransfer(row: ParticipantCompetitionRegistration) {
  if (!auth.isDev || !competitionId.value) return
  leaderRegistration.value = row
  leaderTransferForm.newResponsibleUserId = undefined
  leaderTransferForm.motivo = ''
  try {
    leaderCandidates.value = (await adminApi.teamLeaderCandidates(row.teamId, competitionId.value))
      .filter((item) => item.userAccountId && item.userAccountId !== row.requestedByUserId)
    leaderDialog.value = true
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar candidatos à liderança.')
  }
}

async function transferLeader() {
  if (!competitionId.value
      || !leaderRegistration.value
      || !leaderTransferForm.newResponsibleUserId
      || !leaderTransferForm.motivo.trim()) {
    return ElMessage.warning('Selecione o novo líder e informe a justificativa.')
  }

  const candidate = leaderCandidates.value.find(
    (item) => item.userAccountId === leaderTransferForm.newResponsibleUserId
  )
  if (!candidate?.userAccountId) return

  leaderTransferSaving.value = true
  try {
    await adminApi.transferTeamLeader(leaderRegistration.value.teamId, {
      competitionId: competitionId.value,
      newResponsibleUserId: candidate.userAccountId,
      motivo: leaderTransferForm.motivo.trim()
    })
    ElMessage.success('Liderança transferida e auditada. A rejeição do líder anterior agora pode ser analisada.')
    leaderDialog.value = false
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível transferir a liderança.')
  } finally {
    leaderTransferSaving.value = false
  }
}

async function reviewCompositionChange(change: RegistrationCompetitorChange, keep: boolean) {
  try {
    let motivo: string | undefined
    if (!keep) {
      const result = await ElMessageBox.prompt(
        'Informe por que esta alteração de associação não deve valer nesta competição.',
        `Vetar alteração · ${change.robotNome} / ${change.competitorNome}`,
        {
          inputType: 'textarea',
          inputValidator: (value) => value?.trim() ? true : 'Informe a justificativa do veto.',
          confirmButtonText: 'Vetar alteração',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      )
      motivo = result.value?.trim()
    } else {
      await ElMessageBox.confirm(
        `Manter a alteração de ${change.competitorNome} no robô ${change.robotNome}?`,
        'Confirmar alteração',
        {
          confirmButtonText: 'Manter',
          cancelButtonText: 'Cancelar',
          type: 'info'
        }
      )
    }

    compositionReviewingId.value = change.id
    await adminApi.reviewCompositionChange(
      change.id,
      keep ? 'MANTIDA' : 'VETADA',
      motivo
    )
    ElMessage.success(keep ? 'Alteração mantida.' : 'Alteração vetada nesta competição.')
    await load()
    if (selected.value?.id === change.registrationId) {
      await openDetails(selected.value)
    }
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível revisar a alteração.')
  } finally {
    compositionReviewingId.value = undefined
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
      const context = await adminApi.registrationCompetitorContext(row.id)
      const eligible = context.filter(
        (item) => item.robotResponsible && item.participantRegistrationStatus === 'APROVADA'
      )
      if (!row.comprovanteDisponivel) {
        ElMessage.warning('Esta inscrição de robô ainda não possui comprovante de pagamento.')
        return
      }
      if (!eligible.length) {
        ElMessage.warning(
          'Ainda não é possível aprovar este robô. É necessário pelo menos um responsável com inscrição individual APROVADA.'
        )
        return
      }

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
        <el-button v-if="auth.isDev" class="brand-button" @click="openManualEntry">Adicionar robô avulso</el-button>
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

    <article v-if="compositionChanges.length" class="table-card registrations-table-card composition-review-card" v-loading="loading">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Composição competitiva</span>
          <h2>Alterações de responsáveis</h2>
        </div>
        <el-tag type="warning" effect="light">{{ compositionChanges.length }} alteração(ões)</el-tag>
      </div>
      <p class="muted">
        Antes do início da competição, a composição é sincronizada automaticamente. A organização é avisada e pode manter ou vetar a mudança específica.
      </p>
      <el-table :data="compositionChanges" empty-text="Nenhuma alteração pendente">
        <el-table-column label="Robô" min-width="150" prop="robotNome" />
        <el-table-column label="Competidor" min-width="170" prop="competitorNome" />
        <el-table-column label="Mudança" width="125">
          <template #default="{ row }">
            <el-tag :type="row.changeType === 'ADICIONADO' ? 'success' : 'warning'" effect="light">
              {{ row.changeType === 'ADICIONADO' ? 'Adicionado' : 'Removido' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Responsável pela alteração" min-width="170">
          <template #default="{ row }">
            <div class="registration-request-cell">
              <strong>{{ row.actorUserNome || 'Sistema' }}</strong>
              <span>{{ formatDateTime(row.dataCadastro) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="220" fixed="right">
          <template #default="{ row }">
            <div class="registration-actions">
              <el-button
                size="small"
                type="success"
                plain
                :loading="compositionReviewingId === row.id"
                @click="reviewCompositionChange(row, true)"
              >Manter</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                :loading="compositionReviewingId === row.id"
                @click="reviewCompositionChange(row, false)"
              >Vetar</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
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

    <article class="table-card registrations-table-card participant-approval-card" v-loading="loading">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Pagamento e habilitação pessoal</span>
          <h2>Inscrições dos participantes</h2>
        </div>
        <el-tag type="warning" effect="light">
          {{ participantRows.filter((item) => item.status === 'PENDENTE').length }} pendente(s)
        </el-tag>
      </div>

      <el-table :data="participantRows" empty-text="Nenhuma inscrição pessoal nesta competição">
        <el-table-column label="Competidor / Equipe" min-width="190">
          <template #default="{ row }">
            <div class="registration-main-cell">
              <strong>{{ row.competitorNome }}</strong>
              <span>{{ row.teamNome }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Robôs associados" min-width="260">
          <template #default="{ row }">
            <div v-if="row.robots?.length" class="participant-linked-robots">
              <span v-for="robot in row.robots" :key="`${robot.robotId}-${robot.registrationId || 0}-${robot.categoryId || 0}`">
                <b>{{ robot.robotNome }}</b>
                <small v-if="robot.categoryNome">{{ robot.categoryNome }} · {{ robot.registrationStatus }}</small>
                <small v-else>Sem inscrição de robô nesta competição</small>
              </span>
            </div>
            <span v-else class="muted">Nenhum robô associado</span>
          </template>
        </el-table-column>
        <el-table-column label="Comprovante" width="145">
          <template #default="{ row }">
            <el-button
              v-if="row.comprovanteDisponivel"
              size="small"
              plain
              @click="openParticipantReceipt(row)"
            >Abrir</el-button>
            <span v-else class="muted">Não enviado</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="135">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="Ações" min-width="330" fixed="right">
          <template #default="{ row }">
            <div v-if="row.status === 'PENDENTE'" class="registration-actions participant-review-actions">
              <el-button
                size="small"
                type="success"
                plain
                :loading="participantReviewingId === row.id"
                @click="reviewParticipant(row, 'APROVADA')"
              >Aprovar</el-button>
              <el-button
                size="small"
                type="warning"
                plain
                :loading="participantReviewingId === row.id"
                @click="reviewParticipant(row, 'CORRECAO_SOLICITADA')"
              >Solicitar correção</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                :disabled="row.teamLeader"
                :loading="participantReviewingId === row.id"
                @click="reviewParticipant(row, 'REJEITADA')"
              >Rejeitar</el-button>
              <el-button
                v-if="row.teamLeader && auth.isDev"
                size="small"
                plain
                @click="openLeaderTransfer(row)"
              >Trocar líder</el-button>
            </div>
            <div v-else class="registration-request-cell">
              <StatusBadge :value="row.status" />
              <span v-if="row.reviewReason">{{ row.reviewReason }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

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
        <el-table-column label="Comprovante" width="125">
          <template #default="{ row }">
            <el-button v-if="row.comprovanteDisponivel" size="small" plain @click="openRobotReceipt(row)">Abrir</el-button>
            <span v-else class="muted">—</span>
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

    <el-dialog
      v-model="leaderDialog"
      title="Transferir liderança da equipe"
      width="min(620px, 94vw)"
    >
      <div class="registration-flow-dialog">
        <div class="participant-flow-note">
          <strong>Proteção da liderança</strong>
          <span>
            A inscrição do líder atual não pode ser rejeitada definitivamente sem resolver a liderança.
            Selecione outro participante da mesma equipe com inscrição individual PENDENTE ou APROVADA.
          </span>
        </div>
        <label>Novo líder
          <el-select v-model="leaderTransferForm.newResponsibleUserId" filterable style="width:100%" placeholder="Selecione">
            <el-option
              v-for="candidate in leaderCandidates"
              :key="candidate.id"
              :label="`${candidate.nome} · ${candidate.email || ''}`"
              :value="candidate.userAccountId"
            />
          </el-select>
        </label>
        <label>Justificativa
          <el-input
            v-model="leaderTransferForm.motivo"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
          />
        </label>
      </div>
      <template #footer>
        <el-button @click="leaderDialog = false">Cancelar</el-button>
        <el-button
          class="brand-button"
          :loading="leaderTransferSaving"
          @click="transferLeader"
        >Transferir liderança</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="manualDialog"
      title="Entrada manual de participante e robô"
      width="min(680px, 94vw)"
      @closed="resetManualEntry"
    >
      <div class="manual-entry-form">
        <div class="manual-entry-note">
          <strong>Fluxo excepcional DEV</strong>
          <span>O participante deve criar a própria conta primeiro. Depois o DEV associa a conta a uma equipe/competidor, cria o robô e registra a inscrição já aprovada.</span>
        </div>

        <label>Conta do participante
          <el-select
            v-model="manualForm.participantUserId"
            filterable
            placeholder="Selecione a conta PARTICIPANTE"
            style="width:100%"
            @change="selectManualParticipant"
          >
            <el-option
              v-for="item in manualUsers"
              :key="item.id"
              :value="item.id"
              :label="`${item.nome} · ${item.email}${item.competitorTeamNome ? ' · ' + item.competitorTeamNome : ''}`"
            />
          </el-select>
        </label>

        <div v-if="manualForm.participantUserId" class="manual-entry-team-readonly">
          <span>Equipe do participante</span>
          <strong>{{ manualUsers.find((item) => item.id === manualForm.participantUserId)?.competitorTeamNome || '—' }}</strong>
          <small>Definida automaticamente pelo vínculo do participante com a equipe.</small>
        </div>

        <label>Categoria
          <el-select v-model="manualForm.categoryId" filterable placeholder="Categoria da inscrição" style="width:100%">
            <el-option
              v-for="item in manualCategories"
              :key="item.id"
              :value="item.id"
              :label="`${item.nome} · ${item.modalidade === 'SUMO' ? 'Sumô' : 'Follow Line'}`"
            />
          </el-select>
        </label>

        <label>Nome do robô
          <el-input v-model="manualForm.robotNome" maxlength="120" />
        </label>

        <label class="span-2">Descrição do robô <small class="muted">(opcional)</small>
          <el-input v-model="manualForm.robotDescricao" type="textarea" :rows="2" maxlength="500" />
        </label>

        <label class="span-2">Justificativa da entrada manual
          <el-input
            v-model="manualForm.justificativa"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="Ex.: inclusão excepcional autorizada pela organização após encerramento das inscrições."
          />
        </label>

        <div v-if="manualSelectedCategory?.modalidade === 'SUMO'" class="manual-entry-warning span-2">
          <strong>Sumô</strong>
          <span>A inscrição será aprovada, mas o robô ainda precisa passar pela inspeção antes de entrar em uma nova chave.</span>
        </div>
        <div v-else-if="manualSelectedCategory?.modalidade === 'FOLLOW_LINE'" class="manual-entry-warning span-2">
          <strong>Follow Line</strong>
          <span>Após o cadastro, sincronize a fila das próximas tomadas para incluir o novo robô.</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="manualDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="manualSaving" @click="saveManualEntry">Criar e inscrever</el-button>
      </template>
    </el-dialog>

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

        <section class="registration-details-section" v-loading="registrationContextLoading">
          <div class="registration-detail-heading-row">
            <h3>Competidores e elegibilidade</h3>
            <el-button
              v-if="selected.comprovanteDisponivel"
              size="small"
              plain
              @click="openRobotReceipt(selected)"
            >Ver comprovante do robô</el-button>
          </div>
          <div v-if="registrationContext.length" class="registration-eligibility-list">
            <article v-for="item in registrationContext" :key="item.competitorId">
              <strong>{{ item.competitorNome }}</strong>
              <span :class="{ ok: item.robotResponsible, pending: !item.robotResponsible && item.officialCompetitor, bad: !item.robotResponsible && !item.officialCompetitor }">
                {{
                  item.robotResponsible
                    ? 'Responsável permanente pelo robô'
                    : item.officialCompetitor
                      ? 'Mantido na composição desta competição'
                      : 'Não associado ao robô'
                }}
              </span>
              <span :class="{ ok: item.officialCompetitor, pending: !item.officialCompetitor }">
                {{ item.officialCompetitor ? 'Na composição oficial desta inscrição' : 'Fora da composição oficial' }}
              </span>
              <span
                :class="{
                  ok: item.participantRegistrationStatus === 'APROVADA',
                  pending: item.participantRegistrationStatus === 'PENDENTE',
                  bad: !item.participantRegistrationStatus || item.participantRegistrationStatus === 'REJEITADA'
                }"
              >
                Inscrição pessoal: {{ item.participantRegistrationStatus || 'NÃO ENVIADA' }}
              </span>
            </article>
          </div>
          <p v-else-if="!registrationContextLoading" class="muted">Nenhum competidor informado.</p>
          <el-alert
            v-if="selected.status === 'PENDENTE' && !registrationContext.some((item) => item.robotResponsible && item.participantRegistrationStatus === 'APROVADA')"
            type="warning"
            :closable="false"
            title="Este robô ainda precisa de pelo menos um responsável com inscrição individual APROVADA."
          />
          <el-alert
            v-else-if="registrationContext.some((item) => item.robotResponsible && item.participantRegistrationStatus === 'PENDENTE')"
            type="info"
            :closable="false"
            title="Há responsáveis ainda PENDENTES. Eles não bloqueiam o robô; entram automaticamente na composição se forem aprovados antes do início da competição."
          />
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

<style scoped>
.composition-review-card > .muted { margin:0 0 12px; }
.participant-review-actions { flex-wrap:wrap; }

.participant-linked-robots { display:grid; gap:5px; }
.participant-linked-robots > span { display:grid; gap:1px; padding:5px 0; }
.participant-linked-robots b { color:#4e3a44; font-size:12px; }
.participant-linked-robots small { color:#81737a; font-size:10px; }
.registration-detail-heading-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.registration-eligibility-list { display:grid; gap:8px; }
.registration-eligibility-list article { display:grid; gap:4px; padding:10px 12px; border:1px solid #eadde3; border-radius:10px; }
.registration-eligibility-list span { font-size:11px; color:#776970; }
.registration-eligibility-list .ok { color:#28734d; font-weight:700; }
.registration-eligibility-list .pending { color:#8d671d; font-weight:700; }
.registration-eligibility-list .bad { color:#a32745; font-weight:700; }

.manual-entry-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.manual-entry-form label { display:grid; gap:6px; color:#4e3d45; font-size:12px; font-weight:800; }
.manual-entry-form .span-2 { grid-column:1 / -1; }
.manual-entry-note,.manual-entry-warning { display:grid; gap:4px; padding:12px 14px; border-radius:12px; background:#fbf6f8; border:1px solid #ecdce3; }
.manual-entry-note { grid-column:1 / -1; }
.manual-entry-team-readonly { display:grid; gap:3px; padding:10px 12px; border-radius:10px; background:#faf7f8; border:1px solid #eadfe3; }
.manual-entry-team-readonly span { color:#806d75; font-size:11px; font-weight:800; }
.manual-entry-team-readonly strong { color:#382a31; font-size:14px; }
.manual-entry-team-readonly small { color:#7d6d74; line-height:1.35; }
.manual-entry-note span,.manual-entry-warning span { color:#75656c; font-size:12px; line-height:1.45; }
@media (max-width:760px) {
  .manual-entry-form { grid-template-columns:1fr; }
  .manual-entry-form .span-2 { grid-column:auto; }
}
</style>
