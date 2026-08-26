<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { api, assetUrl } from './api'
import InstitutionalHeader from './components/InstitutionalHeader.vue'
import HighlightsHero from './components/HighlightsHero.vue'

const loading = ref(true)
const error = ref('')
const competitions = ref<any[]>([])
const categories = ref<any[]>([])
const teams = ref<any[]>([])
const robots = ref<any[]>([])
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

const currentCompetition = computed(() => competitions.value.find((c) => c.id === competitionId.value))
const followCategories = computed(() => categories.value.filter((c) => c.modalidade === 'FOLLOW_LINE'))
const sumoCategories = computed(() => categories.value.filter((c) => c.modalidade === 'SUMO'))
const currentBracket = computed(() => brackets.value.find((b) => b.id === bracketId.value))
const approvedCount = computed(() => registrations.value.filter((r) => r.status === 'APROVADA').length)

async function bootstrap() {
  loading.value = true
  error.value = ''
  try {
    const [comp, cats, teamList, robotList] = await Promise.all([
      api.competitions(),
      api.categories(),
      api.teams(),
      api.robots()
    ])
    competitions.value = comp
    categories.value = cats
    teams.value = teamList
    robots.value = robotList
    const focus =
      comp.find((c: any) => c.status === 'EM_ANDAMENTO') ||
      comp.find((c: any) => c.status === 'INSCRICOES_ABERTAS') ||
      comp[0]
    competitionId.value = focus?.id
    followCategoryId.value = followCategories.value[0]?.id
    await refreshCompetition()
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'A API pública do RASCOMP ainda não está disponível.'
  } finally {
    loading.value = false
  }
}
async function refreshCompetition() {
  if (!competitionId.value) return
  const [regs, brs] = await Promise.all([
    api.registrations(competitionId.value),
    api.brackets(competitionId.value)
  ])
  registrations.value = regs
  brackets.value = brs
  bracketId.value = brackets.value[0]?.id
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
function statusLabel(value?: string) {
  return String(value || '').replaceAll('_', ' ')
}
watch(competitionId, refreshCompetition)
watch(followCategoryId, refreshRanking)
watch(bracketId, refreshBracket)

onMounted(async () => {
  await bootstrap()
  const ms = Number(import.meta.env.VITE_REFRESH_MS || 20000)
  timer = window.setInterval(() => {
    if (currentCompetition.value?.status === 'EM_ANDAMENTO') refreshCompetition()
  }, ms)
})
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <div class="public-app">
    <InstitutionalHeader :competition="currentCompetition" :management-url="managementUrl" />

    <main id="top">
      <HighlightsHero :competition="currentCompetition" :management-url="managementUrl" />

      <section v-if="error" class="public-section"><div class="public-alert"><strong>Interface pronta.</strong><p>{{ error }}</p><small>A landing consome exclusivamente <code>/api/v1/public/**</code>.</small></div></section>

      <template v-else>
        <section id="ao-vivo" class="live-strip">
          <div><span class="live-dot"></span><strong>{{ currentCompetition?.status === 'EM_ANDAMENTO' ? 'AO VIVO' : 'COMPETIÇÃO' }}</strong></div>
          <select v-model="competitionId"><option v-for="item in competitions" :key="item.id" :value="item.id">{{ item.nome }}</option></select>
          <span>{{ statusLabel(currentCompetition?.status) }}</span>
        </section>

        <section class="public-section" :class="{ loading }">
          <div class="section-heading"><div><span class="eyebrow">Visão geral</span><h2>{{ currentCompetition?.nome || 'RASCOMP' }}</h2><p>{{ currentCompetition?.descricao }}</p></div></div>
          <div class="public-metrics">
            <article><strong>{{ approvedCount }}</strong><span>inscrições aprovadas</span></article>
            <article><strong>{{ teams.length }}</strong><span>equipes públicas</span></article>
            <article><strong>{{ robots.length }}</strong><span>robôs cadastrados</span></article>
            <article><strong>{{ categories.length }}</strong><span>categorias</span></article>
          </div>
        </section>

        <section id="modalidades" class="public-section alt">
          <div class="section-heading"><div><span class="eyebrow">FOLLOW LINE</span><h2>Classificação por tempo</h2><p>A melhor tentativa válida e concluída define a posição.</p></div>
            <select v-model="followCategoryId"><option v-for="item in followCategories" :key="item.id" :value="item.id">{{ item.nome }}</option></select>
          </div>
          <div class="ranking-board">
            <article v-for="(item,index) in ranking.slice(0,8)" :key="item.registrationId" class="rank-row" :class="{ podium:index < 3 }">
              <strong class="rank-position">{{ index + 1 }}</strong><div><b>{{ item.robotNome || `Inscrição #${item.registrationId}` }}</b><span>{{ item.teamNome }}</span></div><strong class="rank-time">{{ item.tempoFinal != null ? `${item.tempoFinal}s` : '—' }}</strong>
            </article>
            <p v-if="!ranking.length" class="empty-copy">O ranking aparecerá assim que houver tentativas válidas.</p>
          </div>
        </section>

        <section class="public-section">
          <div class="section-heading"><div><span class="eyebrow">SUMÔ</span><h2>Chaveamento e vencedores</h2><p>Rounds concluídos no sistema de gestão atualizam esta área automaticamente.</p></div>
            <select v-model="bracketId"><option v-for="item in brackets" :key="item.id" :value="item.id">{{ item.nome }}</option></select>
          </div>
          <div v-if="currentBracket" class="bracket-summary"><strong>{{ currentBracket.nome }}</strong><span>{{ statusLabel(currentBracket.status) }}</span></div>
          <div class="match-grid">
            <article v-for="match in matches" :key="match.id" class="match-card">
              <small>Rodada {{ match.rodada }} · #{{ match.ordem }}</small>
              <div><strong>{{ match.robotANome || 'A definir' }}</strong><span>×</span><strong>{{ match.robotBNome || 'A definir' }}</strong></div>
              <footer><span>{{ statusLabel(match.status) }}</span><b v-if="results.find(r=>r.matchId===match.id)">✓ resultado</b></footer>
            </article>
            <p v-if="!matches.length" class="empty-copy">A chave será exibida quando a organização gerar o bracket.</p>
          </div>
        </section>

        <section id="equipes" class="public-section alt">
          <div class="section-heading"><div><span class="eyebrow">Competidores</span><h2>Robôs e equipes</h2><p>Dados públicos sanitizados, sem e-mail ou telefone dos competidores.</p></div></div>
          <div class="robot-grid">
            <article v-for="robot in robots.slice(0,12)" :key="robot.id" class="robot-card">
              <div class="robot-image"><img v-if="robot.fotoPrincipalUrl" :src="assetUrl(robot.fotoPrincipalUrl)" :alt="robot.nome" /><span v-else>🤖</span></div>
              <div><strong>{{ robot.nome }}</strong><span>{{ robot.teamNome }}</span><p>{{ robot.descricao || 'Robô participante do RASCOMP.' }}</p></div>
            </article>
          </div>
        </section>
      </template>
    </main>

    <footer class="site-footer"><img src="/rascomp-logo.webp" alt="RASCOMP" /><p>IEEE Robotics & Automation Society · Universidade Federal do Recôncavo da Bahia</p><span>Dados oficiais servidos pela API pública do RASCOMP.</span></footer>
  </div>
</template>
