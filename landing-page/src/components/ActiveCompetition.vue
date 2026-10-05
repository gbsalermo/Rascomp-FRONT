<script setup lang="ts">
import { computed, ref } from 'vue'
import { assetUrl } from '../api'

const props = defineProps<{
  competition?: any
  teams: any[]
  categories: any[]
  registrations: any[]
  ranking: any[]
  followAttempts: any[]
  followSchedules: any[]
  followQueue: any[]
  brackets: any[]
  matches: any[]
  results: any[]
  followCategoryId?: number
  bracketId?: number
  loading?: boolean
  managementUrl: string
}>()

const emit = defineEmits<{
  (event: 'update:followCategoryId', value: number): void
  (event: 'update:bracketId', value: number): void
  (event: 'registrationUnavailable'): void
}>()

const showAllTeams = ref(false)
const showFullRanking = ref(false)
const showFullBracket = ref(false)

const publicCompetitionStatuses = ['INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO']

const competitionPublicVisible = computed(() =>
  publicCompetitionStatuses.includes(props.competition?.status)
)

const competitionStageLabel = computed(() => {
  if (props.competition?.status === 'INSCRICOES_ABERTAS') return 'Inscrições abertas'
  if (props.competition?.status === 'INSCRICOES_ENCERRADAS') return 'Inscrições encerradas · preparação'
  return 'Competição em andamento'
})

const approvedRegistrations = computed(() =>
  props.registrations.filter((item) => item.status === 'APROVADA')
)

const registrationCategoryIds = computed(() =>
  new Set(props.registrations.map((item) => item.categoryId).filter(Boolean))
)

const competitionCategories = computed(() =>
  props.categories.filter(
    (item) =>
      item.competitionId === props.competition?.id ||
      registrationCategoryIds.value.has(item.id)
  )
)

const followCategories = computed(() =>
  competitionCategories.value.filter((item) => item.modalidade === 'FOLLOW_LINE')
)

const uniqueRobots = computed(() =>
  new Set(approvedRegistrations.value.map((item) => item.robotId).filter(Boolean)).size
)

const currentBracket = computed(
  () => props.brackets.find((item) => item.id === props.bracketId) || props.brackets[0]
)

const sortedMatches = computed(() =>
  [...props.matches].sort((a, b) => {
    if (a.dataHora && b.dataHora) {
      return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    }
    if (a.dataHora) return -1
    if (b.dataHora) return 1
    const roundDiff = Number(a.rodada || 0) - Number(b.rodada || 0)
    return roundDiff || Number(a.ordem || 0) - Number(b.ordem || 0)
  })
)

const liveMatch = computed(() =>
  sortedMatches.value.find((item) => item.status === 'EM_ANDAMENTO')
)

const nextMatch = computed(() =>
  sortedMatches.value.find((item) =>
    ['AGENDADA', 'AGUARDANDO_PARTICIPANTES'].includes(item.status)
  )
)

const latestResult = computed(() => props.results.at(-1))
const rankingRows = computed(() => props.ranking.slice(0, showFullRanking.value ? 12 : 5))

const followCurrentSchedule = computed(() =>
  props.followSchedules.find((item) => item.status === 'EM_ANDAMENTO') ||
  props.followSchedules.find((item) => item.status === 'EM_CHAMADA')
)

const followNextSchedule = computed(() =>
  props.followSchedules.find((item) =>
    ['AGENDADA', 'EM_CHAMADA'].includes(item.status) &&
    item.id !== followCurrentSchedule.value?.id
  ) ||
  props.followSchedules.find((item) => item.status === 'AGENDADA')
)

const followCurrentEntry = computed(() =>
  props.followQueue.find((item) => item.status === 'EM_EXECUCAO') ||
  props.followQueue.find((item) => item.status === 'EM_APRESENTACAO') ||
  props.followQueue.find((item) => item.status === 'CONVOCADA')
)

const followNextEntry = computed(() =>
  props.followQueue.find((item) =>
    ['AGUARDANDO', 'CONVOCADA'].includes(item.status) &&
    item.id !== followCurrentEntry.value?.id
  )
)

