<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  competition?: any
  competitions: any[]
  categories: any[]
  registrations: any[]
  ranking: any[]
  brackets: any[]
  matches: any[]
  results: any[]
  followCategoryId?: number
  bracketId?: number
  loading?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:competitionId', value: number): void
  (event: 'update:followCategoryId', value: number): void
  (event: 'update:bracketId', value: number): void
}>()

const showFullRanking = ref(false)
const showFullBracket = ref(false)

const activeCompetitions = computed(() => props.competitions.filter((item) => item.status === 'EM_ANDAMENTO'))
const approvedRegistrations = computed(() => props.registrations.filter((item) => item.status === 'APROVADA'))
const registrationCategoryIds = computed(() => new Set(props.registrations.map((item) => item.categoryId)))

const competitionCategories = computed(() =>
  props.categories.filter(
    (item) => item.competitionId === props.competition?.id || registrationCategoryIds.value.has(item.id)
  )
)

const followCategories = computed(() => competitionCategories.value.filter((item) => item.modalidade === 'FOLLOW_LINE'))
const modalityCount = computed(() => new Set(competitionCategories.value.map((item) => item.modalidade).filter(Boolean)).size)
const uniqueTeams = computed(() => new Set(approvedRegistrations.value.map((item) => item.teamId).filter(Boolean)).size)
const uniqueRobots = computed(() => new Set(approvedRegistrations.value.map((item) => item.robotId).filter(Boolean)).size)
const currentBracket = computed(() => props.brackets.find((item) => item.id === props.bracketId) || props.brackets[0])

const sortedMatches = computed(() =>
  [...props.matches].sort((a, b) => {
    if (a.dataHora && b.dataHora) return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    if (a.dataHora) return -1
    if (b.dataHora) return 1
    const roundDiff = Number(a.rodada || 0) - Number(b.rodada || 0)
    return roundDiff || Number(a.ordem || 0) - Number(b.ordem || 0)
  })
)

const upcomingMatches = computed(() =>
  sortedMatches.value.filter((item) => ['EM_ANDAMENTO', 'AGENDADA', 'AGUARDANDO_PARTICIPANTES'].includes(item.status)).slice(0, 2)
)

const nextMatch = computed(() => upcomingMatches.value[0])
const latestResult = computed(() => props.results[props.results.length - 1])
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

