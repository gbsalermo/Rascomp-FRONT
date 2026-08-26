<script setup lang="ts">
import { computed, ref } from 'vue'

type CompetitionPanel = 'ao-vivo' | 'partidas' | 'chave' | 'ranking' | 'resultados'

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

const activePanel = ref<CompetitionPanel>('ao-vivo')

const activeCompetitions = computed(() => props.competitions.filter((item) => item.status === 'EM_ANDAMENTO'))
const approvedRegistrations = computed(() => props.registrations.filter((item) => item.status === 'APROVADA'))
const categoryIdsInCompetition = computed(() => new Set(props.registrations.map((item) => item.categoryId)))
const competitionCategories = computed(() =>
  props.categories.filter(
    (item) => item.competitionId === props.competition?.id || categoryIdsInCompetition.value.has(item.id)
  )
)
const followCategories = computed(() => competitionCategories.value.filter((item) => item.modalidade === 'FOLLOW_LINE'))
const uniqueTeams = computed(() => new Set(approvedRegistrations.value.map((item) => item.teamId).filter(Boolean)).size)
const uniqueRobots = computed(() => new Set(approvedRegistrations.value.map((item) => item.robotId).filter(Boolean)).size)
const currentBracket = computed(() => props.brackets.find((item) => item.id === props.bracketId) || props.brackets[0])

const sortedMatches = computed(() =>
  [...props.matches].sort((a, b) => {
    const roundDiff = Number(a.rodada || 0) - Number(b.rodada || 0)
    if (roundDiff !== 0) return roundDiff
    return Number(a.ordem || 0) - Number(b.ordem || 0)
  })
)

const liveMatch = computed(() => props.matches.find((item) => item.status === 'EM_ANDAMENTO'))
const nextMatch = computed(() => {
  if (liveMatch.value) return liveMatch.value

  const scheduled = props.matches
    .filter((item) => item.status === 'AGENDADA' || item.status === 'AGUARDANDO_PARTICIPANTES')
    .sort((a, b) => {
      if (!a.dataHora && !b.dataHora) return Number(a.ordem || 0) - Number(b.ordem || 0)
      if (!a.dataHora) return 1
      if (!b.dataHora) return -1
      return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    })

  return scheduled[0]
})

const recentResults = computed(() => [...props.results].slice(-4).reverse())
const rankingPreview = computed(() => props.ranking.slice(0, 8))

const rounds = computed(() => {
  const map = new Map<number, any[]>()
  sortedMatches.value.forEach((match) => {
    const round = Number(match.rodada || 1)
    if (!map.has(round)) map.set(round, [])
    map.get(round)?.push(match)
  })
  return [...map.entries()].sort(([a], [b]) => a - b)
})

const timeline = computed(() => [
  {
    title: 'Inscrições',
    meta: `${formatDate(props.competition?.inicioInscricoes)} — ${formatDate(props.competition?.fimInscricoes)}`,
    state: 'done'
  },
  {
    title: 'Homologação',
    meta: `${approvedRegistrations.value.length} inscrições aprovadas`,
    state: 'done'
  },
  {
    title: 'Chaves',
    meta: props.brackets.length ? `${props.brackets.length} chaveamento(s) publicado(s)` : 'Aguardando publicação',
    state: props.brackets.length ? 'done' : 'pending'
  },
  {
    title: 'Inspeção',
    meta: 'Controle operacional pelo RasComp',
    state: 'neutral'
  },
  {
    title: 'Disputas',
    meta: `${formatDate(props.competition?.dataInicio)} — ${formatDate(props.competition?.dataFim)}`,
    state: 'active'
  },
  {
    title: 'Finais',
    meta: `Programação até ${formatDate(props.competition?.dataFim)}`,
    state: 'pending'
  }
])