const followTotalTakes = computed(() => {
  const scheduled = props.followSchedules.map((item) => Number(item.tomada || 0))
  const attempted = props.followAttempts.map((item) => Number(item.tomada || 0))
  return Math.max(0, ...scheduled, ...attempted)
})

function completedTakesFor(registrationId: number) {
  return new Set(
    props.followAttempts
      .filter((item) => Number(item.registrationId) === Number(registrationId))
      .filter((item) => item.concluida || item.tempoFinalSegundos != null)
      .map((item) => Number(item.tomada))
  ).size
}

function attemptsFor(registrationId: number) {
  return props.followAttempts.filter(
    (item) => Number(item.registrationId) === Number(registrationId)
  ).length
}

function rankingLayer(index: number) {
  return index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'standard'
}

const bracketRounds = computed(() => {
  const grouped = new Map<number, any[]>()

  props.matches
    .filter((match) => match.tipoPartida !== 'TERCEIRO_LUGAR')
    .forEach((match) => {
      const round = Number(match.rodada || 1)
      if (!grouped.has(round)) grouped.set(round, [])
      grouped.get(round)?.push(match)
    })

  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .map(([round, roundMatches]) => [
      round,
      [...roundMatches].sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
    ] as const)
})

const bracketMaxRound = computed(() =>
  Math.max(0, ...bracketRounds.value.map(([round]) => Number(round)))
)

function bracketRoundLabel(round: number) {
  const remaining = bracketMaxRound.value - round
  if (remaining === 0) return 'Final'
  if (remaining === 1) return 'Semifinal'
  if (remaining === 2) return 'Quartas de final'
  if (remaining === 3) return 'Oitavas de final'
  return `Rodada ${round}`
}

function resultFor(matchId: number) {
  return props.results.find((item) => Number(item.matchId) === Number(matchId))
}

function isWinner(match: any, registrationId?: number) {
  const result = resultFor(match.id)
  return Boolean(result?.winnerRegistrationId && Number(result.winnerRegistrationId) === Number(registrationId))
}

function isByeAdvance(match: any) {
  const participants = Number(Boolean(match.registrationAId)) + Number(Boolean(match.registrationBId))
  return participants === 1 && match.status === 'FINALIZADA' && !resultFor(match.id)
}

function matchStatusLabel(match: any) {
  if (isByeAdvance(match)) return 'BYE'
  return ({
    EM_ANDAMENTO: 'Ao vivo',
    FINALIZADA: 'Finalizada',
    AGENDADA: 'Agendada',
    AGUARDANDO_PARTICIPANTES: 'Aguardando',
    CANCELADA: 'Cancelada'
  } as Record<string, string>)[match.status] || String(match.status || 'Aguardando')
}

function bracketTabLabel(bracket: any) {
  const name = String(bracket.categoryNome || bracket.nome || 'Categoria')
  return name
    .replace(/^DEMO\s*·\s*/i, '')
    .replace(/\s*·\s*BYEs$/i, '')
}

const participatingTeams = computed(() => {
  const teamMap = new Map<string, any>()

  approvedRegistrations.value.forEach((registration) => {
    const teamId = registration.teamId ?? registration.equipeId
    const teamFromApi = props.teams.find((team) => Number(team.id) === Number(teamId))
    const key = String(teamId ?? registration.teamNome ?? registration.equipeNome ?? 'equipe')

    const current = teamMap.get(key) || {
      id: teamId,
      nome:
        teamFromApi?.nome ||
        registration.teamNome ||
        registration.equipeNome ||
        'Equipe participante',
      institutionSigla:
        teamFromApi?.institutionSigla ||
        registration.institutionSigla ||
        registration.instituicaoSigla ||
        '',
      institutionNome:
        teamFromApi?.institutionNome ||
        registration.institutionNome ||
        registration.instituicaoNome ||
        '',
      robotIds: new Set<number>(),
      categoryIds: new Set<number>(),
      raw: teamFromApi || registration
    }

    if (registration.robotId) current.robotIds.add(registration.robotId)
    if (registration.categoryId) current.categoryIds.add(registration.categoryId)

    teamMap.set(key, current)
  })

  return [...teamMap.values()].map((team) => ({
    ...team,
    robotCount: team.robotIds.size,
    categoryCount: team.categoryIds.size
  }))
})

