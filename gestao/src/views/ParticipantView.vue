<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { assetUrl, http, participantApi, publicApi } from '../api'
import { useAuthStore } from '../store'
import type {
  Category,
  Competition,
  Competitor,
  ConfigFollow,
  FollowAttempt,
  Match,
  MatchResult,
  ParticipantCompetitionRegistration,
  RankingItem,
  Registration,
  Robot,
  RobotImage,
  RobotResponsible,
  Team,
  TeamMembershipRequest
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'
import TournamentBracket from '../components/TournamentBracket.vue'

interface PublicTeamOption {
  id: number
  nome: string
  institutionId: number
  institutionNome: string
  institutionSigla?: string
}

interface FollowOverview {
  attempts: FollowAttempt[]
  config?: ConfigFollow
  ranking?: RankingItem
}

interface SumoOverview {
  wins: number
  losses: number
  lastMatch?: Match
  lastResult?: MatchResult
  nextMatch?: Match
  bracketId?: number
  bracketName?: string
  matches?: Match[]
  results?: MatchResult[]
  statusLabel?: string
  placement?: 'CAMPEAO' | 'VICE' | 'TERCEIRO' | 'ELIMINADO' | 'EM_DISPUTA' | 'INSCRITO'
}

const auth = useAuthStore()
const loading = ref(false)
const creatingTeam = ref(false)
const uploadRobotId = ref<number>()
const uploadingTeamLogo = ref(false)
const registrationActionId = ref<number>()
const loadingAvailableTeams = ref(false)
const teamDialog = ref(false)
const joinDialog = ref(false)
const robotDialog = ref(false)
const creatingRobot = ref(false)
const robotEditingId = ref<number>()
const removingRobotId = ref<number>()
const registrationDialog = ref(false)
const creatingRegistration = ref(false)
const personalRegistrationDialog = ref(false)
const creatingPersonalRegistration = ref(false)
const personalRegistrationReceipt = ref<File>()
const robotRegistrationReceipt = ref<File>()
const responsibleDialog = ref(false)
const responsibleSaving = ref(false)
const responsibleRobot = ref<Robot>()
const responsibleSelection = ref<number[]>([])
const inviteDialog = ref(false)
const invitingMember = ref(false)
const membershipActionId = ref<number>()
const teams = ref<Team[]>([])
const teamId = ref<number>()
const competitors = ref<Competitor[]>([])
const robots = ref<Robot[]>([])
const registrations = ref<Registration[]>([])
const personalRegistrations = ref<ParticipantCompetitionRegistration[]>([])
const competitions = ref<Competition[]>([])
const categories = ref<Category[]>([])
const cancellationPendingIds = ref<Set<number>>(new Set())
const institutions = ref<Array<{ id: number; nome: string; sigla?: string }>>([])
const availableTeams = ref<PublicTeamOption[]>([])
const teamSearch = ref('')
const selectedJoinTeamId = ref<number>()
const myMemberships = ref<TeamMembershipRequest[]>([])
const teamMemberships = ref<TeamMembershipRequest[]>([])
const teamForm = reactive({
  nome: '',
  institutionMode: 'existing' as 'existing' | 'new',
  institutionId: undefined as number | undefined,
  institutionNome: '',
  institutionSigla: '',
  institutionCidade: '',
  institutionEstado: ''
})
const robotForm = reactive({ nome: '', descricao: '' })
const registrationForm = reactive({
  competitionId: undefined as number | undefined,
  categoryId: undefined as number | undefined,
  robotId: undefined as number | undefined,
  competitorIds: [] as number[],
  robotDescricao: '',
  observacao: ''
})
const personalRegistrationForm = reactive({
  competitionId: undefined as number | undefined,
  observacao: ''
})
const inviteForm = reactive({ email: '', mensagem: '' })
const photoMap = ref<Record<number, RobotImage[]>>({})
const responsibleMap = ref<Record<number, RobotResponsible[]>>({})
const followMap = ref<Record<number, FollowOverview>>({})
const sumoMap = ref<Record<number, SumoOverview>>({})
const participantBracketDialog = ref(false)
const participantBracketRegistrationId = ref<number>()

const activeTeam = computed(() => teams.value.find((item) => item.id === teamId.value))
const isTeamLeader = computed(() =>
  Boolean(activeTeam.value?.responsibleUserId && activeTeam.value.responsibleUserId === auth.user?.id)
)
const approvedRegistrations = computed(() => registrations.value.filter((item) => item.status === 'APROVADA'))
const pendingRegistrations = computed(() => registrations.value.filter((item) => item.status === 'PENDENTE'))
const pendingInvites = computed(() =>
  myMemberships.value.filter((item) => item.requestType === 'CONVITE' && item.status === 'PENDENTE')
)
const pendingJoinRequests = computed(() =>
  teamMemberships.value.filter((item) => item.requestType === 'SOLICITACAO' && item.status === 'PENDENTE')
)
const pendingJoinTeamIds = computed(() =>
  new Set(
    myMemberships.value
      .filter((item) => item.requestType === 'SOLICITACAO' && item.status === 'PENDENTE')
      .map((item) => item.teamId)
  )
)
const registrableRobots = computed(() =>
  isTeamLeader.value
    ? robots.value.filter((robot) => robot.ativo !== false)
    : robots.value.filter((robot) =>
        robot.ativo !== false && robot.createdByUserId === auth.user?.id
      )
)
const availableCompetitions = computed(() => {
  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')

  return competitions.value.filter((competition) =>
    competition.id != null
      && competition.ativo !== false
      && competition.status === 'INSCRICOES_ABERTAS'
      && competition.inicioInscricoes <= today
      && competition.fimInscricoes >= today
  )
})
const selectedParticipantBracket = computed(() =>
  participantBracketRegistrationId.value
    ? sumoMap.value[participantBracketRegistrationId.value]
    : undefined
)

const selectedParticipantBracketRegistration = computed(() =>
  participantBracketRegistrationId.value
    ? approvedRegistrations.value.find((item) => item.id === participantBracketRegistrationId.value)
    : undefined
)

const availablePersonalRegistrationCompetitions = computed(() => {
  const registeredCompetitionIds = new Set(
    personalRegistrations.value.map((item) => item.competitionId)
  )
  return availableCompetitions.value.filter(
    (item) => item.id != null && !registeredCompetitionIds.has(item.id)
  )
})

const availableRobotRegistrationCompetitions = computed(() => {
  const initiatedCompetitionIds = new Set(
    personalRegistrations.value
      .filter((item) => ['PENDENTE', 'APROVADA'].includes(item.status))
      .map((item) => item.competitionId)
  )
  return availableCompetitions.value.filter(
    (item) => item.id != null && initiatedCompetitionIds.has(item.id)
  )
})

const robotRegistrationUnlockMessage = computed(() => {
  if (!availableCompetitions.value.length) {
    return 'Não há competição com inscrições abertas neste momento.'
  }
  if (!availableRobotRegistrationCompetitions.value.length) {
    return 'Faça sua inscrição acima para liberar a inscrição dos robôs. Não é necessário esperar a aprovação da Gestão.'
  }
  return 'Inscreva um robô em uma categoria e acompanhe a aprovação dele.'
})

const availableRegistrationCategories = computed(() => {
  if (!registrationForm.competitionId || !registrationForm.robotId) return []

  const sameRobotRegistrations = registrations.value.filter((registration) =>
    registration.competitionId === registrationForm.competitionId
      && registration.robotId === registrationForm.robotId
  )
  const duplicateCategoryIds = new Set(sameRobotRegistrations.map((registration) => registration.categoryId))
  const categoryById = new Map(categories.value.map((category) => [category.id, category]))
  const committedSumoCategories = sameRobotRegistrations
    .filter((registration) => ['PENDENTE', 'APROVADA'].includes(registration.status))
    .map((registration) => categoryById.get(registration.categoryId))
    .filter((category): category is Category => Boolean(category?.modalidade === 'SUMO'))

  const hasUnclassifiedSumo = committedSumoCategories.some((category) => !category.sumoPhysicalClass)
  const committedSumoClasses = new Set(
    committedSumoCategories
      .map((category) => category.sumoPhysicalClass)
      .filter((value): value is NonNullable<Category['sumoPhysicalClass']> => Boolean(value))
  )

  return categories.value.filter((category) => {
    if (category.ativo === false || duplicateCategoryIds.has(category.id)) return false
    if (category.modalidade !== 'SUMO') return true
    if (hasUnclassifiedSumo) return false
    return committedSumoClasses.size === 0 || Boolean(category.sumoPhysicalClass && committedSumoClasses.has(category.sumoPhysicalClass))
  })
})
const filteredAvailableTeams = computed(() => {
  const query = teamSearch.value.trim().toLocaleLowerCase('pt-BR')
  if (!query) return availableTeams.value
  return availableTeams.value.filter((team) =>
    `${team.nome} ${team.institutionNome} ${team.institutionSigla || ''}`.toLocaleLowerCase('pt-BR').includes(query)
  )
})

function principalPhoto(robotId: number) {
  const photos = photoMap.value[robotId] || []
  return photos.find((item) => item.principal) || photos[0]
}

function robotInitials(name?: string) {
  return (name || 'RB').split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase()
}

function formatSeconds(value?: number) {
  return value == null ? '—' : `${Number(value).toFixed(3)} s`
}

function followTakeGroups(registrationId: number) {
  const overview = followMap.value[registrationId]
  if (!overview?.config) return []
  return Array.from({ length: overview.config.numeroTomadas }, (_, index) => {
    const tomada = index + 1
    const attempts = overview.attempts.filter((item) => item.tomada === tomada)
    const valid = attempts.filter((item) => item.valida && item.concluida && item.tempoFinalSegundos != null)
    const best = [...valid].sort((a, b) => Number(a.tempoFinalSegundos) - Number(b.tempoFinalSegundos))[0]
    return {
      tomada,
      attempts,
      best,
      filled: attempts.length >= overview.config!.tentativasPorTomada
    }
  })
}

function completedTakes(registrationId: number) {
  return followTakeGroups(registrationId).filter((item) => item.filled).length
}

async function loadTeams() {
  loading.value = true
  try {
    const [teamRows, institutionRows, membershipRows, competitionRows, categoryRows, personalRows] = await Promise.all([
      participantApi.teams(),
      participantApi.institutions(),
      participantApi.myTeamMemberships(),
      publicApi.competitions(),
      publicApi.categories(),
      participantApi.personalRegistrations().catch(() => [])
    ])
    teams.value = teamRows
    institutions.value = institutionRows
    myMemberships.value = membershipRows
    competitions.value = competitionRows
    categories.value = categoryRows
    personalRegistrations.value = personalRows
    if (!teamId.value || !teams.value.some((item) => item.id === teamId.value)) teamId.value = teams.value[0]?.id
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar o portal do participante.')
  } finally {
    loading.value = false
  }
}

async function loadTeam() {
  competitors.value = []
  robots.value = []
  registrations.value = []
  cancellationPendingIds.value = new Set()
  photoMap.value = {}
  responsibleMap.value = {}
  followMap.value = {}
  sumoMap.value = {}
  if (!teamId.value) return

  loading.value = true
  try {
    ;[competitors.value, robots.value, registrations.value] = await Promise.all([
      participantApi.competitors(teamId.value),
      participantApi.robots(teamId.value),
      participantApi.registrations(teamId.value)
    ])

    teamMemberships.value = isTeamLeader.value
      ? await participantApi.teamMemberships(teamId.value)
      : []

    const [photoEntries, responsibleEntries] = await Promise.all([
      Promise.all(
        robots.value.map(async (robot) => [robot.id, await participantApi.robotPhotos(robot.id).catch(() => [])] as const)
      ),
      Promise.all(
        robots.value.map(async (robot) => [robot.id, await participantApi.robotResponsibles(robot.id).catch(() => [])] as const)
      )
    ])
    photoMap.value = Object.fromEntries(photoEntries)
    responsibleMap.value = Object.fromEntries(responsibleEntries)

    const cancellationEntries = await Promise.all(
      approvedRegistrations.value
        .filter(canManageRegistration)
        .map(async (registration) => [
          registration.id,
          await participantApi.registrationCancellationRequests(registration.id).catch(() => [])
        ] as const)
    )
    cancellationPendingIds.value = new Set(
      cancellationEntries
        .filter(([, requests]) => requests.some((request) => request.status === 'PENDENTE'))
        .map(([registrationId]) => registrationId)
    )

    await Promise.all(approvedRegistrations.value.map(loadRegistrationOverview))
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os dados da equipe.')
  } finally {
    loading.value = false
  }
}

async function loadRegistrationOverview(registration: Registration) {
  if (registration.categoryNome.toLocaleLowerCase('pt-BR').includes('seguidor') || registration.categoryNome.toLocaleLowerCase('pt-BR').includes('follow')) {
    const [attempts, config, ranking] = await Promise.all([
      participantApi.followAttempts(registration.id).catch(() => []),
      participantApi.followConfig(registration.id).catch(() => undefined),
      publicApi.rankingFollow(registration.competitionId, registration.categoryId).catch(() => [])
    ])
    followMap.value = {
      ...followMap.value,
      [registration.id]: {
        attempts,
        config,
        ranking: ranking.find((item) => item.registrationId === registration.id)
      }
    }
    return
  }

  const brackets = await publicApi.brackets(registration.competitionId).catch(() => [])
  const bracket = brackets.find((item) => item.categoryId === registration.categoryId)
  if (!bracket) {
    sumoMap.value = { ...sumoMap.value, [registration.id]: { wins: 0, losses: 0 } }
    return
  }

  const [matches, results] = await Promise.all([
    publicApi.matches(bracket.id).catch(() => []),
    publicApi.results(bracket.id).catch(() => [])
  ])
  const ownMatches = matches.filter((match) =>
    match.registrationAId === registration.id || match.registrationBId === registration.id
  )
  const ownResults = results.filter((result) => ownMatches.some((match) => match.id === result.matchId))
  const wins = ownResults.filter((result) => result.winnerRegistrationId === registration.id).length
  const losses = ownResults.filter((result) => result.winnerRegistrationId && result.winnerRegistrationId !== registration.id).length
  const ordered = [...ownMatches].sort((a, b) => a.rodada - b.rodada || a.ordem - b.ordem)
  const nextMatch = ordered.find((match) =>
    !['FINALIZADA', 'CANCELADA', 'BYE'].includes(match.status || '')
      && Boolean(match.registrationAId)
      && Boolean(match.registrationBId)
  )
  const completed = ordered.filter((match) => match.status === 'FINALIZADA')
  const lastMatch = completed.at(-1)
  const lastResult = lastMatch ? ownResults.find((result) => result.matchId === lastMatch.id) : undefined

  const eliminationMatches = matches.filter((match) => match.tipoPartida !== 'TERCEIRO_LUGAR')
  const finalMatch = [...eliminationMatches].sort((a, b) => b.rodada - a.rodada || a.ordem - b.ordem)[0]
  const finalResult = finalMatch ? results.find((result) => result.matchId === finalMatch.id) : undefined
  const thirdMatch = matches.find((match) => match.tipoPartida === 'TERCEIRO_LUGAR')
  const thirdResult = thirdMatch ? results.find((result) => result.matchId === thirdMatch.id) : undefined

  let placement: SumoOverview['placement'] = 'INSCRITO'
  let statusLabel = 'Inscrito'

  if (finalMatch && finalResult?.winnerRegistrationId === registration.id) {
    placement = 'CAMPEAO'
    statusLabel = 'CAMPEÃO'
  } else if (
    finalMatch
      && finalResult
      && [finalMatch.registrationAId, finalMatch.registrationBId].includes(registration.id)
  ) {
    placement = 'VICE'
    statusLabel = 'VICE-CAMPEÃO'
  } else if (thirdMatch && thirdResult?.winnerRegistrationId === registration.id) {
    placement = 'TERCEIRO'
    statusLabel = '3º LUGAR'
  } else if (
    thirdMatch
      && thirdResult
      && [thirdMatch.registrationAId, thirdMatch.registrationBId].includes(registration.id)
  ) {
    placement = 'ELIMINADO'
    statusLabel = 'Eliminado'
  } else if (nextMatch) {
    placement = 'EM_DISPUTA'
    statusLabel = 'Na chave'
  } else if (losses > 0) {
    placement = 'ELIMINADO'
    statusLabel = 'Eliminado'
  }

  sumoMap.value = {
    ...sumoMap.value,
    [registration.id]: {
      wins,
      losses,
      nextMatch,
      lastMatch,
      lastResult,
      bracketId: bracket.id,
      bracketName: bracket.nome,
      matches,
      results,
      placement,
      statusLabel
    }
  }
}

function openParticipantBracket(registration: Registration) {
  const overview = sumoMap.value[registration.id]
  if (!overview?.bracketId || !overview.matches?.length) {
    return ElMessage.info('A chave desta categoria ainda não foi publicada.')
  }

  participantBracketRegistrationId.value = registration.id
  participantBracketDialog.value = true
}

async function createTeam() {
  if (!teamForm.nome.trim()) {
    return ElMessage.warning('Informe o nome da equipe.')
  }

  if (teamForm.institutionMode === 'existing' && !teamForm.institutionId) {
    return ElMessage.warning('Selecione a instituição ou cadastre uma nova.')
  }

  if (teamForm.institutionMode === 'new'
      && (!teamForm.institutionNome.trim() || !teamForm.institutionSigla.trim())) {
    return ElMessage.warning('Informe o nome e a sigla da instituição.')
  }

  creatingTeam.value = true
  try {
    let institutionId = teamForm.institutionId

    if (teamForm.institutionMode === 'new') {
      const institution = await participantApi.createInstitution({
        nome: teamForm.institutionNome.trim(),
        sigla: teamForm.institutionSigla.trim(),
        cidade: teamForm.institutionCidade.trim() || undefined,
        estado: teamForm.institutionEstado.trim() || undefined,
        ativo: true
      })
      institutionId = institution.id
    }

    await participantApi.createTeam({
      nome: teamForm.nome.trim(),
      institutionId: institutionId!
    })

    ElMessage.success('Equipe criada. Sua conta também foi vinculada como competidor da equipe.')
    teamDialog.value = false
    Object.assign(teamForm, {
      nome: '',
      institutionMode: 'existing',
      institutionId: undefined,
      institutionNome: '',
      institutionSigla: '',
      institutionCidade: '',
      institutionEstado: ''
    })
    await loadTeams()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível criar a equipe.')
  } finally {
    creatingTeam.value = false
  }
}

async function uploadTeamLogo(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file || !activeTeam.value || !isTeamLeader.value) return

  if (file.size > 5 * 1024 * 1024) {
    return ElMessage.warning('A logo da equipe deve possuir no máximo 5 MB.')
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return ElMessage.warning('Use uma imagem JPEG, PNG ou WEBP.')
  }

  uploadingTeamLogo.value = true
  try {
    await participantApi.uploadTeamLogo(activeTeam.value.id, file)
    ElMessage.success('Logo pública da equipe atualizada.')
    await loadTeams()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a logo da equipe.')
  } finally {
    uploadingTeamLogo.value = false
  }
}