function formatDate(value?: string) {
  if (!value) return 'A definir'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date)
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

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(2)}s`
}

function resultForMatch(matchId: number) {
  return props.results.find((item) => item.matchId === matchId)
}

function matchForResult(matchId: number) {
  return props.matches.find((item) => item.id === matchId)
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
      <header class="active-competition-hero">
        <div class="active-competition-copy">
          <span class="competition-live-label"><i aria-hidden="true" /> Competição em andamento</span>
          <h2>{{ competition.nome }}</h2>
          <p>{{ competition.descricao || 'Acompanhe a competição oficial da RAS UFRB em tempo real.' }}</p>

          <div class="active-competition-period">
            <span>Evento</span>
            <strong>{{ formatDate(competition.dataInicio) }} — {{ formatDate(competition.dataFim) }}</strong>
          </div>
        </div>

        <div class="active-competition-actions">
          <label v-if="activeCompetitions.length > 1">
            <span>Competição ativa</span>
            <select :value="competition.id" @change="selectCompetition">
              <option v-for="item in activeCompetitions" :key="item.id" :value="item.id">{{ item.nome }}</option>
            </select>
          </label>
          <button type="button" @click="activePanel = 'ao-vivo'">Acompanhar agora <span aria-hidden="true">→</span></button>
        </div>
      </header>

      <div class="active-competition-metrics" :class="{ loading }">
        <article><strong>{{ approvedRegistrations.length }}</strong><span>inscrições aprovadas</span></article>
        <article><strong>{{ uniqueTeams }}</strong><span>equipes</span></article>
        <article><strong>{{ uniqueRobots }}</strong><span>robôs</span></article>
        <article><strong>{{ competitionCategories.length }}</strong><span>modalidades/categorias</span></article>
        <article><strong>{{ matches.length }}</strong><span>partidas na chave</span></article>
      </div>

      <section id="cronograma-competicao" class="competition-timeline-card">
        <div class="competition-window-title">
          <div>
            <span>Cronograma</span>
            <h3>Do início das inscrições às finais</h3>
          </div>
          <small>Datas específicas aparecem apenas quando existem no cadastro oficial.</small>
        </div>

        <div class="competition-timeline">
          <article v-for="item in timeline" :key="item.title" :class="`state-${item.state}`">
            <span class="timeline-dot" aria-hidden="true" />
            <strong>{{ item.title }}</strong>
            <small>{{ item.meta }}</small>
          </article>
        </div>
      </section>

      <section class="competition-follow-card">
        <div class="competition-follow-heading">
          <div>
            <span>Acompanhar</span>
            <h3>Competição em tempo real</h3>
            <p>Partidas, chaveamento, ranking e resultados publicados pelo RasComp.</p>
          </div>

          <div class="competition-context-selects">
            <label v-if="followCategories.length">
              <span>Follow Line</span>
              <select :value="followCategoryId" @change="selectFollowCategory">
                <option v-for="item in followCategories" :key="item.id" :value="item.id">{{ item.nome }}</option>
              </select>
            </label>
            <label v-if="brackets.length">
              <span>Chave</span>
              <select :value="bracketId" @change="selectBracket">
                <option v-for="item in brackets" :key="item.id" :value="item.id">{{ item.nome }}</option>
              </select>
            </label>
          </div>
        </div>

        <nav class="competition-follow-tabs" aria-label="Acompanhamento da competição">
          <button type="button" :class="{ active: activePanel === 'ao-vivo' }" @click="activePanel = 'ao-vivo'">Ao vivo</button>
          <button type="button" :class="{ active: activePanel === 'partidas' }" @click="activePanel = 'partidas'">Partidas</button>
          <button type="button" :class="{ active: activePanel === 'chave' }" @click="activePanel = 'chave'">Chave</button>
          <button type="button" :class="{ active: activePanel === 'ranking' }" @click="activePanel = 'ranking'">Ranking</button>
          <button type="button" :class="{ active: activePanel === 'resultados' }" @click="activePanel = 'resultados'">Resultados</button>
        </nav>

        <div v-if="activePanel === 'ao-vivo'" class="competition-live-grid">
          <article class="competition-live-main">
            <span>{{ liveMatch ? 'AGORA' : 'PRÓXIMA PARTIDA' }}</span>
            <template v-if="nextMatch">
              <small>{{ nextMatch.categoryNome || currentBracket?.categoryNome || 'Sumô' }} · Rodada {{ nextMatch.rodada }}</small>
              <div class="live-confrontation">
                <strong>{{ nextMatch.robotANome || 'A definir' }}</strong>
                <b>×</b>
                <strong>{{ nextMatch.robotBNome || 'A definir' }}</strong>
              </div>
              <p>{{ formatDateTime(nextMatch.dataHora) }}</p>
              <em>{{ statusLabel(nextMatch.status) }}</em>
            </template>
            <div v-else class="competition-empty-state">Nenhuma partida está programada no momento.</div>
          </article>

          <aside class="competition-live-side">
            <div>
              <span>Chave atual</span>
              <strong>{{ currentBracket?.nome || 'Ainda não publicada' }}</strong>
              <small>{{ statusLabel(currentBracket?.status) || 'Aguardando organização' }}</small>
            </div>
            <div>
              <span>Líder Follow Line</span>
              <strong>{{ rankingPreview[0]?.robotNome || 'Aguardando tentativas' }}</strong>
              <small v-if="rankingPreview[0]">{{ formatSeconds(rankingPreview[0].tempoFinalSegundos) }} · {{ rankingPreview[0].teamNome }}</small>
            </div>
            <div>
              <span>Resultados publicados</span>
              <strong>{{ results.length }}</strong>
              <small>Atualizados pela organização</small>
            </div>
          </aside>
        </div>

        <div v-else-if="activePanel === 'partidas'" class="competition-matches-list">
          <article v-for="match in sortedMatches.slice(0, 12)" :key="match.id">
            <div>
              <small>Rodada {{ match.rodada }} · Partida {{ match.ordem }}</small>
              <strong>{{ match.robotANome || 'A definir' }} <b>×</b> {{ match.robotBNome || 'A definir' }}</strong>
            </div>
            <span>{{ formatDateTime(match.dataHora) }}</span>
            <em>{{ statusLabel(match.status) }}</em>
          </article>
          <p v-if="!sortedMatches.length" class="competition-empty-state">As partidas aparecerão quando a chave for publicada.</p>
        </div>

        <div v-else-if="activePanel === 'chave'" id="chaveamento" class="competition-bracket-board">
          <div v-if="rounds.length" class="competition-bracket-rounds">
            <section v-for="([round, roundMatches]) in rounds" :key="round">
              <header>Rodada {{ round }}</header>
              <article v-for="match in roundMatches" :key="match.id">
                <span :class="{ winner: resultForMatch(match.id)?.winnerRegistrationId === match.registrationAId }">{{ match.robotANome || 'A definir' }}</span>
                <small>×</small>
                <span :class="{ winner: resultForMatch(match.id)?.winnerRegistrationId === match.registrationBId }">{{ match.robotBNome || 'A definir' }}</span>
              </article>
            </section>
          </div>
          <p v-else class="competition-empty-state">O chaveamento será exibido assim que a organização gerar a chave oficial.</p>
        </div>

        <div v-else-if="activePanel === 'ranking'" class="competition-ranking-list">
          <article v-for="(item, index) in rankingPreview" :key="item.registrationId" :class="{ podium: index < 3 }">
            <b>{{ item.posicao || index + 1 }}</b>
            <div><strong>{{ item.robotNome || `Inscrição #${item.registrationId}` }}</strong><span>{{ item.teamNome }}</span></div>
            <em>{{ formatSeconds(item.tempoFinalSegundos) }}</em>
          </article>
          <p v-if="!rankingPreview.length" class="competition-empty-state">O ranking aparecerá após as primeiras tentativas válidas.</p>
        </div>

        <div v-else id="resultados" class="competition-results-list">
          <article v-for="result in recentResults" :key="result.id">
            <span>Vencedor</span>
            <strong>{{ result.winnerRobotNome || 'Resultado publicado' }}</strong>
            <small>
              {{ matchForResult(result.matchId)?.robotANome || 'Participante A' }}
              {{ result.pontosA != null || result.pontosB != null ? `${result.pontosA ?? '—'} × ${result.pontosB ?? '—'}` : '×' }}
              {{ matchForResult(result.matchId)?.robotBNome || 'Participante B' }}
            </small>
          </article>
          <p v-if="!recentResults.length" class="competition-empty-state">Nenhum resultado oficial foi publicado ainda.</p>
        </div>
      </section>
    </div>
  </section>
</template>