const visibleTeams = computed(() =>
  participatingTeams.value.slice(0, showAllTeams.value ? participatingTeams.value.length : 6)
)

const categoryCards = computed(() =>
  competitionCategories.value.map((category) => {
    const registrations = approvedRegistrations.value.filter(
      (item) => Number(item.categoryId) === Number(category.id)
    )

    const name = String(category.nome || '').toLocaleLowerCase('pt-BR')
    const isFollow = category.modalidade === 'FOLLOW_LINE' || name.includes('follow') || name.includes('linha')
    const isHockey = name.includes('hockey')
    const isMini = name.includes('mini')

    let activity = registrations.length
      ? `${registrations.length} robô${registrations.length === 1 ? '' : 's'} inscrito${registrations.length === 1 ? '' : 's'}`
      : 'Aguardando participantes'

    let state = 'Aguardando'

    if (props.competition?.status === 'INSCRICOES_ABERTAS') {
      state = registrations.length ? 'Inscrições' : 'Aberta'
    } else if (props.competition?.status === 'INSCRICOES_ENCERRADAS') {
      state = 'Preparação'
    } else if (registrations.length) {
      state = 'Em disputa'
    }

    if (isFollow && props.ranking[0]) {
      activity = `${props.ranking[0].robotNome || 'Líder'} · ${formatSeconds(props.ranking[0].tempoFinalSegundos)}`
      state = 'Ranking ativo'
    }

    if (
      Number(currentBracket.value?.categoryId) === Number(category.id) &&
      liveMatch.value
    ) {
      activity = `${liveMatch.value.robotANome || 'A definir'} × ${liveMatch.value.robotBNome || 'A definir'}`
      state = 'Ao vivo'
    }

    return {
      ...category,
      registrations: registrations.length,
      activity,
      state,
      icon: isFollow ? 'follow' : isHockey ? 'hockey' : isMini ? 'mini' : 'sumo'
    }
  })
)

const canRegister = computed(() => {
  const competition = props.competition
  if (!competition || competition.status !== 'INSCRICOES_ABERTAS') return false

  const today = new Date()
  const start = competition.inicioInscricoes
    ? new Date(`${competition.inicioInscricoes}T00:00:00`)
    : undefined
  const end = competition.fimInscricoes
    ? new Date(`${competition.fimInscricoes}T23:59:59`)
    : undefined

  return (!start || today >= start) && (!end || today <= end)
})

const registrationLabel = computed(() => {
  if (canRegister.value) return 'Inscrições abertas'
  if (props.competition?.status === 'INSCRICOES_ENCERRADAS') return 'Inscrições encerradas'
  if (props.competition?.status === 'EM_ANDAMENTO') return 'Inscrições encerradas'
  return 'Inscrições indisponíveis'
})

const registrationDescription = computed(() => {
  if (canRegister.value) return 'Você ainda pode participar desta edição.'
  if (props.competition?.status === 'INSCRICOES_ENCERRADAS') {
    return 'O período de inscrições terminou e a organização está preparando a competição.'
  }
  if (props.competition?.status === 'EM_ANDAMENTO') {
    return 'A competição já está em andamento e a janela de inscrições foi encerrada.'
  }
  return 'Não estamos no período de inscrições no momento.'
})

const liveHeadline = computed(() => {
  if (liveMatch.value) return 'Partida acontecendo agora'
  if (nextMatch.value) return 'Próxima disputa'
  if (props.ranking[0]) return 'Ranking sendo atualizado'
  if (props.competition?.status === 'INSCRICOES_ABERTAS') return 'Inscrições abertas'
  if (props.competition?.status === 'INSCRICOES_ENCERRADAS') return 'Preparação da competição'
  return 'Aguardando atualização oficial'
})

const liveDescription = computed(() => {
  const match = liveMatch.value || nextMatch.value

  if (match) {
    return `${match.robotANome || 'A definir'} × ${match.robotBNome || 'A definir'}`
  }

  if (props.ranking[0]) {
    return `${props.ranking[0].robotNome || 'Robô líder'} está na liderança do Follow Line.`
  }

  if (props.competition?.status === 'INSCRICOES_ABERTAS') {
    return 'Equipes e robôs estão entrando na competição. As disputas aparecerão aqui quando a organização iniciar o evento.'
  }

  if (props.competition?.status === 'INSCRICOES_ENCERRADAS') {
    return 'As inscrições foram encerradas. A organização está consolidando participantes, categorias e chaveamentos.'
  }

  return 'Assim que uma partida, tomada ou resultado for publicado, ele aparecerá aqui.'
})