async function removeTeamLogo() {
  if (!activeTeam.value || !isTeamLeader.value || !activeTeam.value.logoUrl) return

  try {
    await ElMessageBox.confirm(
      'Remover a logo pública da equipe? A Landing voltará a usar a imagem padrão do RasComp.',
      'Remover logo da equipe',
      {
        type: 'warning',
        confirmButtonText: 'Remover logo',
        cancelButtonText: 'Cancelar'
      }
    )
  } catch {
    return
  }

  uploadingTeamLogo.value = true
  try {
    await participantApi.deleteTeamLogo(activeTeam.value.id)
    ElMessage.success('Logo da equipe removida.')
    await loadTeams()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível remover a logo da equipe.')
  } finally {
    uploadingTeamLogo.value = false
  }
}

function openResponsibleDialog(robot: Robot) {
  if (!isTeamLeader.value) return
  responsibleRobot.value = robot
  responsibleSelection.value = (responsibleMap.value[robot.id] || []).map((item) => item.competitorId)
  responsibleDialog.value = true
}

async function saveRobotResponsibles() {
  if (!responsibleRobot.value) return
  responsibleSaving.value = true
  try {
    const rows = await participantApi.setRobotResponsibles(
      responsibleRobot.value.id,
      responsibleSelection.value
    )
    responsibleMap.value = {
      ...responsibleMap.value,
      [responsibleRobot.value.id]: rows
    }
    ElMessage.success('Responsáveis do robô atualizados.')
    responsibleDialog.value = false
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar os responsáveis do robô.')
  } finally {
    responsibleSaving.value = false
  }
}

