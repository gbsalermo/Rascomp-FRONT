<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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
const currentRegistrationLot = ref<any>()
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

type LandingMode = 'institutional' | 'auto' | 'competitive'
const requestedLandingMode = String(import.meta.env.VITE_LANDING_MODE || 'institutional').trim().toLowerCase()
const landingMode: LandingMode =
  requestedLandingMode === 'auto' || requestedLandingMode === 'competitive'
    ? requestedLandingMode
    : 'institutional'
const competitionModeEnabled = landingMode !== 'institutional'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isNotFound = normalizedPath !== '/' && normalizedPath !== '/index.html'

const currentCompetition = computed(() => competitions.value.find((item) => item.id === competitionId.value))
const publicCompetitionStatuses = ['INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO']
const registrationOpen = computed(() =>
  currentCompetition.value?.status === 'INSCRICOES_ABERTAS'
)
const displayedCompetition = computed(() =>
  competitionModeEnabled ? currentCompetition.value : undefined
)
const displayedRegistrationOpen = computed(() =>
  competitionModeEnabled && registrationOpen.value
)
const registrationNoticeVisible = ref(false)
const backToTopVisible = ref(false)
let registrationNoticeTimer: number | undefined
let sectionRevealObserver: IntersectionObserver | undefined
let backToTopFrame = 0

function updateBackToTopVisibility() {
  const hero = document.querySelector<HTMLElement>('.highlights-stage')
  if (!hero) {
    backToTopVisible.value = false
    return
  }

  // O botão global nunca deve disputar espaço com as setas do Hero.
  // Só aparece depois que o Hero saiu completamente da viewport.
  const heroBottom = hero.getBoundingClientRect().bottom
  backToTopVisible.value = heroBottom <= 0 && window.scrollY > 0
}

function scheduleBackToTopUpdate() {
  if (backToTopFrame) return
  backToTopFrame = window.requestAnimationFrame(() => {
    backToTopFrame = 0
    updateBackToTopVisibility()
  })
}

function setupSectionReveal() {
  sectionRevealObserver?.disconnect()

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('#top > *')
  ).slice(1)

  if (!sections.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  sections.forEach((section) => {
    section.classList.add('scroll-reveal-section')
  })

  if (reducedMotion) {
    sections.forEach((section) => section.classList.add('is-visible'))
    return
  }

  sectionRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const section = entry.target as HTMLElement
        section.classList.add('is-visible')
        sectionRevealObserver?.unobserve(section)
      })
    },
    {
      threshold: 0.04,
      rootMargin: '0px 0px 6% 0px'
    }
  )

  sections.forEach((section) => sectionRevealObserver?.observe(section))
}

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

    const focus = competitionList.find(
      (item: any) => item.vigente === true && publicCompetitionStatuses.includes(item.status)
    )

    competitionId.value = focus?.id
    await refreshCompetition()
  } catch (exception: any) {
    error.value = exception?.response?.data?.message || 'A API pública do RASCOMP ainda não está disponível.'
  } finally {
    loading.value = false
  }
}

async function syncPublishedCompetition() {
  const competitionList = await api.competitions()
  competitions.value = competitionList

  const published = competitionList.find(
    (item: any) => item.vigente === true && publicCompetitionStatuses.includes(item.status)
  )

  competitionId.value = published?.id
  await refreshCompetition()
}

async function refreshCompetition() {
  if (!competitionId.value) {
    registrations.value = []
    currentRegistrationLot.value = undefined
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

  const [registrationList, bracketList, podiumList, lot] = await Promise.all([
    api.registrations(competitionId.value),
    api.brackets(competitionId.value),
    api.podiums(competitionId.value).catch(() => []),
    api.currentRegistrationLot(competitionId.value).catch(() => undefined)
  ])

  registrations.value = registrationList
  brackets.value = bracketList
  podiums.value = podiumList
  currentRegistrationLot.value = lot

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
  updateBackToTopVisibility()
  window.addEventListener('scroll', scheduleBackToTopUpdate, { passive: true })

  if (isNotFound) return

  await nextTick()
  setupSectionReveal()

  if (!competitionModeEnabled) {
    loading.value = false
    return
  }

  await bootstrap()
  const refreshMs = Number(import.meta.env.VITE_REFRESH_MS || 20000)

  timer = window.setInterval(() => {
    syncPublishedCompetition().catch(() => undefined)
  }, refreshMs)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleBackToTopUpdate)
  if (backToTopFrame) window.cancelAnimationFrame(backToTopFrame)
  sectionRevealObserver?.disconnect()
  if (timer) clearInterval(timer)
  if (registrationNoticeTimer) window.clearTimeout(registrationNoticeTimer)
})
</script>

<template>
  <PublicNotFound v-if="isNotFound" />

  <div v-else class="public-app">
    <InstitutionalHeader
      :competition="displayedCompetition"
      :management-url="managementUrl"
      :registration-open="displayedRegistrationOpen"
      :competition-mode-enabled="competitionModeEnabled"
      @registration-unavailable="showRegistrationUnavailable"
    />

    <main id="top">
      <HighlightsHero
        :competition="displayedCompetition"
        :categories="categories"
        :registrations="registrations"
        :current-registration-lot="currentRegistrationLot"
        :management-url="managementUrl"
      />
      <InstitutionalAbout />
      <TeamRobotsAwards />
      <RobotsShowcase />
      <InstitutionalGallery />
      <InstitutionalEvents
        :management-url="managementUrl"
        :registration-open="displayedRegistrationOpen"
        :competition-mode-enabled="competitionModeEnabled"
        @registration-unavailable="showRegistrationUnavailable"
      />

      <ActiveCompetition
        v-if="competitionModeEnabled"
        :competition="displayedCompetition"
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

      <section v-if="competitionModeEnabled && error" class="public-section">
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

    <a
      v-show="backToTopVisible"
      class="global-back-to-top"
      href="#top"
      aria-label="Voltar ao topo"
    >↑</a>
  </div>
</template>
