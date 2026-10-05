<script setup lang="ts">
import { computed, ref } from 'vue'
import { assetUrl } from '../api'

const props = defineProps<{
  competition?: any
  competitions: any[]
  teams: any[]
  categories: any[]
  registrations: any[]
  ranking: any[]
  brackets: any[]
  matches: any[]
  results: any[]
  followCategoryId?: number
  bracketId?: number
  loading?: boolean
  managementUrl: string
}>()

const emit = defineEmits<{
  (event: 'update:competitionId', value: number): void
  (event: 'update:followCategoryId', value: number): void
  (event: 'update:bracketId', value: number): void
  (event: 'registrationUnavailable'): void
}>()

const showAllTeams = ref(false)
const showFullRanking = ref(false)
const showFullBracket = ref(false)

const activeCompetitions = computed(() =>
  props.competitions.filter((item) => item.status === 'EM_ANDAMENTO')
)

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

const modalityCount = computed(() =>
  new Set(competitionCategories.value.map((item) => item.modalidade).filter(Boolean)).size
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
const rankingRows = computed(() => props.ranking.slice(0, showFullRanking.value ? 8 : 3))

const bracketRounds = computed(() => {
  const grouped = new Map<number, any[]>()

  props.matches.forEach((match) => {
    const round = Number(match.rodada || 1)
    if (!grouped.has(round)) grouped.set(round, [])
    grouped.get(round)?.push(match)
  })

  return [...grouped.entries()].sort(([a], [b]) => a - b)
})

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

    let state = registrations.length ? 'Em disputa' : 'Aguardando'

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
  if (props.competition?.status === 'EM_ANDAMENTO') return 'Inscrições encerradas'
  return 'Inscrições indisponíveis'
})

const liveHeadline = computed(() => {
  if (liveMatch.value) return 'Partida acontecendo agora'
  if (nextMatch.value) return 'Próxima disputa'
  if (props.ranking[0]) return 'Ranking sendo atualizado'
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

  return 'Assim que uma partida, tomada ou resultado for publicado, ele aparecerá aqui.'
})