function canMaintainRobot(robot: Robot) {
  return isTeamLeader.value || robot.createdByUserId === auth.user?.id
}

function openCreateRobot() {
  robotEditingId.value = undefined
  robotForm.nome = ''
  robotForm.descricao = ''
  robotDialog.value = true
}

function openEditRobot(robot: Robot) {
  if (!canMaintainRobot(robot)) return
  robotEditingId.value = robot.id
  robotForm.nome = robot.nome
  robotForm.descricao = robot.descricao || ''
  robotDialog.value = true
}

async function saveRobot() {
  if (!teamId.value || !robotForm.nome.trim()) {
    return ElMessage.warning('Informe o nome do robô.')
  }

  const normalized = robotForm.nome.trim().toLocaleLowerCase('pt-BR')
  const duplicate = robots.value.some((robot) =>
    robot.id !== robotEditingId.value
      && robot.nome.trim().toLocaleLowerCase('pt-BR') === normalized
  )
  if (duplicate) {
    return ElMessage.warning('Já existe um robô com este nome na equipe. Edite o cadastro existente em vez de duplicá-lo.')
  }

  creatingRobot.value = true
  try {
    const payload = {
      nome: robotForm.nome.trim(),
      descricao: robotForm.descricao.trim() || undefined
    }

    if (robotEditingId.value) {
      await participantApi.updateRobot(robotEditingId.value, payload)
      ElMessage.success('Nome e descrição do robô atualizados.')
    } else {
      await participantApi.createRobot(teamId.value, payload)
      ElMessage.success('Robô cadastrado na sua equipe.')
    }

    robotDialog.value = false
    robotEditingId.value = undefined
    robotForm.nome = ''
    robotForm.descricao = ''
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível salvar o robô.')
  } finally {
    creatingRobot.value = false
  }
}

async function removeRobot(robot: Robot) {
  if (!canMaintainRobot(robot)) return

  try {
    await ElMessageBox.confirm(
      `Remover o cadastro de ${robot.nome}? O histórico já existente será preservado. Robôs com inscrição PENDENTE ou APROVADA precisam ser regularizados antes.`,
      'Remover robô',
      {
        type: 'warning',
        confirmButtonText: 'Remover cadastro',
        cancelButtonText: 'Cancelar'
      }
    )
  } catch {
    return
  }

  removingRobotId.value = robot.id
  try {
    await participantApi.deleteRobot(robot.id)
    ElMessage.success('Cadastro do robô removido do Portal.')
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível remover o robô.')
  } finally {
    removingRobotId.value = undefined
  }
}

function canManageRegistration(registration: Registration) {
  if (isTeamLeader.value) return true
  const robot = robots.value.find((item) => item.id === registration.robotId)
  return Boolean(robot?.createdByUserId && robot.createdByUserId === auth.user?.id)
}

function categoryOptionLabel(category: Category) {
  if (category.modalidade === 'FOLLOW_LINE') return `${category.nome} · Follow Line`
  const physical = category.sumoPhysicalClass === 'MINI_500G' ? 'Mini 500 g'
    : category.sumoPhysicalClass === 'SUMO_3KG' ? 'Sumô 3 kg'
      : 'classe não definida'
  const control = category.sumoControlMode === 'AUTONOMO' ? 'Autônomo'
    : category.sumoControlMode === 'RC' ? 'RC'
      : 'controle não definido'
  return `${category.nome} · ${physical} · ${control}`
}

function syncRegistrationCompetitors(_robotId?: number) {
  registrationForm.competitorIds = []
}

function refreshRegistrationCategory() {
  registrationForm.categoryId = availableRegistrationCategories.value[0]?.id
}

function onRegistrationCompetitionChange() {
  refreshRegistrationCategory()
}

function onRegistrationRobotChange(robotId?: number) {
  syncRegistrationCompetitors(robotId)
  const robot = registrableRobots.value.find((item) => item.id === robotId)
  registrationForm.robotDescricao = robot?.descricao || ''
  refreshRegistrationCategory()
}

function openRegistrationDialog() {
  if (!teamId.value) return
  if (!registrableRobots.value.length) {
    ElMessage.warning(isTeamLeader.value
      ? 'Cadastre um robô antes de criar uma inscrição.'
      : 'Você só pode iniciar a inscrição de um robô cadastrado por você. O líder pode inscrever qualquer robô da equipe.')
    return
  }
  if (!availableCompetitions.value.length) {
    ElMessage.info('Não há competição com inscrições abertas neste momento.')
    return
  }
  if (!availableRobotRegistrationCompetitions.value.length) {
    ElMessage.info('Faça sua inscrição primeiro. Assim que ela for enviada, mesmo PENDENTE, a inscrição dos robôs será liberada.')
    return
  }

  registrationForm.competitionId = availableRobotRegistrationCompetitions.value[0]?.id
  registrationForm.robotId = registrableRobots.value[0]?.id
  registrationForm.robotDescricao = registrableRobots.value[0]?.descricao || ''
  registrationForm.observacao = ''
  robotRegistrationReceipt.value = undefined
  syncRegistrationCompetitors(registrationForm.robotId)
  refreshRegistrationCategory()
  registrationDialog.value = true
}

async function submitRegistration() {
  if (!teamId.value
      || !registrationForm.competitionId
      || !registrationForm.categoryId
      || !registrationForm.robotId) {
    return ElMessage.warning('Selecione competição, categoria e robô.')
  }
  if (!robotRegistrationReceipt.value) {
    return ElMessage.warning('Envie o comprovante da inscrição do robô.')
  }

  creatingRegistration.value = true
  try {
    await participantApi.createRegistration(teamId.value, {
      competitionId: registrationForm.competitionId,
      categoryId: registrationForm.categoryId,
      robotId: registrationForm.robotId,
      robotDescricao: registrationForm.robotDescricao.trim() || undefined,
      observacao: registrationForm.observacao.trim() || undefined
    }, robotRegistrationReceipt.value)
    ElMessage.success('Inscrição enviada. Aguardando aprovação da organização.')
    registrationDialog.value = false
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível enviar a inscrição.')
  } finally {
    creatingRegistration.value = false
  }
}

function onRobotRegistrationReceiptSelected(event: Event) {
  const input = event.target as HTMLInputElement
  robotRegistrationReceipt.value = input.files?.[0]
}

function openPersonalRegistrationDialog() {
  if (!availablePersonalRegistrationCompetitions.value.length) {
    ElMessage.info('Você já possui inscrição pessoal nas competições atualmente abertas.')
    return
  }
  personalRegistrationForm.competitionId = availablePersonalRegistrationCompetitions.value[0]?.id
  personalRegistrationForm.observacao = ''
  personalRegistrationReceipt.value = undefined
  personalRegistrationDialog.value = true
}

function onPersonalRegistrationReceiptSelected(event: Event) {
  const input = event.target as HTMLInputElement
  personalRegistrationReceipt.value = input.files?.[0]
}

async function submitPersonalRegistration() {
  if (!personalRegistrationForm.competitionId) {
    return ElMessage.warning('Selecione a competição.')
  }
  if (!personalRegistrationReceipt.value) {
    return ElMessage.warning('Envie o comprovante da sua inscrição.')
  }

  creatingPersonalRegistration.value = true
  try {
    await participantApi.createPersonalRegistration({
      competitionId: personalRegistrationForm.competitionId,
      observacao: personalRegistrationForm.observacao.trim() || undefined
    }, personalRegistrationReceipt.value)
    ElMessage.success('Inscrição pessoal enviada. Aguardando aprovação da organização.')
    personalRegistrationDialog.value = false
    personalRegistrations.value = await participantApi.personalRegistrations()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível enviar sua inscrição pessoal.')
  } finally {
    creatingPersonalRegistration.value = false
  }
}

async function correctPersonalRegistration(
  registration: ParticipantCompetitionRegistration,
  event: Event
) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  try {
    await participantApi.correctPersonalRegistration(registration.id, file)
    ElMessage.success('Correção reenviada. Sua inscrição voltou para PENDENTE.')
    personalRegistrations.value = await participantApi.personalRegistrations()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível reenviar a correção.')
  }
}

async function onPhotoSelected(robot: Robot, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploadRobotId.value = robot.id
  try {
    await participantApi.uploadRobotPhoto(robot.id, file)
    photoMap.value = { ...photoMap.value, [robot.id]: await participantApi.robotPhotos(robot.id) }
    ElMessage.success(`Foto de ${robot.nome} atualizada.`)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível enviar a foto do robô.')
  } finally {
    uploadRobotId.value = undefined
  }
}

