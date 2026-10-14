<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { api, API_URL } from './api'
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
import PublicGalleryPage from './components/PublicGalleryPage.vue'
import {localMediaDraft,mediaPreviewMode,startLocalMediaPreview,type PreviewDraft} from './content/localMediaPreview'

const publishedMediaDraft=ref<PreviewDraft|null>(null)
const displayedMediaDraft=computed(()=>localMediaDraft.value||publishedMediaDraft.value)
// O CMS só altera seções explicitamente editadas; snapshots antigos preservam o site original.
const publishedSections=computed<string[]>(()=>{
  if(localMediaDraft.value)return ['heroes','about','team','robots','events','sponsors','competition','footer']
  const candidate=publishedMediaDraft.value as (PreviewDraft & {__editedSections?:unknown})|null
  if(Array.isArray(candidate?.__editedSections)){
    const explicit=candidate.__editedSections.filter((value):value is string=>typeof value==='string')
    if(explicit.length)return explicit
  }
  // Compatibilidade com publicações realizadas antes do rastreio por seção:
  // um Hero editorial adicionado deve aparecer sem reescrever as demais seções.
  const hasNewHero=candidate?.heroes?.some(hero=>hero.active && hero.id.startsWith('editorial-'))
  return hasNewHero?['heroes']:[]
})
function sectionDraft(section:string){
  return publishedSections.value.includes(section)?displayedMediaDraft.value:null
}
async function loadPublishedMedia() {
  try{
    const response=await fetch(API_URL+'/api/v1/public/media/editorial')
    if(!response.ok)return
    const draft=await response.json() as PreviewDraft
    if(!draft||!Array.isArray(draft.heroes))return
    const resolve=(value:unknown):unknown=>{
      if(Array.isArray(value))return value.map(resolve)
      if(value&&typeof value==='object'){
        const mapped:Record<string,unknown>={}
        for(const [key,item]of Object.entries(value))
          mapped[key]=key==='src'&&typeof item==='string'&&item.startsWith('/')
            ? API_URL+item : resolve(item)
        return mapped
      }
      return value
    }
    publishedMediaDraft.value=resolve(draft) as PreviewDraft
  }catch{
    // Em indisponibilidade do CMS, preservar a Landing institucional estática.
  }
}
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
let stopPreview: (()=>void)|undefined
function guardPreviewNavigation(event:MouseEvent) {
  if(!mediaPreviewMode)return
  const anchor=(event.target as Element|null)?.closest?.('a[href]')
  if(!anchor)return
  const href=anchor.getAttribute('href')||''
  // Em prévia, links externos/ações de inscrição não devem abrir outro sistema.
  if(!href.startsWith('#')){event.preventDefault();event.stopPropagation()}
}

const managementUrl = String(import.meta.env.VITE_GESTAO_URL || (import.meta.env.DEV ? 'http://localhost:5173' : '')).trim()

type LandingMode = 'institutional' | 'auto' | 'competitive'
const requestedLandingMode = String(import.meta.env.VITE_LANDING_MODE || 'institutional').trim().toLowerCase()
const landingMode: LandingMode =
  requestedLandingMode === 'auto' || requestedLandingMode === 'competitive'
    ? requestedLandingMode
    : 'institutional'
const competitionModeEnabled = landingMode !== 'institutional'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isGalleryPage = normalizedPath === '/galeria'
const isNotFound = normalizedPath !== '/' && normalizedPath !== '/index.html' && !isGalleryPage

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
  stopPreview=startLocalMediaPreview()
  void loadPublishedMedia()
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
  stopPreview?.()
  window.removeEventListener('scroll', scheduleBackToTopUpdate)
  if (backToTopFrame) window.cancelAnimationFrame(backToTopFrame)
  sectionRevealObserver?.disconnect()
  if (timer) clearInterval(timer)
  if (registrationNoticeTimer) window.clearTimeout(registrationNoticeTimer)
})
</script>

<template>
  <PublicGalleryPage v-if="isGalleryPage" />
  <PublicNotFound v-else-if="isNotFound" />

  <div v-else class="public-app" @click.capture="guardPreviewNavigation">
    <aside v-if="mediaPreviewMode" class="rascomp-preview-banner" role="status">
      <strong>PRÉVIA LOCAL — NÃO PUBLICADA</strong>
      <span>{{ localMediaDraft ? 'Rascunho da Gestão aplicado ao site' : 'Aguardando rascunho da Gestão de Mídia…' }}</span>
    </aside>
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
        :media-preview="sectionDraft('heroes')"
      />
      <InstitutionalAbout :media-preview="sectionDraft('about')" />
      <TeamRobotsAwards :media-preview="sectionDraft('team')" />
      <RobotsShowcase :media-preview="sectionDraft('robots')" />
      <InstitutionalGallery />
      <InstitutionalEvents
        :management-url="managementUrl"
        :registration-open="displayedRegistrationOpen"
        :competition-mode-enabled="competitionModeEnabled"
        :media-preview="sectionDraft('events')"
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

    <InstitutionalFooter :media-preview="sectionDraft('footer')" />

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

<style scoped>
.rascomp-preview-banner{position:fixed;z-index:9999;top:0;left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;padding:9px 17px;background:#2a1427;color:#fff;border:1px solid #b72c5b;border-radius:0 0 12px 12px;box-shadow:0 8px 24px #1c102444;font-size:12px;line-height:1.2;max-width:96vw;flex-wrap:wrap;justify-content:center}
.rascomp-preview-banner strong{letter-spacing:.06em;font-size:10px;color:#ffd3e3}
.rascomp-preview-banner span{font-size:11px;color:#f8edf5}
</style>