function teamLogoSource(team: any) {
  const raw =
    team?.raw?.logoUrl ||
    team?.raw?.teamLogoUrl ||
    team?.raw?.equipeLogoUrl ||
    team?.raw?.logo ||
    team?.raw?.imagemUrl ||
    team?.raw?.fotoUrl

  return raw ? assetUrl(raw) : '/rascomp-logo.webp'
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

function selectCompetition(event: Event) {
  emit('update:competitionId', Number((event.target as HTMLSelectElement).value))
}

function selectFollowCategory(event: Event) {
  emit('update:followCategoryId', Number((event.target as HTMLSelectElement).value))
}

function selectBracket(event: Event) {
  emit('update:bracketId', Number((event.target as HTMLSelectElement).value))
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
    v-if="competition?.status === 'EM_ANDAMENTO'"
    id="competicao-atual"
    class="active-competition-section"
  >
    <div class="active-competition-container">
      <header class="competition-landing-heading">
        <div class="competition-heading-copy">
          <span class="competition-kicker">
            <i aria-hidden="true" />
            Competição em andamento
          </span>

          <div class="competition-heading-title">
            <h2>{{ competition.nome }}</h2>
            <strong>{{ competitionCategories.length }} categorias</strong>
          </div>

          <p>
            {{ competition.descricao || 'Acompanhe a competição, as equipes participantes, as categorias e as atualizações oficiais em tempo real.' }}
          </p>

          <div class="competition-heading-meta">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2"/>
                <path d="M7 3v4M17 3v4M3 10h18"/>
              </svg>
              {{ formatDate(competition.dataInicio) }} — {{ formatDate(competition.dataFim) }}
            </span>

            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="8" cy="8" r="3"/>
                <circle cx="16" cy="8" r="3"/>
                <path d="M2 21c0-4 2.6-7 6-7s6 3 6 7M12 15c1-.7 2.3-1 4-1 3.4 0 6 3 6 7"/>
              </svg>
              {{ participatingTeams.length }} equipes
            </span>

            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="3"/>
                <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M9 9h6v6H9z"/>
              </svg>
              {{ uniqueRobots }} robôs
            </span>
          </div>
        </div>

        <aside class="competition-registration-status" :class="{ open: canRegister }">
          <span class="competition-registration-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8 4h8v4c0 3-2 5-4 5s-4-2-4-5V4Z"/>
              <path d="M6 5H3v2c0 3 2 5 5 5M18 5h3v2c0 3-2 5-5 5M12 13v4M8 21h8M10 17h4"/>
            </svg>
          </span>

          <div>
            <small>Ainda posso me inscrever?</small>
            <strong>{{ registrationLabel }}</strong>
            <p v-if="canRegister">Você ainda pode participar desta edição.</p>
            <p v-else>A competição já está em andamento e a janela de inscrições foi encerrada.</p>
          </div>

          <button type="button" @click="handleRegistration">
            {{ canRegister ? 'Inscrever-se' : 'Ver situação' }}
          </button>
        </aside>
      </header>

      <label v-if="activeCompetitions.length > 1" class="active-competition-switcher">
        <span>Outra competição ativa</span>
        <select :value="competition.id" @change="selectCompetition">
          <option v-for="item in activeCompetitions" :key="item.id" :value="item.id">
            {{ item.nome }}
          </option>
        </select>
      </label>

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
                <h3>Quem está competindo?</h3>
                <p>Equipes com inscrições aprovadas nesta competição.</p>
              </div>
            </div>

            <span class="competition-count-badge">{{ participatingTeams.length }} equipes</span>
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
                <small>
                  {{ team.institutionSigla || team.institutionNome || 'Instituição não informada' }}
                </small>
                <span>
                  {{ team.robotCount }} robô{{ team.robotCount === 1 ? '' : 's' }}
                  ·
                  {{ team.categoryCount }} categoria{{ team.categoryCount === 1 ? '' : 's' }}
                </span>
              </div>
            </article>
          </div>

          <div v-else class="competition-public-empty">
            Nenhuma equipe aprovada foi publicada até o momento.
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
                <h3>Categorias</h3>
                <p>Veja onde os robôs estão competindo e o estado atual.</p>
              </div>
            </div>
          </header>

          <div class="competition-category-list">
            <article v-for="category in categoryCards" :key="category.id">
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

            <p v-if="!categoryCards.length" class="competition-public-empty">
              As categorias ainda não foram publicadas.
            </p>
          </div>
        </section>

        <section class="competition-public-card competition-live-card">
          <header class="competition-public-card-heading">
            <div>
              <span class="competition-card-icon live" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 8a6 6 0 0 0 0 8M19 8a6 6 0 0 1 0 8M2 5a10 10 0 0 0 0 14M22 5a10 10 0 0 1 0 14"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </span>
              <div>
                <h3>O que está acontecendo agora?</h3>
                <p>Acompanhe o estado mais recente publicado pela organização.</p>
              </div>
            </div>

            <span v-if="liveMatch" class="competition-live-badge">
              <i aria-hidden="true" /> AO VIVO
            </span>
          </header>

          <div class="competition-live-summary">
            <article class="competition-live-main">
              <small>
                {{ liveMatch ? categoryName(currentBracket?.categoryId) : nextMatch ? 'Próxima disputa' : 'Atualização da competição' }}
              </small>
              <h4>{{ liveHeadline }}</h4>
              <strong>{{ liveDescription }}</strong>
              <span v-if="liveMatch || nextMatch">
                {{ formatDateTime((liveMatch || nextMatch)?.dataHora) }}
              </span>
            </article>

            <article class="competition-live-stat">
              <span>Follow Line</span>
              <strong v-if="ranking[0]">{{ ranking[0].robotNome || 'Líder atual' }}</strong>
              <strong v-else>Aguardando ranking</strong>
              <small v-if="ranking[0]">{{ formatSeconds(ranking[0].tempoFinalSegundos) }}</small>
            </article>

            <article class="competition-live-stat">
              <span>Último resultado</span>
              <strong v-if="latestResult">{{ latestResult.winnerRobotNome || 'Resultado publicado' }}</strong>
              <strong v-else>Aguardando resultado</strong>
              <small>{{ latestResult ? 'Resultado oficial' : 'Sem resultado publicado' }}</small>
            </article>
          </div>

          <div class="competition-live-actions">
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

              <p v-if="!rankingRows.length" class="competition-public-empty">
                Ainda não há tentativas classificáveis.
              </p>
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

              <p v-if="!bracketRounds.length" class="competition-public-empty">
                A chave oficial ainda não foi publicada.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