async function cancelPendingRegistration(registration: Registration) {
  try {
    await ElMessageBox.confirm(
      `Cancelar a inscrição de ${registration.robotNome} em ${registration.categoryNome}?`,
      'Cancelar inscrição pendente',
      { type: 'warning', confirmButtonText: 'Cancelar inscrição', cancelButtonText: 'Voltar' }
    )
    registrationActionId.value = registration.id
    await participantApi.cancelRegistration(registration.id)
    ElMessage.success('Inscrição cancelada.')
    await loadTeam()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível cancelar a inscrição.')
  } finally {
    registrationActionId.value = undefined
  }
}

async function reactivateRegistration(registration: Registration) {
  registrationActionId.value = registration.id
  try {
    await participantApi.reactivateRegistration(registration.id)
    ElMessage.success(registration.status === 'REJEITADA'
      ? 'Robô reinscrito e devolvido para análise.'
      : 'Inscrição reativada e devolvida para análise.')
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível reativar a inscrição.')
  } finally {
    registrationActionId.value = undefined
  }
}

async function requestApprovedCancellation(registration: Registration) {
  if (cancellationPendingIds.value.has(registration.id)) {
    ElMessage.info('Já existe uma solicitação de cancelamento pendente para esta inscrição.')
    return
  }

  try {
    const result = await ElMessageBox.prompt(
      `Explique o motivo para solicitar o cancelamento de ${registration.robotNome}. A organização analisará o pedido.`,
      'Solicitar cancelamento',
      {
        inputType: 'textarea',
        inputPlaceholder: 'Motivo do cancelamento',
        inputValidator: (value) => Boolean(value?.trim()) || 'Informe o motivo.',
        confirmButtonText: 'Enviar solicitação',
        cancelButtonText: 'Voltar'
      }
    )
    registrationActionId.value = registration.id
    await participantApi.requestRegistrationCancellation(registration.id, result.value.trim())
    cancellationPendingIds.value = new Set([...cancellationPendingIds.value, registration.id])
    ElMessage.success('Solicitação enviada para a organização.')
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível solicitar o cancelamento.')
  } finally {
    registrationActionId.value = undefined
  }
}

async function openJoinDialog() {
  joinDialog.value = true
  teamSearch.value = ''
  selectedJoinTeamId.value = undefined
  if (availableTeams.value.length) return
  loadingAvailableTeams.value = true
  try {
    availableTeams.value = await http.get<PublicTeamOption[]>('/api/v1/public/equipes').then((response) => response.data)
  } catch {
    ElMessage.error('Não foi possível carregar as equipes disponíveis.')
  } finally {
    loadingAvailableTeams.value = false
  }
}

async function requestJoin() {
  const selected = availableTeams.value.find((item) => item.id === selectedJoinTeamId.value)
  if (!selected) return ElMessage.warning('Selecione uma equipe para solicitar entrada.')
  if (pendingJoinTeamIds.value.has(selected.id)) {
    return ElMessage.info('Você já possui uma solicitação pendente para esta equipe.')
  }

  try {
    await participantApi.requestTeamJoin(selected.id, {})
    ElMessage.success(`Solicitação enviada para ${selected.nome}. Aguarde a aprovação do líder.`)
    joinDialog.value = false
    myMemberships.value = await participantApi.myTeamMemberships()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível solicitar entrada na equipe.')
  }
}

async function inviteMember() {
  if (!teamId.value || !inviteForm.email.trim()) {
    return ElMessage.warning('Informe o e-mail da conta PARTICIPANTE.')
  }
  invitingMember.value = true
  try {
    await participantApi.inviteTeamMember(teamId.value, {
      email: inviteForm.email.trim(),
      mensagem: inviteForm.mensagem.trim() || undefined
    })
    ElMessage.success('Convite enviado. O participante precisa aceitar no próprio Portal.')
    inviteDialog.value = false
    inviteForm.email = ''
    inviteForm.mensagem = ''
    teamMemberships.value = await participantApi.teamMemberships(teamId.value)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível enviar o convite.')
  } finally {
    invitingMember.value = false
  }
}

async function respondInvite(item: TeamMembershipRequest, accept: boolean) {
  membershipActionId.value = item.id
  try {
    if (accept) await participantApi.acceptTeamInvite(item.id)
    else await participantApi.rejectTeamInvite(item.id)

    ElMessage.success(accept ? 'Convite aceito. Você agora faz parte da equipe.' : 'Convite recusado.')
    await loadTeams()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível processar o convite.')
  } finally {
    membershipActionId.value = undefined
  }
}

async function reviewJoinRequest(item: TeamMembershipRequest, approve: boolean) {
  if (!teamId.value) return
  membershipActionId.value = item.id
  try {
    if (approve) await participantApi.approveTeamJoin(item.id)
    else await participantApi.rejectTeamJoin(item.id)

    ElMessage.success(approve ? 'Participante adicionado à equipe.' : 'Solicitação recusada.')
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível analisar a solicitação.')
  } finally {
    membershipActionId.value = undefined
  }
}

let lastExternalRefreshAt = 0

function refreshPortalWhenReturning() {
  if (document.visibilityState === 'hidden') return
  const now = Date.now()
  if (now - lastExternalRefreshAt < 800) return
  lastExternalRefreshAt = now
  loadTeams()
}

watch(teamId, loadTeam)
onMounted(() => {
  loadTeams()
  window.addEventListener('focus', refreshPortalWhenReturning)
  document.addEventListener('visibilitychange', refreshPortalWhenReturning)
})
onBeforeUnmount(() => {
  window.removeEventListener('focus', refreshPortalWhenReturning)
  document.removeEventListener('visibilitychange', refreshPortalWhenReturning)
})
</script>

