<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Collection, Tickets, Trophy, User } from '@element-plus/icons-vue'
import { adminApi, participantApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type {
  Category,
  Competitor,
  Registration,
  Robot,
  Team
} from '../types'
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
  if (!competitionId) return []
  return registrations.value.filter((item) => item.competitionId === competitionId)
})

const focusCategories = computed(() => {
  const competitionId = activeCompetition.value?.id
  if (!competitionId) return []
  return categories.value.filter((item) => item.competitionId === competitionId)
})

const pendingRegistrations = computed(() =>
  focusRegistrations.value.filter((item) => item.status === 'PENDENTE')
)

const approvedRegistrations = computed(() =>
  focusRegistrations.value.filter((item) => item.status === 'APROVADA')
)

const registeredTeams = computed(
  () => new Set(focusRegistrations.value.map((item) => item.teamId)).size
)

const registeredRobots = computed(
  () => new Set(focusRegistrations.value.map((item) => item.robotId)).size
)

const registeredCompetitors = computed(() => {
  const ids = focusRegistrations.value.flatMap((item) => item.competitorIds || [])
  return new Set(ids).size
})

const recentRegistrations = computed(() =>
  [...focusRegistrations.value]
    .sort((a, b) => {
      const dateA = new Date(a.reviewedAt || a.dataCadastro || 0).getTime()
      const dateB = new Date(b.reviewedAt || b.dataCadastro || 0).getTime()
      if (dateA !== dateB) return dateB - dateA
      return (b.id || 0) - (a.id || 0)
    })
    .slice(0, 6)
)

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function categoryCount(categoryId: number) {
  return focusRegistrations.value.filter((item) => item.categoryId === categoryId).length
}

