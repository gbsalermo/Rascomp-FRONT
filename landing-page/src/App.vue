<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { api } from './api'
import InstitutionalHeader from './components/InstitutionalHeader.vue'
import HighlightsHero from './components/HighlightsHero.vue'
import InstitutionalAbout from './components/InstitutionalAbout.vue'
import TeamRobotsAwards from './components/TeamRobotsAwards.vue'
import RobotsShowcase from './components/RobotsShowcase.vue'
import InstitutionalGallery from './components/InstitutionalGallery.vue'
import InstitutionalEvents from './components/InstitutionalEvents.vue'
import ActiveCompetition from './components/ActiveCompetition.vue'
import InstitutionalFooter from './components/InstitutionalFooter.vue'
import PublicNotFound from './components/PublicNotFound.vue'

const loading = ref(true)
const error = ref('')
const competitions = ref<any[]>([])
const teams = ref<any[]>([])
const categories = ref<any[]>([])
const registrations = ref<any[]>([])
const podiums = ref<any[]>([])
const ranking = ref<any[]>([])
const followAttempts = ref<any[]>([])
const followSchedules = ref<any[]>([])
const followQueue = ref<any[]>([])
const brackets = ref<any[]>([])
const matches = ref<any[]>([])
const results = ref<any[]>([])
const competitionId = ref<number>()
const followCategoryId = ref<number>()
const bracketId = ref<number>()
let timer: number | undefined
const managementUrl = String(import.meta.env.VITE_GESTAO_URL || (import.meta.env.DEV ? 'http://localhost:5173' : '')).trim()
const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isNotFound = normalizedPath !== '/' && normalizedPath !== '/index.html'

const currentCompetition = computed(() => competitions.value.find((item) => item.id === competitionId.value))
const publicCompetitionStatuses = ['INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO']
const registrationOpen = computed(() =>
  competitions.value.some((item) => item.status === 'INSCRICOES_ABERTAS')
)
const registrationNoticeVisible = ref(false)
let registrationNoticeTimer: number | undefined

function showRegistrationUnavailable() {
  registrationNoticeVisible.value = true

  if (registrationNoticeTimer) {
    window.clearTimeout(registrationNoticeTimer)
  }

  registrationNoticeTimer = window.setTimeout(() => {
    registrationNoticeVisible.value = false
  }, 4200)
}

function competitionFollowCategories() {
  const registrationCategoryIds = new Set(registrations.value.map((item) => item.categoryId))
  return categories.value.filter(
    (item) =>
      item.modalidade === 'FOLLOW_LINE' &&
      (item.competitionId === competitionId.value || registrationCategoryIds.has(item.id))
  )
}

async function bootstrap() {
  loading.value = true
  error.value = ''

  try {
    const [competitionList, teamList, categoryList] = await Promise.all([
      api.competitions(),
      api.teams(),
      api.categories()
    ])

    competitions.value = competitionList
    teams.value = teamList
    categories.value = categoryList

    const focus =
      competitionList.find(
        (item: any) => item.vigente === true && publicCompetitionStatuses.includes(item.status)
      ) ||
      competitionList.find((item: any) => item.status === 'EM_ANDAMENTO') ||
      competitionList.find((item: any) => item.status === 'INSCRICOES_ABERTAS') ||
      competitionList.find((item: any) => item.status === 'INSCRICOES_ENCERRADAS') ||
      competitionList[0]

    competitionId.value = focus?.id
    await refreshCompetition()
  } catch (exception: any) {
    error.value = exception?.response?.data?.message || 'A API pública do RASCOMP ainda não está disponível.'
  } finally {
    loading.value = false
  }
}

async function refreshCompetition() {
  if (!competitionId.value) {
    registrations.value = []
    podiums.value = []
    ranking.value = []
    followAttempts.value = []
    followSchedules.value = []
    followQueue.value = []
    brackets.value = []
    matches.value = []
    results.value = []
    return
  }

  const [registrationList, bracketList, podiumList] = await Promise.all([
    api.registrations(competitionId.value),
    api.brackets(competitionId.value),
    api.podiums(competitionId.value)
  ])

  registrations.value = registrationList
  brackets.value = bracketList
  podiums.value = podiumList

  const followOptions = competitionFollowCategories()
  if (!followOptions.some((item) => item.id === followCategoryId.value)) {
    followCategoryId.value = followOptions[0]?.id
  }

  if (!brackets.value.some((item) => item.id === bracketId.value)) {
    bracketId.value = brackets.value[0]?.id
  }

  await Promise.all([refreshRanking(), refreshBracket()])
}