<template>
  <div class="page-stack participant-dashboard" v-loading="loading">
    <div class="page-heading">
      <div class="participant-heading-identity">
        <div v-if="activeTeam" class="participant-team-logo">
          <img
            :src="activeTeam.logoUrl ? assetUrl(activeTeam.logoUrl) : '/rascomp-logo.webp'"
            :alt="`Logo da equipe ${activeTeam.nome}`"
            :class="{ generic: !activeTeam.logoUrl }"
          />
        </div>

        <div>
          <span class="eyebrow">Portal do participante</span>
          <h1>{{ activeTeam?.nome || 'Minha equipe' }}</h1>
          <p class="muted">Robôs, inscrições e desempenho competitivo em um só lugar.</p>
          <p v-if="activeTeam?.responsibleUserNome" class="team-leader-inline">
            Líder da equipe: <strong>{{ activeTeam.responsibleUserNome }}</strong>
            <el-tag v-if="isTeamLeader" size="small" type="success" effect="light">Você</el-tag>
          </p>

          <div v-if="activeTeam && isTeamLeader" class="participant-team-logo-actions">
            <label class="participant-team-logo-upload" :class="{ disabled: uploadingTeamLogo }">
              {{ activeTeam.logoUrl ? 'Trocar logo da equipe' : 'Adicionar logo da equipe' }}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                :disabled="uploadingTeamLogo"
                @change="uploadTeamLogo"
              />
            </label>

            <button
              v-if="activeTeam.logoUrl"
              type="button"
              class="participant-team-logo-remove"
              :disabled="uploadingTeamLogo"
              @click="removeTeamLogo"
            >
              Remover
            </button>

            <small>PNG, JPG ou WEBP · até 5 MB · exibida publicamente na Landing.</small>
          </div>
        </div>
      </div>
      <div class="heading-actions">
        <el-button v-if="teams.length" :loading="loading" @click="loadTeams">Atualizar</el-button>
        <el-select v-if="teams.length > 1" v-model="teamId" style="width:260px">
          <el-option v-for="team in teams" :key="team.id" :label="team.nome" :value="team.id" />
        </el-select>
        <template v-if="!teams.length">
          <el-button @click="openJoinDialog">Já tenho equipe</el-button>
          <el-button class="brand-button" @click="teamDialog = true">Criar equipe</el-button>
        </template>
      </div>
    </div>

    <section v-if="pendingInvites.length" class="participant-invite-stack">
      <article v-for="invite in pendingInvites" :key="invite.id" class="participant-invite-card">
        <div>
          <span class="eyebrow">Convite para equipe</span>
          <h3>{{ invite.teamNome }}</h3>
          <p>{{ invite.institutionSigla ? invite.institutionSigla + ' — ' : '' }}{{ invite.institutionNome }}</p>
          <small v-if="invite.mensagem">{{ invite.mensagem }}</small>
        </div>
        <div class="participant-invite-actions">
          <el-button
            :loading="membershipActionId === invite.id"
            @click="respondInvite(invite, false)"
          >Recusar</el-button>
          <el-button
            class="brand-button"
            :loading="membershipActionId === invite.id"
            @click="respondInvite(invite, true)"
          >Aceitar convite</el-button>
        </div>
      </article>
    </section>

    <article v-if="!teams.length && !loading" class="participant-empty-onboarding">
      <span class="eyebrow">Primeiro acesso</span>
      <h2>Comece pela sua equipe</h2>
      <p>Crie uma equipe para se tornar responsável ou procure uma equipe existente.</p>
      <div class="participant-onboarding-actions">
        <el-button class="brand-button" @click="teamDialog = true">Criar minha equipe</el-button>
        <el-button @click="openJoinDialog">Encontrar equipe</el-button>
      </div>
    </article>

    <template v-else-if="activeTeam">
      <section class="participant-summary-grid">
        <article><span>Competidores</span><strong>{{ competitors.length }}</strong><small>na equipe</small></article>
        <article><span>Robôs</span><strong>{{ robots.length }}</strong><small>{{ isTeamLeader ? 'da equipe' : 'vinculados a mim' }}</small></article>
        <article><span>Inscrições aprovadas</span><strong>{{ approvedRegistrations.length }}</strong><small>{{ isTeamLeader ? 'dos robôs da equipe' : 'dos meus robôs' }}</small></article>
        <article class="attention"><span>Pendentes</span><strong>{{ pendingRegistrations.length }}</strong><small>{{ isTeamLeader ? 'inscrições de robôs da equipe' : 'inscrições dos meus robôs' }}</small></article>
      </section>

      <section class="participant-section">
        <div class="participant-section-heading">
          <div>
            <span class="eyebrow">Participante</span>
            <h2>Minha inscrição</h2>
          </div>
          <div class="participant-section-actions">
            <span class="muted">Sua inscrição individual na competição. Equipe e robôs são tratados separadamente.</span>
            <el-button
              class="brand-button"
              :disabled="!availablePersonalRegistrationCompetitions.length"
              @click="openPersonalRegistrationDialog"
            >
              Fazer minha inscrição
            </el-button>
          </div>
        </div>

        <div v-if="personalRegistrations.length" class="personal-registration-list">
          <article v-for="item in personalRegistrations" :key="item.id" class="personal-registration-card">
            <div>
              <span class="eyebrow">{{ item.competitionNome }}</span>
              <strong>{{ item.competitorNome }}</strong>
              <small>{{ item.teamNome }}</small>
            </div>
            <div class="personal-registration-meta">
              <StatusBadge :value="item.status" />
              <small v-if="item.comprovanteDisponivel">Comprovante: {{ item.comprovanteNome || 'enviado' }}</small>
              <small v-if="item.status === 'PENDENTE'">Aguardando aprovação da organização.</small>
              <small v-if="item.status === 'CORRECAO_SOLICITADA' && item.reviewReason">
                Correção solicitada: {{ item.reviewReason }}
              </small>
              <small v-if="item.status === 'REJEITADA' && item.reviewReason">{{ item.reviewReason }}</small>
              <label v-if="item.status === 'CORRECAO_SOLICITADA'" class="robot-photo-upload">
                Reenviar comprovante
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  @change="correctPersonalRegistration(item, $event)"
                />
              </label>
            </div>
            <div v-if="item.robots?.length" class="personal-registration-robots">
              <b>Robôs associados a você</b>
              <span v-for="robot in item.robots" :key="`${robot.robotId}-${robot.registrationId || 0}-${robot.categoryId || 0}`">
                {{ robot.robotNome }}
                <template v-if="robot.categoryNome"> · {{ robot.categoryNome }} · {{ robot.registrationStatus }}</template>
                <template v-else> · ainda sem inscrição nesta competição</template>
              </span>
            </div>
          </article>
        </div>
        <div v-else class="participant-flow-note">
          <strong>Você ainda não fez sua inscrição.</strong>
          <span>Esta é somente a sua entrada individual na competição. Seu vínculo com a equipe e com os robôs continua existindo independentemente desta aprovação.</span>
        </div>
      </section>

      <section class="participant-section robot-registration-section">
        <div class="participant-section-heading">
          <div><span class="eyebrow">Inscrição competitiva dos robôs</span><h2>{{ isTeamLeader ? 'Inscrições dos robôs da equipe' : 'Inscrições dos meus robôs' }}</h2></div>
          <div class="participant-section-actions">
            <span class="muted">{{ robotRegistrationUnlockMessage }}</span>
            <el-button
              class="brand-button"
              :disabled="!registrableRobots.length || !availableRobotRegistrationCompetitions.length"
              @click="openRegistrationDialog"
            >
              Inscrever robô
            </el-button>
          </div>
        </div>

        <div v-if="pendingRegistrations.length" class="participant-registration-pending-banner">
          <div>
            <strong>Aguardando aprovação da organização</strong>
            <span>{{ pendingRegistrations.length }} inscrição(ões) de robô pendente(s). O robô só entra oficialmente na competição após aprovação.</span>
          </div>
        </div>

        <div v-if="approvedRegistrations.length" class="participation-grid">
          <article
            v-for="registration in approvedRegistrations"
            :key="registration.id"
            class="participation-card"
            :class="{ 'participant-champion-card': sumoMap[registration.id]?.placement === 'CAMPEAO' }"
          >
            <header>
              <div class="participation-photo">
                <img
                  v-if="principalPhoto(registration.robotId)"
                  :src="assetUrl(principalPhoto(registration.robotId)?.url)"
                  :alt="`Foto de ${registration.robotNome}`"
                />
                <span v-else>{{ robotInitials(registration.robotNome) }}</span>
              </div>
              <div class="participation-title">
                <span>{{ registration.categoryNome }}</span>
                <strong>{{ registration.robotNome }}</strong>
                <small>{{ registration.competitionNome }}</small>
              </div>
              <StatusBadge :value="registration.status" />
            </header>

            <div v-if="sumoMap[registration.id]?.placement === 'CAMPEAO'" class="participant-champion-banner">
              <span>CAMPEÃO</span>
              <strong>{{ registration.categoryNome }}</strong>
              <small>{{ registration.competitionNome }}</small>
            </div>

            <template v-if="followMap[registration.id]">
              <div class="participant-performance">
                <div><span>Ranking</span><strong>{{ followMap[registration.id].ranking?.posicao ? `#${followMap[registration.id].ranking?.posicao}` : '—' }}</strong></div>
                <div><span>Melhor tomada</span><strong>{{ followMap[registration.id].ranking?.tomada ? `T${followMap[registration.id].ranking?.tomada}` : '—' }}</strong></div>
                <div class="highlight"><span>Melhor tempo</span><strong>{{ formatSeconds(followMap[registration.id].ranking?.tempoFinalSegundos) }}</strong></div>
              </div>
              <div v-if="followMap[registration.id].config" class="take-progress">
                <div class="take-progress-copy">
                  <strong>{{ completedTakes(registration.id) }} / {{ followMap[registration.id].config?.numeroTomadas }} tomadas preenchidas</strong>
                  <span>Próxima operação: tomada {{ Math.min(completedTakes(registration.id) + 1, followMap[registration.id].config?.numeroTomadas || 1) }}</span>
                </div>
                <el-progress
                  :percentage="Math.round((completedTakes(registration.id) / (followMap[registration.id].config?.numeroTomadas || 1)) * 100)"
                  :stroke-width="9"
                  :show-text="false"
                />
              </div>
              <div class="participant-take-history">
                <div v-for="take in followTakeGroups(registration.id)" :key="take.tomada" class="participant-take-row">
                  <span>Tomada {{ take.tomada }}</span>
                  <b>{{ take.attempts.length }} tentativa(s)</b>
                  <strong>{{ formatSeconds(take.best?.tempoFinalSegundos) }}</strong>
                  <el-tag :type="take.filled ? 'success' : 'info'" size="small" effect="light">{{ take.filled ? 'Preenchida' : 'Disponível' }}</el-tag>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="participant-performance sumo">
                <div><span>Vitórias</span><strong>{{ sumoMap[registration.id]?.wins ?? 0 }}</strong></div>
                <div><span>Derrotas</span><strong>{{ sumoMap[registration.id]?.losses ?? 0 }}</strong></div>
                <div class="highlight"><span>Situação</span><strong>{{ sumoMap[registration.id]?.statusLabel || 'Inscrito' }}</strong></div>
              </div>
              <div v-if="sumoMap[registration.id]?.lastMatch" class="participant-last-match">
                <span>Última partida</span>
                <strong>
                  {{ sumoMap[registration.id]?.lastMatch?.robotANome }} × {{ sumoMap[registration.id]?.lastMatch?.robotBNome }}
                </strong>
                <el-tag :type="sumoMap[registration.id]?.lastResult?.winnerRegistrationId === registration.id ? 'success' : 'danger'" effect="light">
                  {{ sumoMap[registration.id]?.lastResult?.winnerRegistrationId === registration.id ? 'Vitória' : 'Derrota' }}
                </el-tag>
              </div>
              <div v-if="sumoMap[registration.id]?.nextMatch" class="participant-next-match">
                <span>Próxima partida</span>
                <strong>{{ sumoMap[registration.id]?.nextMatch?.robotANome }} × {{ sumoMap[registration.id]?.nextMatch?.robotBNome }}</strong>
                <small>{{ sumoMap[registration.id]?.bracketName }}</small>
              </div>

              <button
                v-if="sumoMap[registration.id]?.bracketId"
                type="button"
                class="participant-bracket-action"
                @click="openParticipantBracket(registration)"
              >
                Ver chave completa
                <span aria-hidden="true">→</span>
              </button>
            </template>
          </article>
        </div>
        <el-empty
          v-else
          :description="isTeamLeader ? 'Ainda não há inscrições aprovadas para esta equipe.' : 'Você ainda não possui inscrição aprovada nesta equipe.'"
          :image-size="82"
        />
      </section>

      <section class="participant-section">
        <div class="participant-section-heading">
          <div><span class="eyebrow">Equipe</span><h2>{{ isTeamLeader ? 'Robôs da equipe' : 'Meus robôs' }}</h2></div>
          <div class="participant-section-actions">
            <span class="muted">
              {{ isTeamLeader
                ? 'Você administra todos os robôs da equipe e seus responsáveis.'
                : 'Aqui aparecem os robôs pelos quais você está cadastrado como responsável.' }}
            </span>
            <el-button class="brand-button" @click="openCreateRobot">Cadastrar robô</el-button>
          </div>
        </div>
        <div class="robot-gallery">
          <article v-for="robot in robots" :key="robot.id" class="robot-gallery-card">
            <div class="robot-gallery-image">
              <img v-if="principalPhoto(robot.id)" :src="assetUrl(principalPhoto(robot.id)?.url)" :alt="`Foto de ${robot.nome}`" />
              <span v-else>{{ robotInitials(robot.nome) }}</span>
            </div>
            <div class="robot-gallery-copy">
              <strong>{{ robot.nome }}</strong>
              <span>{{ robot.descricao || 'Sem descrição' }}</span>
              <small>{{ (photoMap[robot.id] || []).length }} foto(s) cadastrada(s)</small>
              <div class="robot-responsible-summary">
                <b>Responsáveis</b>
                <span v-if="(responsibleMap[robot.id] || []).length">
                  {{ (responsibleMap[robot.id] || []).map((item) => item.competitorNome).join(', ') }}
                </span>
                <span v-else>Nenhum responsável definido</span>
              </div>
            </div>
            <div class="robot-gallery-actions">
              <label class="robot-photo-upload" :class="{ disabled: uploadRobotId === robot.id }">
                {{ uploadRobotId === robot.id ? 'Enviando...' : 'Trocar / adicionar foto' }}
                <input type="file" accept="image/png,image/jpeg,image/webp" :disabled="uploadRobotId === robot.id" @change="onPhotoSelected(robot, $event)" />
              </label>
              <el-button v-if="isTeamLeader" size="small" @click="openResponsibleDialog(robot)">Responsáveis</el-button>
              <el-button v-if="canMaintainRobot(robot)" size="small" plain @click="openEditRobot(robot)">Editar</el-button>
              <el-button
                v-if="canMaintainRobot(robot)"
                size="small"
                type="danger"
                plain
                :loading="removingRobotId === robot.id"
                @click="removeRobot(robot)"
              >Remover</el-button>
            </div>
          </article>
        </div>
      </section>

      <section class="participant-lower-grid">
        <article class="table-card">
          <div class="card-heading"><div><span class="eyebrow">Inscrições</span><h2>{{ isTeamLeader ? 'Acompanhamento da equipe' : 'Minhas inscrições' }}</h2></div></div>
          <el-table :data="registrations" empty-text="Nenhuma inscrição">
            <el-table-column prop="competitionNome" label="Competição" min-width="170" />
            <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
            <el-table-column prop="robotNome" label="Robô" min-width="120" />
            <el-table-column label="Status" min-width="210">
              <template #default="{ row }">
                <div class="registration-status-cell">
                  <StatusBadge :value="row.status" />
                  <small v-if="row.status === 'PENDENTE'">Aguardando aprovação da organização</small>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Ação" min-width="190" align="right">
              <template #default="{ row }">
                <template v-if="canManageRegistration(row)">
                <el-button
                  v-if="row.status === 'PENDENTE'"
                  size="small"
                  type="danger"
                  plain
                  :loading="registrationActionId === row.id"
                  @click="cancelPendingRegistration(row)"
                >Cancelar</el-button>
                <el-button
                  v-else-if="row.status === 'APROVADA'"
                  size="small"
                  :type="cancellationPendingIds.has(row.id) ? 'warning' : 'danger'"
                  plain
                  :disabled="cancellationPendingIds.has(row.id)"
                  :loading="registrationActionId === row.id"
                  @click="requestApprovedCancellation(row)"
                >{{ cancellationPendingIds.has(row.id) ? 'Cancelamento solicitado' : 'Solicitar cancelamento' }}</el-button>
                <el-button
                  v-else-if="['CANCELADA', 'REJEITADA'].includes(row.status)"
                  size="small"
                  plain
                  :loading="registrationActionId === row.id"
                  @click="reactivateRegistration(row)"
                >{{ row.status === 'REJEITADA' ? 'Reinscrever' : 'Reativar' }}</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </article>
        <article class="table-card">
          <div class="card-heading">
            <div><span class="eyebrow">Equipe</span><h2>Competidores</h2></div>
            <el-button v-if="isTeamLeader" class="brand-button" @click="inviteDialog = true">Adicionar integrante</el-button>
          </div>

          <div v-if="isTeamLeader && pendingJoinRequests.length" class="participant-join-requests">
            <div class="section-mini-heading">
              <div><span class="eyebrow">Solicitações de entrada</span><strong>{{ pendingJoinRequests.length }} pendente(s)</strong></div>
            </div>
            <div v-for="request in pendingJoinRequests" :key="request.id" class="participant-join-request">
              <div>
                <strong>{{ request.participantNome }}</strong>
                <small>{{ request.participantEmail }}</small>
              </div>
              <div>
                <el-button
                  size="small"
                  :loading="membershipActionId === request.id"
                  @click="reviewJoinRequest(request, false)"
                >Recusar</el-button>
                <el-button
                  size="small"
                  type="success"
                  :loading="membershipActionId === request.id"
                  @click="reviewJoinRequest(request, true)"
                >Aprovar</el-button>
              </div>
            </div>
          </div>

          <el-table :data="competitors" empty-text="Nenhum competidor">
            <el-table-column label="Nome" min-width="180">
              <template #default="{ row }">
                <div class="participant-competitor-name">
                  <strong>{{ row.nome }}</strong>
                  <el-tag v-if="row.teamLeader" size="small" type="success" effect="light">Líder</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="E-mail" min-width="180" />
          </el-table>
        </article>
      </section>
    </template>

    <el-dialog v-model="teamDialog" title="Criar equipe" width="min(520px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Nome da equipe<el-input v-model="teamForm.nome" maxlength="120" placeholder="Ex.: Team Vespa" /></label>
        <label class="span-2">Instituição
          <el-radio-group v-model="teamForm.institutionMode">
            <el-radio-button value="existing">Já está cadastrada</el-radio-button>
            <el-radio-button value="new">Cadastrar instituição</el-radio-button>
          </el-radio-group>
        </label>

        <label v-if="teamForm.institutionMode === 'existing'" class="span-2">Buscar instituição existente
          <el-select v-model="teamForm.institutionId" filterable placeholder="Digite nome ou sigla" style="width:100%">
            <el-option v-for="institution in institutions" :key="institution.id" :label="institution.sigla ? `${institution.sigla} — ${institution.nome}` : institution.nome" :value="institution.id" />
          </el-select>
        </label>

        <template v-else>
          <label class="span-2">Nome da instituição
            <el-input v-model="teamForm.institutionNome" maxlength="150" placeholder="Ex.: Universidade Federal do Recôncavo da Bahia" />
          </label>
          <label>Sigla
            <el-input v-model="teamForm.institutionSigla" maxlength="20" placeholder="Ex.: UFRB" />
          </label>
          <label>Cidade <small class="muted">(opcional)</small>
            <el-input v-model="teamForm.institutionCidade" maxlength="100" />
          </label>
          <label>Estado <small class="muted">(opcional)</small>
            <el-input v-model="teamForm.institutionEstado" maxlength="2" placeholder="BA" />
          </label>
        </template>
      </div>
      <template #footer><el-button @click="teamDialog=false">Cancelar</el-button><el-button class="brand-button" :loading="creatingTeam" @click="createTeam">Criar equipe</el-button></template>
    </el-dialog>

    <el-dialog v-model="inviteDialog" title="Adicionar integrante" width="min(540px, 92vw)">
      <div class="form-grid">
        <div class="span-2 participant-flow-note">
          <strong>Convite pela conta do participante</strong>
          <span>Digite o e-mail usado no cadastro. O integrante só entra na equipe depois de aceitar o convite.</span>
        </div>
        <label class="span-2">E-mail da conta PARTICIPANTE
          <el-input v-model="inviteForm.email" type="email" maxlength="150" placeholder="participante@email.com" />
        </label>
        <label class="span-2">Mensagem <small class="muted">(opcional)</small>
          <el-input v-model="inviteForm.mensagem" type="textarea" :rows="3" maxlength="500" />
        </label>
      </div>
      <template #footer>
        <el-button @click="inviteDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="invitingMember" @click="inviteMember">Enviar convite</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="personalRegistrationDialog" title="Minha inscrição na competição" width="min(620px, 94vw)">
      <div class="registration-flow-dialog">
        <div class="participant-flow-note">
          <strong>Inscrição pessoal</strong>
          <span>Esta aprovação é separada da sua equipe e dos robôs. Depois da análise do comprovante, você ficará habilitado como participante desta competição.</span>
        </div>
        <div class="form-grid">
          <label class="span-2">Competição com inscrições abertas
            <el-select v-model="personalRegistrationForm.competitionId" style="width:100%">
              <el-option
                v-for="competition in availablePersonalRegistrationCompetitions"
                :key="competition.id"
                :label="`${competition.nome} · inscrições até ${competition.fimInscricoes}`"
                :value="competition.id"
              />
            </el-select>
          </label>
          <label class="span-2">Observação <small class="muted">(opcional)</small>
            <el-input v-model="personalRegistrationForm.observacao" type="textarea" :rows="3" maxlength="500" />
          </label>
          <label class="span-2 registration-receipt-field">
            Comprovante da inscrição
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              @change="onPersonalRegistrationReceiptSelected"
            />
            <small class="muted">
              PDF, JPG, PNG ou WEBP · até 10 MB.
              {{ personalRegistrationReceipt?.name || 'Nenhum arquivo selecionado.' }}
            </small>
          </label>
        </div>
      </div>
      <template #footer>
        <el-button @click="personalRegistrationDialog = false">Cancelar</el-button>
        <el-button
          class="brand-button"
          :loading="creatingPersonalRegistration"
          :disabled="!personalRegistrationForm.competitionId || !personalRegistrationReceipt"
          @click="submitPersonalRegistration"
        >Enviar minha inscrição</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="registrationDialog" title="Inscrever robô" width="min(680px, 94vw)">
      <div class="registration-flow-dialog">
        <div class="participant-flow-note">
          <strong>Inscrição do robô</strong>
          <span>Sua inscrição individual já foi iniciada, então você pode inscrever o robô sem esperar a aprovação da Gestão. Para aprovar o robô, basta existir ao menos um responsável com inscrição individual APROVADA; outros responsáveis podem continuar aguardando análise.</span>
        </div>

        <div class="form-grid">
          <label class="span-2">Competição com inscrições abertas
            <el-select v-model="registrationForm.competitionId" style="width:100%" @change="onRegistrationCompetitionChange">
              <el-option
                v-for="competition in availableRobotRegistrationCompetitions"
                :key="competition.id"
                :label="`${competition.nome} · inscrições até ${competition.fimInscricoes}`"
                :value="competition.id"
              />
            </el-select>
          </label>

          <label class="span-2">Robô
            <el-select v-model="registrationForm.robotId" style="width:100%" @change="onRegistrationRobotChange">
              <el-option v-for="robot in registrableRobots" :key="robot.id" :label="robot.nome" :value="robot.id" />
            </el-select>
            <small class="muted">{{ isTeamLeader ? 'Como líder, você pode inscrever qualquer robô da equipe.' : 'Você pode iniciar a inscrição apenas dos robôs cadastrados por você.' }}</small>
          </label>

          <label class="span-2">Categoria compatível
            <el-select v-model="registrationForm.categoryId" style="width:100%" placeholder="Selecione a categoria">
              <el-option
                v-for="category in availableRegistrationCategories"
                :key="category.id"
                :label="categoryOptionLabel(category)"
                :value="category.id"
              />
            </el-select>
          </label>

          <el-alert
            v-if="registrationForm.robotId && !availableRegistrationCategories.length"
            class="span-2"
            type="info"
            :closable="false"
            title="Nenhuma categoria disponível para este robô nesta competição. Verifique inscrições existentes ou reative uma inscrição cancelada quando aplicável."
          />

          <label class="span-2">Descrição do robô nesta inscrição <small class="muted">(opcional)</small>
            <el-input
              v-model="registrationForm.robotDescricao"
              type="textarea"
              :rows="3"
              maxlength="500"
              placeholder="Descrição simples do robô para esta edição"
            />
            <small class="muted">O valor atual do cadastro é preenchido automaticamente e ficará registrado junto desta inscrição.</small>
          </label>

          <div class="span-2 participant-flow-note">
            <strong>Composição automática</strong>
            <span>
              A composição competitiva é definida pelos responsáveis do robô e pelo status da inscrição individual de cada pessoa.
              Responsáveis APROVADOS entram oficialmente; PENDENTES aguardam elegibilidade. O líder pode ajustar responsáveis até o início da competição.
            </span>
          </div>

          <label class="span-2">Observação <small class="muted">(opcional)</small>
            <el-input v-model="registrationForm.observacao" type="textarea" :rows="3" maxlength="500" />
          </label>

          <label class="span-2 registration-receipt-field">
            Comprovante da inscrição do robô
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              @change="onRobotRegistrationReceiptSelected"
            />
            <small class="muted">
              PDF, JPG, PNG ou WEBP · até 10 MB.
              {{ robotRegistrationReceipt?.name || 'Nenhum arquivo selecionado.' }}
            </small>
          </label>
        </div>
      </div>
      <template #footer>
        <el-button @click="registrationDialog = false">Cancelar</el-button>
        <el-button
          class="brand-button"
          :loading="creatingRegistration"
          :disabled="!registrationForm.categoryId || !robotRegistrationReceipt"
          @click="submitRegistration"
        >Enviar inscrição do robô</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="responsibleDialog"
      :title="`Responsáveis · ${responsibleRobot?.nome || 'Robô'}`"
      width="min(560px, 92vw)"
    >
      <div class="robot-responsible-dialog">
        <p class="muted">
          Selecione os competidores da equipe responsáveis por este robô. O líder continua com acesso administrativo mesmo sem estar nesta lista.
        </p>
        <el-checkbox-group v-model="responsibleSelection" class="robot-responsible-options">
          <el-checkbox
            v-for="competitor in competitors.filter((item) => item.ativo !== false)"
            :key="competitor.id"
            :value="competitor.id"
            border
          >
            <span>{{ competitor.nome }}</span>
            <small v-if="competitor.email">{{ competitor.email }}</small>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="responsibleDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="responsibleSaving" @click="saveRobotResponsibles">Salvar responsáveis</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="robotDialog"
      :title="robotEditingId ? 'Editar robô' : 'Cadastrar robô'"
      width="min(520px, 92vw)"
    >
      <div class="form-grid">
        <label class="span-2">Nome do robô
          <el-input v-model="robotForm.nome" maxlength="120" placeholder="Ex.: Vespa" />
        </label>
        <div class="span-2 participant-flow-note">
          <strong>Responsabilidade inicial</strong>
          <span>Quem cadastrar o robô entra automaticamente como responsável. O líder poderá adicionar outros integrantes depois.</span>
        </div>
        <label class="span-2">Descrição <small class="muted">(opcional)</small>
          <el-input v-model="robotForm.descricao" type="textarea" :rows="3" maxlength="500" />
        </label>
      </div>
      <template #footer>
        <el-button @click="robotDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="creatingRobot" @click="saveRobot">
          {{ robotEditingId ? 'Salvar alterações' : 'Cadastrar robô' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="joinDialog" title="Encontrar minha equipe" width="min(620px, 94vw)">
      <div class="join-team-dialog" v-loading="loadingAvailableTeams">
        <p class="muted">Pesquise por equipe ou instituição.</p>
        <el-input v-model="teamSearch" clearable placeholder="Digite o nome da equipe..." />
        <div class="join-team-results">
          <button v-for="team in filteredAvailableTeams" :key="team.id" type="button" class="join-team-option" :class="{ selected: selectedJoinTeamId === team.id }" @click="selectedJoinTeamId=team.id">
            <span><strong>{{ team.nome }}</strong><small>{{ team.institutionSigla ? `${team.institutionSigla} — ` : '' }}{{ team.institutionNome }}</small></span>
            <b>{{ pendingJoinTeamIds.has(team.id) ? 'Solicitação pendente' : (selectedJoinTeamId === team.id ? 'Selecionada' : 'Escolher') }}</b>
          </button>
        </div>
      </div>
      <template #footer><el-button @click="joinDialog=false">Cancelar</el-button><el-button class="brand-button" @click="requestJoin">Solicitar entrada</el-button></template>
    </el-dialog>

    <el-dialog
      v-model="participantBracketDialog"
      :title="`Chave · ${selectedParticipantBracketRegistration?.categoryNome || 'Sumô'}`"
      width="min(1180px, 96vw)"
      class="participant-bracket-dialog"
    >
      <div class="participant-bracket-dialog-copy">
        <strong>{{ selectedParticipantBracketRegistration?.competitionNome }}</strong>
        <span>
          Acompanhamento em modo somente leitura. Resultados, BYEs e próximos confrontos são os mesmos publicados pela organização.
        </span>
      </div>

      <TournamentBracket
        v-if="selectedParticipantBracket?.matches?.length"
        :matches="selectedParticipantBracket.matches"
        :results="selectedParticipantBracket.results || []"
        read-only
        participant-mode
      />

      <el-empty v-else description="A chave ainda não foi publicada." :image-size="82" />
    </el-dialog>
  </div>
</template>

<style scoped>
.participant-heading-identity { display:flex; align-items:flex-start; gap:16px; min-width:0; }
.participant-team-logo { display:grid; place-items:center; flex:0 0 82px; width:82px; height:82px; overflow:hidden; border:1px solid #e6dbe0; border-radius:18px; background:#fff; box-shadow:0 8px 24px rgba(70,20,44,.06); }
.participant-team-logo img { width:84%; height:84%; object-fit:contain; }
.participant-team-logo img.generic { width:72%; height:72%; opacity:.78; }
.participant-team-logo-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:9px; }
.participant-team-logo-actions > small { flex-basis:100%; color:#8a7a82; font-size:10px; }
.participant-team-logo-upload,.participant-team-logo-remove { min-height:30px; padding:0 10px; border:1px solid #cbaeb9; border-radius:9px; background:#fff; color:#8f1238; font:inherit; font-size:10px; font-weight:850; cursor:pointer; }
.participant-team-logo-upload { display:inline-flex; align-items:center; }
.participant-team-logo-upload input { display:none; }
.participant-team-logo-upload.disabled,.participant-team-logo-remove:disabled { opacity:.5; cursor:wait; }
.participant-team-logo-remove { color:#706168; border-color:#dfd5da; }
.team-leader-inline { display:flex; align-items:center; gap:7px; margin:6px 0 0; color:#71636a; font-size:12px; }
.team-leader-inline strong { color:#33262d; }
.participant-competitor-name { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.robot-registration-section { padding:18px; border:1px solid #dfcdd5; border-radius:17px; background:#fff; box-shadow:0 10px 30px rgba(70,20,44,.045); }
.robot-registration-section .participant-section-heading h2 { font-size:1.35rem; }
.robot-registration-section .participant-section-actions > .muted { font-size:13px; line-height:1.45; color:#695b62; }
.personal-registration-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.personal-registration-card { display:grid; gap:12px; padding:16px; border:1px solid #e7dde2; border-radius:15px; background:#fff; }
.personal-registration-card > div:first-child { display:grid; gap:3px; }
.personal-registration-card strong { color:#30242a; }
.personal-registration-card small { color:#81737a; }
.personal-registration-meta,.personal-registration-robots { display:grid; gap:6px; }
.personal-registration-robots { padding-top:10px; border-top:1px solid #eee3e8; }
.personal-registration-robots b { color:#5f4b55; font-size:11px; text-transform:uppercase; letter-spacing:.04em; }
.personal-registration-robots span { color:#75656d; font-size:11px; }
.registration-receipt-field { display:grid; gap:7px; }
.registration-receipt-field input[type="file"] { padding:10px; border:1px dashed #cbaeb9; border-radius:10px; background:#fff; }
@media (max-width:680px) { .personal-registration-list { grid-template-columns:1fr; } }
.participant-dashboard { gap: 20px; }
.participant-summary-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
.participant-summary-grid article { display:grid; gap:4px; padding:17px 18px; border:1px solid #eadfe5; border-radius:14px; background:#fff; }
.participant-summary-grid span,.participant-summary-grid small { color:#82747b; font-size:11px; }
.participant-summary-grid strong { color:#2e2228; font-size:25px; }
.participant-summary-grid .attention { background:#fff8f4; border-color:#f1d8c5; }
.participant-summary-grid .attention strong { color:#9f0f3b; }
.participant-section { display:grid; gap:14px; }
.participant-section-heading { display:flex; align-items:end; justify-content:space-between; gap:16px; }
.participant-section-heading h2 { margin:2px 0 0; }
.participation-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.participation-card { display:grid; gap:15px; padding:18px; border:1px solid #e5d9df; border-radius:18px; background:#fff; box-shadow:0 9px 28px rgba(70,20,44,.05); }
.participation-card header { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:13px; }
.participation-photo { display:grid; place-items:center; width:76px; height:76px; border-radius:18px; overflow:hidden; background:linear-gradient(145deg,#4f1967,#9f0f3b); color:#fff; font-size:20px; font-weight:900; }
.participation-photo img,.robot-gallery-image img { width:100%; height:100%; object-fit:cover; }
.participation-title { display:grid; gap:2px; min-width:0; }
.participation-title > span { color:#9f0f3b; font-size:10px; font-weight:850; text-transform:uppercase; letter-spacing:.06em; }
.participation-title strong { color:#292027; font-size:19px; }
.participation-title small { color:#83767d; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.participant-performance { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
.participant-performance > div { display:grid; gap:3px; padding:11px 12px; border-radius:12px; background:#f7f3f5; }
.participant-performance span { color:#81737a; font-size:10px; }
.participant-performance strong { color:#35272f; font-size:17px; }
.participant-performance .highlight { background:#fff0f5; }
.participant-performance .highlight strong { color:#9f0f3b; }
.take-progress { display:grid; gap:8px; padding:12px 13px; border:1px solid #eadce3; border-radius:12px; }
.take-progress-copy { display:flex; justify-content:space-between; gap:12px; font-size:11px; }
.take-progress-copy span { color:#84777e; }
.participant-take-history { display:grid; gap:6px; }
.participant-take-row { display:grid; grid-template-columns:85px minmax(0,1fr) 95px auto; align-items:center; gap:8px; min-height:36px; padding:7px 9px; border-radius:9px; background:#faf8f9; font-size:11px; }
.participant-take-row span { font-weight:750; }
.participant-take-row b { color:#81747a; font-weight:600; }
.participant-take-row strong { color:#9f0f3b; }
.participant-last-match,.participant-next-match { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:10px; padding:11px 12px; border-radius:12px; background:#faf7f8; }
.participant-last-match > span,.participant-next-match > span { color:#81747b; font-size:10px; text-transform:uppercase; font-weight:800; }
.participant-next-match small { grid-column:2; color:#8c7e85; }
.robot-gallery { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.robot-gallery-card { display:grid; grid-template-columns:108px minmax(0,1fr) auto; align-items:center; gap:14px; padding:14px; border:1px solid #e7dde2; border-radius:16px; background:#fff; }
.robot-gallery-image { display:grid; place-items:center; width:108px; height:82px; border-radius:13px; overflow:hidden; background:linear-gradient(145deg,#4f1967,#9f0f3b); color:#fff; font-size:22px; font-weight:900; }
.robot-gallery-copy { display:grid; gap:3px; }
.robot-gallery-copy span,.robot-gallery-copy small { color:#82757c; font-size:10px; }
.robot-photo-upload { padding:9px 11px; border:1px solid #cbaeb9; border-radius:10px; color:#8f1238; font-size:10px; font-weight:800; cursor:pointer; text-align:center; }
.robot-photo-upload input { display:none; }
.robot-photo-upload.disabled { opacity:.5; cursor:wait; }
.participant-lower-grid { display:grid; grid-template-columns:1.2fr .8fr; gap:14px; }
.participant-empty-onboarding { padding:28px; border:1px solid #eadde3; border-radius:18px; background:#fff; }
.participant-empty-onboarding h2 { margin:4px 0 8px; }
.participant-onboarding-actions { display:flex; gap:10px; margin-top:18px; }
.join-team-dialog,.join-team-results { display:grid; gap:10px; }
.join-team-option { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px; border:1px solid #e5d9df; border-radius:11px; background:#fff; text-align:left; cursor:pointer; }
.join-team-option span { display:grid; gap:2px; }
.join-team-option small { color:#82757c; }
.join-team-option.selected { border-color:#9f0f3b; background:#fff4f7; }
.join-team-option b { color:#9f0f3b; font-size:10px; }
@media (max-width:1050px) { .participant-summary-grid,.participation-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .robot-gallery,.participant-lower-grid { grid-template-columns:1fr; } }
@media (max-width:680px) { .participant-summary-grid,.participation-grid { grid-template-columns:1fr; } .participant-section-heading,.take-progress-copy { align-items:flex-start; flex-direction:column; } .robot-gallery-card { grid-template-columns:82px 1fr; } .robot-gallery-image { width:82px; height:70px; } .robot-photo-upload { grid-column:1 / -1; } .participant-performance { grid-template-columns:1fr; } .participant-take-row { grid-template-columns:1fr 1fr; } }

.participant-section-actions { display:flex; align-items:center; gap:12px; }
.participant-registration-pending-banner { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 18px; border:1px solid #ead6bf; border-radius:13px; background:#fffaf2; }
.participant-registration-pending-banner > div { display:grid; gap:3px; }
.participant-registration-pending-banner strong { color:#7d4c13; font-size:14px; }
.participant-registration-pending-banner span { color:#6f5d49; font-size:13px; line-height:1.4; }
.registration-status-cell { display:grid; gap:5px; justify-items:start; }
.registration-status-cell small { color:#8a735e; font-size:10px; line-height:1.25; }
.registration-flow-dialog { display:grid; gap:14px; }
.registration-competitors-block { display:grid; gap:10px; }
.registration-competitors-copy { display:grid; gap:3px; }
.registration-competitors-copy span { color:#786a71; font-size:12px; line-height:1.4; }
.registration-competitor-options { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
.registration-competitor-options .el-checkbox { margin:0; height:auto; padding:10px 12px; }
.registration-competitor-options .el-checkbox__label { display:grid; gap:2px; }
.registration-competitor-options small { color:#81737a; font-size:10px; }
.participant-champion-card { border-color:#c9952f; box-shadow:0 12px 34px rgba(151,103,13,.12); }
.participant-champion-banner { display:grid; gap:2px; padding:14px 16px; border-radius:14px; background:linear-gradient(135deg,#fff8dc,#fff3b7); border:1px solid #e3c46e; }
.participant-champion-banner span { color:#7f5a00; font-size:12px; font-weight:950; letter-spacing:.14em; }
.participant-champion-banner strong { color:#3d2b00; font-size:22px; }
.participant-champion-banner small { color:#765d1b; }

.participant-invite-stack { display:grid; gap:10px; }
.participant-invite-card { display:flex; align-items:center; justify-content:space-between; gap:18px; padding:16px 18px; border:1px solid #dcc5cf; border-radius:15px; background:#fff7fa; }
.participant-invite-card h3 { margin:3px 0; color:#33252c; }
.participant-invite-card p,.participant-invite-card small { margin:0; color:#786970; }
.participant-invite-actions { display:flex; gap:8px; flex-wrap:wrap; }
.participant-join-requests { display:grid; gap:8px; margin:0 14px 12px; padding:12px; border-radius:12px; background:#faf6f8; border:1px solid #eadde3; }
.participant-join-request { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:9px 0; border-top:1px solid #eee2e7; }
.participant-join-request:first-of-type { border-top:0; }
.participant-join-request > div:first-child { display:grid; gap:2px; }
.participant-join-request small { color:#82747b; }
.participant-flow-note { display:grid; gap:4px; padding:11px 13px; border-radius:11px; background:#faf6f8; border:1px solid #eadde3; }
.participant-flow-note span { color:#786a71; font-size:12px; line-height:1.4; }
.participant-bracket-action { display:flex; width:100%; min-height:38px; align-items:center; justify-content:space-between; gap:8px; padding:0 12px; border:1px solid #cbaeb9; border-radius:10px; background:#fff7fa; color:#8f1238; font:inherit; font-size:11px; font-weight:900; cursor:pointer; transition:transform .15s ease,box-shadow .15s ease; }
.participant-bracket-action:hover { transform:translateY(-1px); box-shadow:0 8px 18px rgba(143,18,56,.09); }
.participant-bracket-dialog-copy { display:grid; gap:3px; margin-bottom:12px; padding:11px 13px; border-radius:11px; background:#faf6f8; border:1px solid #eadde3; }
.participant-bracket-dialog-copy strong { color:#4c3942; }
.participant-bracket-dialog-copy span { color:#786a71; font-size:12px; line-height:1.4; }
@media (max-width:680px) { .participant-invite-card,.participant-join-request { align-items:flex-start; flex-direction:column; } .participant-section-actions { align-items:flex-start; flex-direction:column; } .registration-competitor-options { grid-template-columns:1fr; } .participant-heading-identity { gap:12px; } .participant-team-logo { flex-basis:68px; width:68px; height:68px; border-radius:15px; } }

.robot-gallery-actions { display:grid; gap:8px; justify-items:stretch; }
.robot-responsible-summary { display:grid; gap:2px; margin-top:5px; }
.robot-responsible-summary b { color:#67535d; font-size:10px; text-transform:uppercase; letter-spacing:.05em; }
.robot-responsible-summary span { color:#7b6d74; font-size:11px; }
.robot-responsible-dialog { display:grid; gap:14px; }
.robot-responsible-options { display:grid; grid-template-columns:1fr; gap:8px; }
.robot-responsible-options .el-checkbox { margin:0; height:auto; padding:10px 12px; }
.robot-responsible-options .el-checkbox__label { display:grid; gap:2px; }
.robot-responsible-options small { color:#81737a; font-size:10px; }
</style>
