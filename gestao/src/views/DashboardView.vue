<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Calendar, Connection, Cpu, Grid, Tickets, User } from '@element-plus/icons-vue'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { AgendaActivity, Bracket, Category, Registration } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const competition = useCompetitionStore()

const loading = ref(true)
const error = ref('')
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])
const brackets = ref<Bracket[]>([])
const agenda = ref<AgendaActivity[]>([])

const activeCompetition = computed(() => competition.selectedCompetition)
const focusRegistrations = computed(() => registrations.value)
const focusCategories = computed(() => {
  const ids = new Set(focusRegistrations.value.map((item) => item.categoryId))
  return categories.value.filter((item) => ids.has(item.id))
})

const pendingRegistrations = computed(() =>
  focusRegistrations.value.filter((item) => item.status === 'PENDENTE')
)
const approvedRegistrations = computed(() =>
  focusRegistrations.value.filter((item) => item.status === 'APROVADA')
)
const registeredTeams = computed(() =>
  new Set(focusRegistrations.value.map((item) => item.teamId)).size
)
const registeredRobots = computed(() =>
  new Set(focusRegistrations.value.map((item) => item.robotId)).size
)
const registeredCompetitors = computed(() =>
  new Set(focusRegistrations.value.flatMap((item) => item.competitorIds || [])).size
)
const followCategories = computed(() =>
  focusCategories.value.filter((item) => item.modalidade === 'FOLLOW_LINE')
)
const sumoCategories = computed(() =>
  focusCategories.value.filter((item) => item.modalidade === 'SUMO')
)
const activeBrackets = computed(() =>
  brackets.value.filter((item) => item.ativo !== false && item.atual !== false)
)
const upcomingAgenda = computed(() => {
  const now = Date.now()
  return agenda.value
    .filter((item) => item.dataHora)
    .filter((item) => !['FINALIZADA', 'CANCELADA', 'AUSENTE'].includes(item.status || ''))
    .filter((item) => new Date(item.dataHora!).getTime() >= now - 2 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.dataHora!).getTime() - new Date(b.dataHora!).getTime())
    .slice(0, 5)
})

