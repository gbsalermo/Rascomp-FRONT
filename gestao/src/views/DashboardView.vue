<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Collection, Tickets, Trophy, User } from '@element-plus/icons-vue'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { Category, Competitor, Registration, Robot, Team } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const competition = useCompetitionStore()
const loading = ref(true)
const error = ref('')
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])
const teams = ref<Team[]>([])
const robots = ref<Robot[]>([])
const competitors = ref<Competitor[]>([])

const activeCompetition = computed(() => competition.selectedCompetition)
const focusRegistrations = computed(() => {
  const competitionId = activeCompetition.value?.id
  return competitionId ? registrations.value.filter((item) => item.competitionId === competitionId) : []
})

// CompetitionCategory é catálogo global. As categorias realmente presentes na edição
// são derivadas das inscrições da competição em foco.
const focusCategories = computed(() => {
  const ids = new Set(focusRegistrations.value.map((item) => item.categoryId))
  return categories.value.filter((item) => ids.has(item.id))
})

const eventProgress = computed(() => {
  const item = activeCompetition.value
  if (!item?.dataInicio || !item?.dataFim) return 0
  const start = new Date(`${item.dataInicio}T00:00:00`)
  const end = new Date(`${item.dataFim}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (today <= start) return today.getTime() === start.getTime() ? 0 : 0
  if (today >= end) return 100
  const total = end.getTime() - start.getTime()
  if (total <= 0) return item.status === 'FINALIZADA' ? 100 : 0
  return Math.max(0, Math.min(100, Math.round(((today.getTime() - start.getTime()) / total) * 100)))
})

const pendingRegistrations = computed(() => focusRegistrations.value.filter((item) => item.status === 'PENDENTE'))
const approvedRegistrations = computed(() => focusRegistrations.value.filter((item) => item.status === 'APROVADA'))
const registeredTeams = computed(() => new Set(focusRegistrations.value.map((item) => item.teamId)).size)
const registeredRobots = computed(() => new Set(focusRegistrations.value.map((item) => item.robotId)).size)
const registeredCompetitors = computed(() => new Set(focusRegistrations.value.flatMap((item) => item.competitorIds || [])).size)
const recentRegistrations = computed(() =>
  [...focusRegistrations.value]
    .sort((a, b) => new Date(b.reviewedAt || b.dataCadastro || 0).getTime() - new Date(a.reviewedAt || a.dataCadastro || 0).getTime())
    .slice(0, 6)
)

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date)
}

function categoryCount(categoryId: number) {
  return focusRegistrations.value.filter((item) => item.categoryId === categoryId).length
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [, allCategories, allRegistrations, allTeams, allRobots, allCompetitors] = await Promise.all([
      competition.load(true),
      adminApi.categories(),
      adminApi.registrations(),
      adminApi.teams(),
      adminApi.robots(),
      adminApi.competitors()
    ])
    categories.value = allCategories
    registrations.value = allRegistrations
    teams.value = allTeams
    robots.value = allRobots
    competitors.value = allCompetitors
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Não foi possível carregar o painel.'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-stack dashboard-page dashboard-v2" v-loading="loading">
    <div class="page-heading dashboard-heading">
      <div>
        <span class="eyebrow">Painel de gestão</span>
        <h1>Olá, {{ auth.user?.nome?.split(' ')[0] }}.</h1>
        <p class="muted">Acompanhe a competição em foco, pendências e atalhos da organização.</p>
      </div>
      <div class="heading-actions"><el-button @click="load">Atualizar painel</el-button></div>
    </div>

    <div v-if="error" class="dashboard-alert"><strong>Não foi possível atualizar todos os dados.</strong><span>{{ error }}</span></div>

    <section class="dashboard-metric-grid dashboard-metric-grid-v2">
      <article class="dashboard-stat-card rubro">
        <span class="dashboard-stat-icon"><el-icon><Trophy /></el-icon></span>
        <div><small>Inscrições da edição</small><strong>{{ focusRegistrations.length }}</strong><span>{{ focusCategories.length }} categoria(s) em uso</span></div>
      </article>
      <article class="dashboard-stat-card rubro-soft">
        <span class="dashboard-stat-icon"><el-icon><Tickets /></el-icon></span>
        <div><small>Inscrições aprovadas</small><strong>{{ approvedRegistrations.length }}</strong><span>{{ registeredCompetitors }} competidor(es)</span></div>
      </article>
      <article class="dashboard-stat-card">
        <span class="dashboard-stat-icon"><el-icon><Collection /></el-icon></span>
        <div><small>Robôs inscritos</small><strong>{{ registeredRobots }}</strong><span>{{ registeredTeams }} equipe(s)</span></div>
      </article>
      <article class="dashboard-stat-card warning-card">
        <span class="dashboard-stat-icon"><el-icon><User /></el-icon></span>
        <div><small>Aguardando análise</small><strong>{{ pendingRegistrations.length }}</strong><span>pendência(s) da competição em foco</span></div>
      </article>
    </section>

    <section v-if="activeCompetition" class="dashboard-overview-grid">
      <article class="competition-overview-card">
        <div class="competition-overview-accent" />
        <header class="competition-overview-header">
          <div><span class="eyebrow">Competição em foco</span><h2>{{ activeCompetition.nome }}</h2><p>{{ activeCompetition.descricao || 'Sem descrição cadastrada.' }}</p></div>
          <StatusBadge :value="activeCompetition.status || 'PLANEJADA'" />
        </header>

        <div v-if="activeCompetition.status === 'EM_ANDAMENTO' || activeCompetition.status === 'FINALIZADA'" class="dashboard-event-progress">
          <div><span class="eyebrow">Progresso do evento</span><strong>{{ activeCompetition.status === 'FINALIZADA' ? 100 : eventProgress }}%</strong></div>
          <el-progress :percentage="activeCompetition.status === 'FINALIZADA' ? 100 : eventProgress" :stroke-width="12" :show-text="false" />
          <small>{{ activeCompetition.status === 'FINALIZADA' ? 'Competição encerrada' : 'Estimativa pelo período oficial da edição' }}</small>
        </div>

        <div class="competition-date-grid">
          <div><small>Período do evento</small><strong>{{ formatDate(activeCompetition.dataInicio) }} — {{ formatDate(activeCompetition.dataFim) }}</strong></div>
          <div><small>Período de inscrições</small><strong>{{ formatDate(activeCompetition.inicioInscricoes) }} — {{ formatDate(activeCompetition.fimInscricoes) }}</strong></div>
        </div>

        <div class="competition-categories-block">
          <div class="section-mini-heading">
            <div><span class="eyebrow">Categorias</span><strong>{{ focusCategories.length }} em uso</strong></div>
            <router-link to="/competicoes" class="text-link">Detalhar competição →</router-link>
          </div>
          <div v-if="focusCategories.length" class="category-summary-list">
            <article v-for="item in focusCategories" :key="item.id" class="category-summary-item">
              <span>{{ item.nome }}</span><small>{{ item.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}</small><strong>{{ categoryCount(item.id) }} inscrição(ões)</strong>
            </article>
          </div>
          <p v-else class="muted dashboard-empty-copy">Nenhuma categoria com inscrições nesta competição.</p>
        </div>
      </article>

      <article class="dashboard-activity-card">
        <div class="card-heading dashboard-card-heading-v2"><div><span class="eyebrow">Atividade recente</span><h2>Últimas inscrições</h2></div><router-link to="/inscricoes" class="text-link">Ver todas</router-link></div>
        <div v-if="recentRegistrations.length" class="activity-list-v2">
          <article v-for="item in recentRegistrations" :key="item.id" class="activity-item-v2">
            <span class="activity-dot" :class="`activity-${item.status.toLowerCase()}`" />
            <div><strong>{{ item.robotNome }} · {{ item.teamNome }}</strong><small>{{ item.categoryNome }} · {{ formatDateTime(item.reviewedAt || item.dataCadastro) }}</small></div>
            <StatusBadge :value="item.status" />
          </article>
        </div>
        <div v-else class="dashboard-empty-state-small"><strong>Nenhuma movimentação nesta competição.</strong><span>As novas inscrições aparecerão aqui.</span></div>
      </article>
    </section>

    <article v-else class="empty-state-card">
      <span class="eyebrow">Competição em foco</span><h2>Nenhuma competição cadastrada</h2><p class="muted">Cadastre a primeira edição para começar a operação do RRC.</p><router-link to="/competicoes" class="link-button">Abrir competição</router-link>
    </article>

    <section class="dashboard-quick-section">
      <div class="section-mini-heading dashboard-quick-heading"><div><span class="eyebrow">Acesso rápido</span><strong>Operações mais usadas</strong></div></div>
      <div class="dashboard-quick-grid dashboard-quick-grid-five">
        <router-link to="/inscricoes" class="dashboard-quick-card quick-red"><span>+</span><div><strong>Analisar inscrições</strong><small>Aprovar ou rejeitar</small></div><b>→</b></router-link>
        <router-link to="/follow-line" class="dashboard-quick-card"><span>⏱</span><div><strong>Registrar tomada</strong><small>Follow Line</small></div><b>→</b></router-link>
        <router-link to="/chaves" class="dashboard-quick-card quick-red"><span>{ }</span><div><strong>Gerar chave</strong><small>Sumô</small></div><b>→</b></router-link>
        <router-link to="/sumo" class="dashboard-quick-card"><span>▶</span><div><strong>Operar Sumô</strong><small>Chaves e partidas</small></div><b>→</b></router-link>
        <router-link to="/resultados" class="dashboard-quick-card quick-red"><span>▥</span><div><strong>Ver resultados</strong><small>Ranking e vencedores</small></div><b>→</b></router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-event-progress { display:grid; gap:9px; margin:18px 0 4px; padding:14px 15px; border:1px solid #eadbe2; border-radius:13px; background:#fff8fa; }
.dashboard-event-progress > div { display:flex; align-items:end; justify-content:space-between; gap:12px; }
.dashboard-event-progress strong { color:#9f0f3b; font-size:24px; }
.dashboard-event-progress small { color:#887981; font-size:10px; }
</style>