function teamLogoRaw(team: any) {
  return (
    team?.raw?.logoUrl ||
    team?.raw?.teamLogoUrl ||
    team?.raw?.equipeLogoUrl ||
    team?.raw?.logo ||
    team?.raw?.imagemUrl ||
    team?.raw?.fotoUrl ||
    ''
  )
}

function teamHasLogo(team: any) {
  return Boolean(teamLogoRaw(team))
}

function teamLogoSource(team: any) {
  const raw = teamLogoRaw(team)
  return raw ? assetUrl(raw) : ''
}

function categoryName(categoryId?: number) {
  return (
    competitionCategories.value.find((item) => Number(item.id) === Number(categoryId))?.nome ||
    currentBracket.value?.categoryNome ||
    'Categoria'
  )
}

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(2)} s`
}

function formatDate(value?: string) {
  if (!value) return 'Data a definir'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function formatDateTime(value?: string) {
  if (!value) return 'Horário a definir'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function selectFollowCategory(event: Event) {
  emit('update:followCategoryId', Number((event.target as HTMLSelectElement).value))
}

function selectBracket(event: Event) {
  emit('update:bracketId', Number((event.target as HTMLSelectElement).value))
}

function chooseBracket(id: number) {
  emit('update:bracketId', id)
}

function handleRegistration() {
  if (canRegister.value && props.managementUrl) {
    window.location.href = props.managementUrl
    return
  }

  emit('registrationUnavailable')
}
</script>


<template>
  <section
    v-if="competitionPublicVisible"
    id="competicao-atual"
    class="active-competition-section"
  >
    <div class="active-competition-container">
      <section class="competition-event-intro">
        <div class="competition-event-intro-copy">
          <span class="competition-event-kicker">Competição vigente</span>
          <h2>Sobre o evento</h2>
          <p>
            {{
              competition.descricao ||
              'Conheça a competição vigente da IEEE RAS UFRB, suas equipes participantes, categorias e atualizações oficiais.'
            }}
          </p>

          <div class="competition-event-meta">
            <article>
              <span>Período do evento</span>
              <strong>{{ formatDate(competition.dataInicio) }} — {{ formatDate(competition.dataFim) }}</strong>
            </article>

            <article>
              <span>Período de inscrições</span>
              <strong>{{ formatDate(competition.inicioInscricoes) }} — {{ formatDate(competition.fimInscricoes) }}</strong>
            </article>

            <article>
              <span>Equipes cadastradas</span>
              <strong>{{ participatingTeams.length }} equipe{{ participatingTeams.length === 1 ? '' : 's' }}</strong>
            </article>
          </div>
        </div>

        <aside class="competition-event-identity">
          <span>{{ competitionStageLabel }}</span>
          <strong>{{ competition.nome }}</strong>
          <small>
            {{ competitionCategories.length }} categoria{{ competitionCategories.length === 1 ? '' : 's' }} nesta edição
          </small>
        </aside>
      </section>

      <div class="competition-content-heading">
        <span>Participantes e categorias</span>
        <h3>Acompanhe a competição vigente</h3>
        <p>Conheça as equipes, veja as categorias e acompanhe as atualizações oficiais desta edição.</p>
      </div>

      <div class="competition-public-grid" :class="{ loading }">
        <section class="competition-public-card competition-teams-card">
          <header class="competition-public-card-heading">
            <div>
              <span class="competition-card-icon purple" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="8" cy="8" r="3"/>
                  <circle cx="16" cy="8" r="3"/>
                  <path d="M2 21c0-4 2.6-7 6-7s6 3 6 7M12 15c1-.7 2.3-1 4-1 3.4 0 6 3 6 7"/>
                </svg>
              </span>
              <div>
                <span class="competition-card-eyebrow">Participantes</span>
                <h3>Quem está competindo?</h3>
                <p>Equipes com inscrições aprovadas nesta competição.</p>
              </div>
            </div>

            <span class="competition-count-badge">{{ participatingTeams.length }} equipe{{ participatingTeams.length === 1 ? '' : 's' }}</span>
          </header>

          <div v-if="visibleTeams.length" class="competition-team-grid">
            <article v-for="team in visibleTeams" :key="team.id || team.nome" class="competition-team-card">
              <div class="competition-team-logo">
                <img
                  :src="teamLogoSource(team)"
                  :alt="`Logo da equipe ${team.nome}`"
                  :class="{ generic: teamLogoSource(team) === '/rascomp-logo.webp' }"
                />
              </div>

              <div class="competition-team-copy">
                <strong>{{ team.nome }}</strong>
                <small>{{ team.institutionSigla || team.institutionNome || 'Instituição não informada' }}</small>
                <div class="competition-team-tags">
                  <span>{{ team.robotCount }} robô{{ team.robotCount === 1 ? '' : 's' }}</span>
                  <span>{{ team.categoryCount }} categoria{{ team.categoryCount === 1 ? '' : 's' }}</span>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="competition-public-empty">
            <strong>As equipes aparecerão aqui após a aprovação.</strong>
            <span>A organização ainda não publicou participantes aprovados nesta edição.</span>
          </div>

          <button
            v-if="participatingTeams.length > 6"
            type="button"
            class="competition-inline-action"
            @click="showAllTeams = !showAllTeams"
          >
            {{ showAllTeams ? 'Mostrar menos equipes' : 'Ver todas as equipes' }}
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <section class="competition-public-card competition-categories-card">
          <header class="competition-public-card-heading">
            <div>
              <span class="competition-card-icon red" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 4h8v4c0 3-2 5-4 5s-4-2-4-5V4Z"/>
                  <path d="M6 5H3v2c0 3 2 5 5 5M18 5h3v2c0 3-2 5-5 5M12 13v4M8 21h8M10 17h4"/>
                </svg>
              </span>
              <div>
                <span class="competition-card-eyebrow">Modalidades</span>
                <h3>Categorias da competição</h3>
                <p>Veja onde os robôs estão inscritos e o estágio de cada categoria.</p>
              </div>
            </div>
          </header>

          <div class="competition-category-list">
            <article
              v-for="category in categoryCards"
              :key="category.id"
              :class="{ 'is-live': category.state === 'Ao vivo' }"
            >
              <span class="competition-category-icon" aria-hidden="true">
                <svg v-if="category.icon === 'follow'" viewBox="0 0 24 24">
                  <path d="M3 13c3-7 6 7 9 0s6 7 9 0"/>
                </svg>
                <svg v-else-if="category.icon === 'hockey'" viewBox="0 0 24 24">
                  <path d="M7 3v12l5 5M17 3v12l-5 5"/>
                  <path d="M8 12h8"/>
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <rect x="5" y="7" width="14" height="10" rx="2"/>
                  <path d="M9 3v4M15 3v4M8 12h.01M16 12h.01M9 17v3M15 17v3"/>
                </svg>
              </span>

              <div>
                <strong>{{ category.nome }}</strong>
                <small>{{ category.activity }}</small>
              </div>

              <em :class="{ live: category.state === 'Ao vivo' }">
                {{ category.state }}
              </em>
            </article>

            <div v-if="!categoryCards.length" class="competition-public-empty">
              <strong>Categorias ainda não publicadas.</strong>
              <span>Assim que a organização configurar as modalidades, elas aparecerão aqui.</span>
            </div>
          </div>
        </section>

        <section class="competition-public-card competition-live-card">
          <header class="competition-public-card-heading competition-live-heading">
            <div>
              <span class="competition-card-icon live" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 8a6 6 0 0 0 0 8M19 8a6 6 0 0 1 0 8M2 5a10 10 0 0 0 0 14M22 5a10 10 0 0 1 0 14"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </span>
              <div>
                <span class="competition-card-eyebrow">Acompanhamento</span>
                <h3>O que está acontecendo agora?</h3>
                <p>O estado mais recente publicado oficialmente pela organização.</p>
              </div>
            </div>

            <span v-if="liveMatch" class="competition-live-badge">
              <i aria-hidden="true" /> AO VIVO
            </span>
            <span v-else class="competition-stage-badge">{{ competitionStageLabel }}</span>
          </header>

          <div class="competition-live-summary">
            <article class="competition-live-main">
              <span class="competition-live-main-kicker">
                {{ liveMatch ? categoryName(currentBracket?.categoryId) : nextMatch ? 'Próxima disputa' : 'Status desta edição' }}
              </span>
              <h4>{{ liveHeadline }}</h4>
              <strong>{{ liveDescription }}</strong>
              <span v-if="liveMatch || nextMatch" class="competition-live-date">
                {{ formatDateTime((liveMatch || nextMatch)?.dataHora) }}
              </span>
            </article>

            <article class="competition-live-stat">
              <span>Follow Line</span>
              <strong v-if="ranking[0]">{{ ranking[0].robotNome || 'Líder atual' }}</strong>
              <strong v-else>Aguardando ranking</strong>
              <small v-if="ranking[0]">{{ formatSeconds(ranking[0].tempoFinalSegundos) }}</small>
              <small v-else>Resultados aparecem quando as tomadas começarem.</small>
            </article>

            <article class="competition-live-stat">
              <span>Último resultado</span>
              <strong v-if="latestResult">{{ latestResult.winnerRobotNome || 'Resultado publicado' }}</strong>
              <strong v-else>Aguardando resultado</strong>
              <small>{{ latestResult ? 'Resultado oficial publicado' : 'Nenhum confronto finalizado ainda.' }}</small>
            </article>
          </div>

          <div
            v-if="competition?.status === 'EM_ANDAMENTO' || ranking.length || brackets.length"
            class="competition-live-actions"
          >
            <button type="button" @click="showFullRanking = !showFullRanking">
              {{ showFullRanking ? 'Ocultar ranking' : 'Ver ranking Follow Line' }}
            </button>
            <button type="button" @click="showFullBracket = !showFullBracket">
              {{ showFullBracket ? 'Ocultar chave' : 'Ver chave / confrontos' }}
            </button>
          </div>

          <div v-if="showFullRanking" id="resultados" class="competition-detail-panel">
            <div class="competition-detail-panel-heading">
              <strong>Ranking Follow Line</strong>

              <select
                v-if="followCategories.length > 1"
                :value="followCategoryId"
                aria-label="Categoria Follow Line"
                @change="selectFollowCategory"
              >
                <option v-for="item in followCategories" :key="item.id" :value="item.id">
                  {{ item.nome }}
                </option>
              </select>
            </div>

            <div class="competition-ranking-preview">
              <article v-for="(item, index) in rankingRows" :key="item.registrationId">
                <b>{{ item.posicao || index + 1 }}</b>
                <div>
                  <strong>{{ item.robotNome || `Inscrição #${item.registrationId}` }}</strong>
                  <small>{{ item.teamNome }}</small>
                </div>
                <em>{{ formatSeconds(item.tempoFinalSegundos) }}</em>
              </article>

              <div v-if="!rankingRows.length" class="competition-public-empty">
                <strong>Ranking ainda não iniciado.</strong>
                <span>As classificações aparecerão quando as tomadas oficiais forem registradas.</span>
              </div>
            </div>
          </div>

          <div v-if="showFullBracket" id="chaveamento" class="competition-detail-panel">
            <div class="competition-detail-panel-heading">
              <strong>Chaveamento</strong>

              <select
                v-if="brackets.length > 1"
                :value="bracketId"
                aria-label="Chave competitiva"
                @change="selectBracket"
              >
                <option v-for="item in brackets" :key="item.id" :value="item.id">
                  {{ item.nome }}
                </option>
              </select>
            </div>

            <div class="competition-mini-bracket">
              <section v-for="([round, roundMatches]) in bracketRounds" :key="round">
                <strong>Rodada {{ round }}</strong>
                <span v-for="match in roundMatches" :key="match.id">
                  {{ match.robotANome || 'A definir' }} × {{ match.robotBNome || 'A definir' }}
                </span>
              </section>

              <div v-if="!bracketRounds.length" class="competition-public-empty">
                <strong>Chave ainda não publicada.</strong>
                <span>A organização publicará os confrontos quando estiverem definidos.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