async function load() {
  loading.value = true
  error.value = ''

  try {
    if (auth.isOrganization) {
      const [, allCategories, allRegistrations, allTeams, allRobots, allCompetitors] =
        await Promise.all([
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
    } else {
      teams.value = await participantApi.teams()
    }
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
        <p class="muted">
          {{
            auth.isOrganization
              ? 'Acompanhe a competição em foco, pendências e atalhos da organização.'
              : 'Gerencie sua equipe e acompanhe suas inscrições.'
          }}
        </p>
      </div>
      <div class="heading-actions">
        <el-button @click="load">Atualizar painel</el-button>
      </div>
    </div>

    <div v-if="error" class="dashboard-alert">
      <strong>Não foi possível atualizar todos os dados.</strong>
      <span>{{ error }}</span>
    </div>

    <template v-if="auth.isOrganization">
      <section class="dashboard-metric-grid dashboard-metric-grid-v2">
        <article class="dashboard-stat-card rubro">
          <span class="dashboard-stat-icon"><el-icon><Trophy /></el-icon></span>
          <div>
            <small>Inscrições da edição</small>
            <strong>{{ focusRegistrations.length }}</strong>
            <span>{{ focusCategories.length }} categoria(s) configurada(s)</span>
          </div>
        </article>
        <article class="dashboard-stat-card rubro-soft">
          <span class="dashboard-stat-icon"><el-icon><Tickets /></el-icon></span>
          <div>
            <small>Inscrições aprovadas</small>
            <strong>{{ approvedRegistrations.length }}</strong>
            <span>{{ registeredCompetitors }} competidor(es)</span>
          </div>
        </article>
        <article class="dashboard-stat-card">
          <span class="dashboard-stat-icon"><el-icon><Collection /></el-icon></span>
          <div>
            <small>Robôs inscritos</small>
            <strong>{{ registeredRobots }}</strong>
            <span>{{ registeredTeams }} equipe(s)</span>
          </div>
        </article>
        <article class="dashboard-stat-card warning-card">
          <span class="dashboard-stat-icon"><el-icon><User /></el-icon></span>
          <div>
            <small>Aguardando análise</small>
            <strong>{{ pendingRegistrations.length }}</strong>
            <span>pendência(s) da competição em foco</span>
          </div>
        </article>
      </section>

      <section v-if="activeCompetition" class="dashboard-overview-grid">
        <article class="competition-overview-card">
          <div class="competition-overview-accent" />
          <header class="competition-overview-header">
            <div>
              <span class="eyebrow">Competição em foco</span>
              <h2>{{ activeCompetition.nome }}</h2>
              <p>{{ activeCompetition.descricao || 'Sem descrição cadastrada para esta competição.' }}</p>
            </div>
            <StatusBadge :value="activeCompetition.status || 'PLANEJADA'" />
          </header>

          <div class="competition-date-grid">
            <div>
              <small>Período do evento</small>
              <strong>{{ formatDate(activeCompetition.dataInicio) }} — {{ formatDate(activeCompetition.dataFim) }}</strong>
            </div>
            <div>
              <small>Período de inscrições</small>
              <strong>{{ formatDate(activeCompetition.inicioInscricoes) }} — {{ formatDate(activeCompetition.fimInscricoes) }}</strong>
            </div>
          </div>

          <div class="competition-categories-block">
            <div class="section-mini-heading">
              <div><span class="eyebrow">Categorias</span><strong>{{ focusCategories.length }} configurada(s)</strong></div>
              <router-link to="/competicoes" class="text-link">Detalhar competição →</router-link>
            </div>
            <div v-if="focusCategories.length" class="category-summary-list">
              <article v-for="item in focusCategories" :key="item.id" class="category-summary-item">
                <span>{{ item.nome }}</span>
                <small>{{ item.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}</small>
                <strong>{{ categoryCount(item.id) }} inscrição(ões)</strong>
              </article>
            </div>
            <p v-else class="muted dashboard-empty-copy">Nenhuma categoria configurada para esta competição.</p>
          </div>
        </article>

        <article class="dashboard-activity-card">
          <div class="card-heading dashboard-card-heading-v2">
            <div>
              <span class="eyebrow">Atividade recente</span>
              <h2>Últimas inscrições</h2>
            </div>
            <router-link to="/inscricoes" class="text-link">Ver todas</router-link>
          </div>

          <div v-if="recentRegistrations.length" class="activity-list-v2">
            <article v-for="item in recentRegistrations" :key="item.id" class="activity-item-v2">
              <span class="activity-dot" :class="`activity-${item.status.toLowerCase()}`" />
              <div>
                <strong>{{ item.robotNome }} · {{ item.teamNome }}</strong>
                <small>{{ item.categoryNome }} · {{ formatDateTime(item.reviewedAt || item.dataCadastro) }}</small>
              </div>
              <StatusBadge :value="item.status" />
            </article>
          </div>
          <div v-else class="dashboard-empty-state-small">
            <strong>Nenhuma movimentação nesta competição.</strong>
            <span>As novas inscrições aparecerão aqui.</span>
          </div>
        </article>
      </section>

      <article v-else class="empty-state-card">
        <span class="eyebrow">Competição em foco</span>
        <h2>Nenhuma competição cadastrada</h2>
        <p class="muted">Cadastre a primeira edição para começar a operação do RRC.</p>
        <router-link to="/competicoes" class="link-button">Abrir competição</router-link>
      </article>

      <section class="dashboard-quick-section">
        <div class="section-mini-heading dashboard-quick-heading">
          <div><span class="eyebrow">Acesso rápido</span><strong>Operações mais usadas</strong></div>
        </div>
        <div class="dashboard-quick-grid dashboard-quick-grid-five">
          <router-link to="/inscricoes" class="dashboard-quick-card quick-red">
            <span>+</span><div><strong>Nova inscrição</strong><small>Abrir gestão de inscrições</small></div><b>→</b>
          </router-link>
          <router-link to="/follow-line" class="dashboard-quick-card">
            <span>⏱</span><div><strong>Registrar tentativa</strong><small>Follow Line</small></div><b>→</b>
          </router-link>
          <router-link to="/chaves" class="dashboard-quick-card quick-red">
            <span>{ }</span><div><strong>Gerar chave</strong><small>Sumô</small></div><b>→</b>
          </router-link>
          <router-link to="/partidas" class="dashboard-quick-card">
            <span>▶</span><div><strong>Gerenciar partidas</strong><small>Sumô</small></div><b>→</b>
          </router-link>
          <router-link to="/resultados" class="dashboard-quick-card quick-red">
            <span>▥</span><div><strong>Ver resultados</strong><small>Ranking e vencedores</small></div><b>→</b>
          </router-link>
        </div>
      </section>
    </template>

    <template v-else>
      <div class="metric-grid">
        <article class="metric-card accent-red">
          <span>Minhas equipes</span><strong>{{ teams.length }}</strong>
        </article>
        <article class="metric-card">
          <span>Perfil</span><strong class="metric-text">participante</strong>
        </article>
      </div>

      <article class="feature-card">
        <div>
          <span class="eyebrow">Portal do participante</span>
          <h2>Equipe, robôs e inscrições</h2>
          <p>Os dados exibidos respeitam o ownership definido no backend.</p>
        </div>
        <router-link to="/minha-equipe" class="link-button">Abrir minha equipe</router-link>
      </article>
    </template>
  </div>
</template>