async function refreshRanking() {
  if (!competitionId.value || !followCategoryId.value) {
    ranking.value = []
    return
  }

  ;[ranking.value, followAttempts.value, followSchedules.value] = await Promise.all([
    api.ranking(competitionId.value, followCategoryId.value),
    api.followAttempts(competitionId.value, followCategoryId.value),
    api.followSchedules(competitionId.value, followCategoryId.value)
  ])

  const activeSchedule =
    followSchedules.value.find((item) => item.status === 'EM_ANDAMENTO') ||
    followSchedules.value.find((item) => item.status === 'EM_CHAMADA') ||
    followSchedules.value.find((item) => item.status === 'AGENDADA') ||
    followSchedules.value.at(-1)

  followQueue.value = activeSchedule?.id
    ? await api.followQueue(activeSchedule.id).catch(() => [])
    : []
}

async function refreshBracket() {
  if (!bracketId.value) {
    matches.value = []
    results.value = []
    return
  }

  ;[matches.value, results.value] = await Promise.all([
    api.matches(bracketId.value),
    api.results(bracketId.value)
  ])
}

async function updateFollowCategory(value: number) {
  followCategoryId.value = value
  await refreshRanking()
}

async function updateBracket(value: number) {
  bracketId.value = value
  await refreshBracket()
}

onMounted(async () => {
  if (isNotFound) return

  await bootstrap()
  const refreshMs = Number(import.meta.env.VITE_REFRESH_MS || 20000)

  timer = window.setInterval(() => {
    if (publicCompetitionStatuses.includes(currentCompetition.value?.status)) {
      refreshCompetition().catch(() => undefined)
    }
  }, refreshMs)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (registrationNoticeTimer) window.clearTimeout(registrationNoticeTimer)
})
</script>

<template>
  <PublicNotFound v-if="isNotFound" />

  <div v-else class="public-app">
    <InstitutionalHeader
      :competition="currentCompetition"
      :management-url="managementUrl"
      :registration-open="registrationOpen"
      @registration-unavailable="showRegistrationUnavailable"
    />

    <main id="top">
      <HighlightsHero
        :competition="currentCompetition"
        :categories="categories"
        :registrations="registrations"
        :management-url="managementUrl"
      />
      <InstitutionalAbout />
      <TeamRobotsAwards />
      <RobotsShowcase />
      <InstitutionalGallery />
      <InstitutionalEvents
        :management-url="managementUrl"
        :registration-open="registrationOpen"
        @registration-unavailable="showRegistrationUnavailable"
      />

      <ActiveCompetition
        :competition="currentCompetition"
        :teams="teams"
        :categories="categories"
        :registrations="registrations"
        :podiums="podiums"
        :ranking="ranking"
        :follow-attempts="followAttempts"
        :follow-schedules="followSchedules"
        :follow-queue="followQueue"
        :brackets="brackets"
        :matches="matches"
        :results="results"
        :follow-category-id="followCategoryId"
        :bracket-id="bracketId"
        :loading="loading"
        :management-url="managementUrl"
        @registration-unavailable="showRegistrationUnavailable"
        @update:follow-category-id="updateFollowCategory"
        @update:bracket-id="updateBracket"
      />

      <section v-if="error" class="public-section">
        <div class="public-alert">
          <strong>Interface institucional disponível.</strong>
          <p>{{ error }}</p>
          <small>A janela competitiva aparece desde a abertura das inscrições e acompanha a competição até o período em andamento.</small>
        </div>
      </section>
    </main>

    <InstitutionalFooter />

    <Transition name="registration-notice">
      <aside
        v-if="registrationNoticeVisible"
        class="registration-period-notice"
        role="status"
        aria-live="polite"
      >
        <span class="registration-period-notice-icon" aria-hidden="true">i</span>
        <div>
          <strong>Inscrições indisponíveis</strong>
          <p>Não estamos no período de inscrições no momento.</p>
        </div>
        <button
          type="button"
          aria-label="Fechar aviso"
          @click="registrationNoticeVisible = false"
        >
          ×
        </button>
      </aside>
    </Transition>

    <a class="global-back-to-top" href="#top" aria-label="Voltar ao topo">↑</a>
  </div>
</template>
