<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { api } from './api'
import InstitutionalHeader from './components/InstitutionalHeader.vue'
import HighlightsHero from './components/HighlightsHero.vue'
import InstitutionalAbout from './components/InstitutionalAbout.vue'
import TeamRobotsAwards from './components/TeamRobotsAwards.vue'
import InstitutionalGallery from './components/InstitutionalGallery.vue'
import InstitutionalEvents from './components/InstitutionalEvents.vue'
import ActiveCompetition from './components/ActiveCompetition.vue'
import InstitutionalFooter from './components/InstitutionalFooter.vue'
import PublicNotFound from './components/PublicNotFound.vue'

const loading = ref(true)
const error = ref('')
const competitions = ref<any[]>([])
const categories = ref<any[]>([])
const registrations = ref<any[]>([])
const ranking = ref<any[]>([])
const brackets = ref<any[]>([])
const matches = ref<any[]>([])
const results = ref<any[]>([])
const competitionId = ref<number>()
const followCategoryId = ref<number>()
const bracketId = ref<number>()
let timer: number | undefined
const managementUrl = import.meta.env.VITE_GESTAO_URL || 'http://localhost:5173'
const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isNotFound = normalizedPath !== '/' && normalizedPath !== '/index.html'

const currentCompetition = computed(() => competitions.value.find((item) => item.id === competitionId.value))

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
    const [competitionList, categoryList] = await Promise.all([
      api.competitions(),
      api.categories()
    ])

    competitions.value = competitionList
    categories.value = categoryList

    const focus =
      competitionList.find((item: any) => item.status === 'EM_ANDAMENTO') ||
      competitionList.find((item: any) => item.status === 'INSCRICOES_ABERTAS') ||
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
    ranking.value = []
    brackets.value = []
    matches.value = []
    results.value = []
    return
  }

  const [registrationList, bracketList] = await Promise.all([
    api.registrations(competitionId.value),
    api.brackets(competitionId.value)
  ])

  registrations.value = registrationList
  brackets.value = bracketList

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

  ranking.value = await api.ranking(competitionId.value, followCategoryId.value)
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

async function updateCompetition(value: number) {
  competitionId.value = value
  await refreshCompetition()
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
    if (currentCompetition.value?.status === 'EM_ANDAMENTO') {
      refreshCompetition().catch(() => undefined)
    }
  }, refreshMs)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <PublicNotFound v-if="isNotFound" />

  <div v-else class="public-app">
    <InstitutionalHeader :competition="currentCompetition" :management-url="managementUrl" />

    <main id="top">
      <HighlightsHero :competition="currentCompetition" :management-url="managementUrl" />
      <InstitutionalAbout />
      <TeamRobotsAwards />
      <InstitutionalGallery />
      <InstitutionalEvents />

      <ActiveCompetition
        :competition="currentCompetition"
        :competitions="competitions"
        :categories="categories"
        :registrations="registrations"
        :ranking="ranking"
        :brackets="brackets"
        :matches="matches"
        :results="results"
        :follow-category-id="followCategoryId"
        :bracket-id="bracketId"
        :loading="loading"
        @update:competition-id="updateCompetition"
        @update:follow-category-id="updateFollowCategory"
        @update:bracket-id="updateBracket"
      />

      <section v-if="error" class="public-section">
        <div class="public-alert">
          <strong>Interface institucional disponível.</strong>
          <p>{{ error }}</p>
          <small>A janela competitiva só aparece quando a API pública e uma competição em andamento estiverem disponíveis.</small>
        </div>
      </section>
    </main>

    <InstitutionalFooter />
  </div>
</template>