const progressSteps = computed(() => {
  const hasBracket = props.brackets.length > 0
  const hasMatches = props.matches.length > 0
  const hasLiveOrPendingMatches = props.matches.some((item) => ['EM_ANDAMENTO', 'AGENDADA', 'AGUARDANDO_PARTICIPANTES'].includes(item.status))
  const bracketFinished = String(currentBracket.value?.status || '').toUpperCase() === 'FINALIZADO'

  return [
    { label: 'Inscrições', state: 'done' },
    { label: 'Inspeção', state: hasBracket ? 'done' : 'current' },
    { label: 'Chaves', state: hasBracket ? (hasMatches ? 'done' : 'current') : 'pending' },
    { label: 'Partidas', state: bracketFinished ? 'done' : hasLiveOrPendingMatches || hasMatches ? 'current' : 'pending' },
    { label: 'Finais', state: bracketFinished ? 'done' : 'pending' }
  ]
})

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(2)} s`
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

function statusLabel(value?: string) {
  return String(value || '').replaceAll('_', ' ')
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
</script>

<template>
  <section v-if="competition?.status === 'EM_ANDAMENTO'" id="competicao-atual" class="active-competition-section">
    <div class="active-competition-container">
      <header class="competition-simple-heading">
        <div>
          <span>Competição atual</span>
          <div class="competition-title-line">
            <h2>{{ competition.nome }}</h2>
            <strong class="competition-status-pill"><i aria-hidden="true" /> Em andamento</strong>
          </div>
          <p>{{ competition.descricao || 'Acompanhe os dados oficiais da competição gerenciada pelo RasComp.' }}</p>
        </div>

        <label v-if="activeCompetitions.length > 1" class="active-competition-switcher">
          <span>Outra competição ativa</span>
          <select :value="competition.id" @change="selectCompetition">
            <option v-for="item in activeCompetitions" :key="item.id" :value="item.id">{{ item.nome }}</option>
          </select>
        </label>
      </header>

      <div class="competition-simple-grid" :class="{ loading }">
        <article class="competition-overview-card">
          <header class="competition-card-heading">
            <span class="competition-card-icon purple" aria-hidden="true">▥</span>
            <h3>Panorama geral</h3>
          </header>

          <div class="competition-overview-metrics">
            <div><strong>{{ uniqueTeams }}</strong><span>Equipes</span></div>
            <div><strong>{{ uniqueRobots }}</strong><span>Robôs</span></div>
            <div><strong>{{ modalityCount }}</strong><span>Modalidades</span></div>
            <div><strong>{{ approvedRegistrations.length }}</strong><span>Inscrições aprovadas</span></div>
          </div>

          <div id="cronograma-competicao" class="competition-progress-track">
            <article v-for="step in progressSteps" :key="step.label" :class="`state-${step.state}`">
              <span>{{ step.state === 'done' ? '✓' : '' }}</span>
              <small>{{ step.label }}</small>
            </article>
          </div>

          <a class="competition-primary-cta" href="#competicao-atual">Acompanhar competição <span aria-hidden="true">→</span></a>
        </article>

        <article class="competition-modality-card follow-card">
          <header class="competition-card-heading with-action">
            <div>
              <span class="competition-card-icon purple" aria-hidden="true">⌁</span>
              <h3>Follow Line</h3>
            </div>

            <select v-if="followCategories.length > 1" :value="followCategoryId" aria-label="Categoria Follow Line" @change="selectFollowCategory">
              <option v-for="item in followCategories" :key="item.id" :value="item.id">{{ item.nome }}</option>
            </select>
          </header>

          <div class="follow-ranking-head"><span>Pos.</span><span>Robô</span><span>Tempo</span></div>
          <div class="follow-ranking-preview">
            <article v-for="(item, index) in rankingRows" :key="item.registrationId">
              <b>{{ item.posicao || index + 1 }}</b>
              <div><strong>{{ item.robotNome || `Inscrição #${item.registrationId}` }}</strong><small>{{ item.teamNome }}</small></div>
              <em>{{ formatSeconds(item.tempoFinalSegundos) }}</em>
            </article>
            <p v-if="!rankingRows.length" class="competition-simple-empty">Aguardando tentativas válidas.</p>
          </div>

          <button type="button" class="competition-text-action purple" @click="showFullRanking = !showFullRanking">
            {{ showFullRanking ? 'Ver resumo' : 'Ver ranking completo' }} <span aria-hidden="true">→</span>
          </button>
        </article>

        <article id="chaveamento" class="competition-modality-card sumo-card">
          <header class="competition-card-heading with-action">
            <div>
              <span class="competition-card-icon red" aria-hidden="true">⚙</span>
              <h3>Sumô</h3>
            </div>

            <select v-if="brackets.length > 1" :value="bracketId" aria-label="Chave de Sumô" @change="selectBracket">
              <option v-for="item in brackets" :key="item.id" :value="item.id">{{ item.nome }}</option>
            </select>
          </header>

          <span class="sumo-preview-label">Próximos confrontos</span>
          <div class="sumo-match-preview">
            <article v-for="match in upcomingMatches" :key="match.id">
              <strong>{{ match.robotANome || 'A definir' }}</strong>
              <b>×</b>
              <strong>{{ match.robotBNome || 'A definir' }}</strong>
              <em>{{ match.status === 'EM_ANDAMENTO' ? 'Agora' : 'Em breve' }}</em>
            </article>
            <p v-if="!upcomingMatches.length" class="competition-simple-empty">Nenhum confronto programado no momento.</p>
          </div>

          <button type="button" class="competition-text-action red" @click="showFullBracket = !showFullBracket">
            {{ showFullBracket ? 'Ocultar chave' : 'Ver chave completa' }} <span aria-hidden="true">→</span>
          </button>

          <div v-if="showFullBracket" class="competition-mini-bracket">
            <section v-for="([round, roundMatches]) in bracketRounds" :key="round">
              <strong>Rodada {{ round }}</strong>
              <span v-for="match in roundMatches" :key="match.id">{{ match.robotANome || 'A definir' }} × {{ match.robotBNome || 'A definir' }}</span>
            </section>
            <p v-if="!bracketRounds.length" class="competition-simple-empty">A chave oficial ainda não foi publicada.</p>
          </div>
        </article>
      </div>

      <section class="competition-highlights-strip">
        <header class="competition-card-heading">
          <span class="competition-card-icon purple light" aria-hidden="true">☆</span>
          <h3>Próximos destaques</h3>
        </header>

        <div class="competition-highlight-items">
          <article>
            <span class="highlight-symbol purple" aria-hidden="true">▣</span>
            <div><strong>Próxima partida</strong><p v-if="nextMatch">{{ formatDateTime(nextMatch.dataHora) }} · Sumô</p><p v-else>Aguardando programação</p></div>
          </article>

          <article>
            <span class="highlight-symbol red" aria-hidden="true">♛</span>
            <div><strong>Último resultado</strong><p v-if="latestResult">{{ latestResult.winnerRobotNome || 'Resultado publicado' }} venceu</p><p v-else>Aguardando resultado oficial</p></div>
          </article>

          <article id="resultados">
            <span class="highlight-symbol purple" aria-hidden="true">▥</span>
            <div><strong>Ranking Follow Line</strong><p v-if="ranking[0]">{{ ranking[0].robotNome }} · {{ formatSeconds(ranking[0].tempoFinalSegundos) }}</p><p v-else>Aguardando classificação</p></div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>