const recentRegistrations = computed(() =>
  [...focusRegistrations.value]
    .sort(
      (a, b) =>
        new Date(b.reviewedAt || b.dataCadastro || 0).getTime() -
        new Date(a.reviewedAt || a.dataCadastro || 0).getTime()
    )
    .slice(0, 4)
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

function clearCompetitionData() {
  registrations.value = []
  brackets.value = []
  agenda.value = []
}

async function loadDashboard(forceCompetition = false) {
  if (!auth.canOperateCompetition) {
    loading.value = false
    error.value = ''
    return
  }

  loading.value = true
  error.value = ''

  try {
    await competition.load(forceCompetition)
    const competitionId = competition.selectedId

    if (!competitionId) {
      clearCompetitionData()
      categories.value = await adminApi.categories()
      return
    }

    const [allCategories, competitionRegistrations, competitionBrackets, competitionAgenda] = await Promise.all([
      adminApi.categories(),
      adminApi.registrations({ competitionId }),
      adminApi.brackets(competitionId),
      adminApi.agenda(competitionId)
    ])

    categories.value = allCategories
    registrations.value = competitionRegistrations
    brackets.value = competitionBrackets
    agenda.value = competitionAgenda
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Não foi possível carregar o painel.'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadDashboard())

watch(
  () => competition.selectedId,
  (current, previous) => {
    if (current !== previous) loadDashboard()
  }
)
</script>

<template>
  <div v-if="auth.isMedia" class="page-stack dashboard-page dashboard-v2">
    <div class="page-heading dashboard-heading">
      <div>
        <span class="eyebrow">Painel de mídia</span>
        <h1>Olá, {{ auth.user?.nome?.split(' ')[0] }}.</h1>
        <p class="muted">Seu perfil está separado da operação competitiva.</p>
      </div>
    </div>

    <article class="feature-card">
      <div>
        <span class="eyebrow">Acesso editorial</span>
        <h2>Perfil de mídia ativo</h2>
        <p class="muted">
          As ferramentas editoriais serão disponibilizadas no módulo de mídia. Este perfil não possui acesso às rotinas de competição.
        </p>
      </div>
    </article>
  </div>

  <div v-else class="page-stack dashboard-page dashboard-v2" v-loading="loading">
    <div class="page-heading dashboard-heading">
      <div>
        <span class="eyebrow">Central da competição</span>
        <h1>Olá, {{ auth.user?.nome?.split(' ')[0] }}.</h1>
        <p class="muted">Veja o que exige atenção agora e acesse diretamente as áreas da edição em foco.</p>
      </div>
      <div class="heading-actions">
        <el-button @click="loadDashboard(true)">Atualizar painel</el-button>
      </div>
    </div>

    <div v-if="error" class="dashboard-alert">
      <strong>Não foi possível atualizar todos os dados.</strong>
      <span>{{ error }}</span>
    </div>

    <section class="dashboard-metric-grid dashboard-metric-grid-v2 dashboard-action-grid">
      <router-link to="/inscricoes" class="dashboard-stat-card dashboard-stat-link warning-card">
        <span class="dashboard-stat-icon"><el-icon><Tickets /></el-icon></span>
        <div>
          <small>Aguardando análise</small>
          <strong>{{ pendingRegistrations.length }}</strong>
          <span>{{ approvedRegistrations.length }} aprovadas · {{ focusRegistrations.length }} no total</span>
        </div>
        <b class="dashboard-card-arrow">→</b>
      </router-link>

      <router-link to="/equipes" class="dashboard-stat-card dashboard-stat-link">
        <span class="dashboard-stat-icon"><el-icon><User /></el-icon></span>
        <div>
          <small>Equipes inscritas</small>
          <strong>{{ registeredTeams }}</strong>
          <span>{{ registeredCompetitors }} competidor(es) vinculados</span>
        </div>
        <b class="dashboard-card-arrow">→</b>
      </router-link>

      <router-link to="/robos" class="dashboard-stat-card dashboard-stat-link rubro-soft">
        <span class="dashboard-stat-icon"><el-icon><Cpu /></el-icon></span>
        <div>
          <small>Robôs inscritos</small>
          <strong>{{ registeredRobots }}</strong>
          <span>na competição em foco</span>
        </div>
        <b class="dashboard-card-arrow">→</b>
      </router-link>

      <router-link to="/modalidades" class="dashboard-stat-card dashboard-stat-link">
        <span class="dashboard-stat-icon"><el-icon><Grid /></el-icon></span>
        <div>
          <small>Categorias em uso</small>
          <strong>{{ focusCategories.length }}</strong>
          <span>{{ followCategories.length }} Follow · {{ sumoCategories.length }} Sumô</span>
        </div>
        <b class="dashboard-card-arrow">→</b>
      </router-link>

      <router-link to="/agenda" class="dashboard-stat-card dashboard-stat-link rubro-soft">
        <span class="dashboard-stat-icon"><el-icon><Calendar /></el-icon></span>
        <div>
          <small>Atividades agendadas</small>
          <strong>{{ agenda.length }}</strong>
          <span>{{ upcomingAgenda.length }} próxima(s) na programação</span>
        </div>
        <b class="dashboard-card-arrow">→</b>
      </router-link>

      <router-link to="/chaves" class="dashboard-stat-card dashboard-stat-link">
        <span class="dashboard-stat-icon"><el-icon><Connection /></el-icon></span>
        <div>
          <small>Chaves atuais</small>
          <strong>{{ activeBrackets.length }}</strong>
          <span>{{ sumoCategories.length }} categoria(s) de Sumô em uso</span>
        </div>
        <b class="dashboard-card-arrow">→</b>
      </router-link>

    </section>

    <section v-if="activeCompetition" class="dashboard-overview-grid dashboard-overview-grid-v3">
      <article class="competition-overview-card">
        <div class="competition-overview-accent" />
        <header class="competition-overview-header">
          <div>
            <span class="eyebrow">Competição em foco</span>
            <h2>{{ activeCompetition.nome }}</h2>
            <p>{{ activeCompetition.descricao || 'Sem descrição cadastrada.' }}</p>
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

        <div class="dashboard-operation-links">
          <router-link to="/agenda">Abrir Agenda →</router-link>
          <router-link v-if="followCategories.length" to="/follow-line">Operar Follow Line →</router-link>
          <router-link v-if="sumoCategories.length" to="/sumo">Operar Sumô →</router-link>
          <router-link to="/resultados">Ver resultados →</router-link>
        </div>

        <div class="competition-categories-block">
          <div class="section-mini-heading">
            <div>
              <span class="eyebrow">Categorias da edição</span>
              <strong>{{ focusCategories.length }} em uso</strong>
            </div>
            <router-link to="/competicoes" class="text-link">Detalhar competição →</router-link>
          </div>

          <div v-if="focusCategories.length" class="category-summary-list">
            <article v-for="item in focusCategories" :key="item.id" class="category-summary-item">
              <span>{{ item.nome }}</span>
              <small>{{ item.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}</small>
              <strong>{{ categoryCount(item.id) }} inscrição(ões)</strong>
            </article>
          </div>
          <p v-else class="muted dashboard-empty-copy">Nenhuma categoria com inscrições nesta competição.</p>
        </div>
      </article>

      <article class="dashboard-activity-card dashboard-activity-v3">
        <div class="card-heading dashboard-card-heading-v2">
          <div>
            <span class="eyebrow">Operação da edição</span>
            <h2>Agenda e movimentações</h2>
          </div>
        </div>

        <section class="dashboard-activity-section">
          <div class="dashboard-activity-section-title">
            <strong>Próximas atividades</strong>
            <router-link to="/agenda" class="text-link">Abrir agenda</router-link>
          </div>

          <div v-if="upcomingAgenda.length" class="activity-list-v2 activity-list-compact">
            <article v-for="item in upcomingAgenda" :key="`${item.tipo}-${item.sourceId}`" class="activity-item-v2">
              <span class="activity-dot" :class="item.modalidade === 'FOLLOW_LINE' ? 'activity-aprovada' : 'activity-pendente'" />
              <div>
                <strong>{{ item.titulo }}</strong>
                <small>{{ item.categoryNome }} · {{ formatDateTime(item.dataHora) }} · {{ item.pista || 'pista a definir' }}</small>
              </div>
              <el-tag :type="item.modalidade === 'FOLLOW_LINE' ? 'success' : 'danger'" effect="light" size="small">
                {{ item.modalidade === 'FOLLOW_LINE' ? 'Follow' : 'Sumô' }}
              </el-tag>
            </article>
          </div>
          <div v-else class="dashboard-empty-state-inline">Nenhuma atividade futura agendada.</div>
        </section>

        <section class="dashboard-activity-section">
          <div class="dashboard-activity-section-title">
            <strong>Movimentações de inscrição</strong>
            <router-link to="/inscricoes" class="text-link">Ver inscrições</router-link>
          </div>

          <div v-if="recentRegistrations.length" class="activity-list-v2 activity-list-compact">
            <article v-for="item in recentRegistrations" :key="item.id" class="activity-item-v2">
              <span class="activity-dot" :class="`activity-${item.status.toLowerCase()}`" />
              <div>
                <strong>{{ item.robotNome }} · {{ item.teamNome }}</strong>
                <small>{{ item.categoryNome }} · {{ formatDateTime(item.reviewedAt || item.dataCadastro) }}</small>
              </div>
              <StatusBadge :value="item.status" />
            </article>
          </div>
          <div v-else class="dashboard-empty-state-inline">Nenhuma movimentação de inscrição nesta edição.</div>
        </section>

      </article>
    </section>

    <article v-else class="empty-state-card">
      <span class="eyebrow">Competição em foco</span>
      <h2>Nenhuma competição cadastrada</h2>
      <p class="muted">Cadastre a primeira edição para começar a operação do RRC.</p>
      <router-link to="/competicoes" class="link-button">Abrir competição</router-link>
    </article>
  </div>
</template>
