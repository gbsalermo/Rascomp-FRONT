<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Collection,
  DataBoard,
  Setting,
  Tickets,
  Timer,
  Trophy,
  User
} from '@element-plus/icons-vue'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'

interface AdminAlert {
  id: string
  title: string
  detail: string
  to: string
  kind: 'attention' | 'match' | 'info'
}

const auth = useAuthStore()
const competition = useCompetitionStore()
const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const mobileOpen = ref(false)
const alertLoading = ref(false)
const alerts = ref<AdminAlert[]>([])

const organizationSections = [
  { label: 'Geral', items: [{ label: 'Dashboard', to: '/', icon: DataBoard }] },
  {
    label: 'Competição',
    items: [
      { label: 'Competição', to: '/competicoes', icon: Trophy },
      { label: 'Inscrições', to: '/inscricoes', icon: Tickets },
      { label: 'Equipes', to: '/equipes', icon: User },
      { label: 'Robôs', to: '/robos', icon: Collection },
      { label: 'Modalidades', to: '/modalidades', icon: Trophy }
    ]
  },
  {
    label: 'Categorias',
    items: [
      { label: 'Follow Line', to: '/follow-line', icon: Timer },
      { label: 'Sumô', to: '/sumo', icon: Collection }
    ]
  },
  {
    label: 'Competição ao vivo',
    items: [
      { label: 'Chaves', to: '/chaves', icon: Trophy },
      { label: 'Partidas', to: '/partidas', icon: Timer },
      { label: 'Resultados', to: '/resultados', icon: DataBoard }
    ]
  },
  { label: 'Sistema', items: [{ label: 'Configurações', to: '/configuracoes', icon: Setting }] }
]

const participantSections = [
  {
    label: 'Participante',
    items: [{ label: 'Meu painel', to: '/minha-equipe', icon: DataBoard }]
  }
]

const sections = computed(() => (auth.isOrganization ? organizationSections : participantSections))
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Visão geral',
    '/competicoes': 'Competição',
    '/inscricoes': 'Inscrições',
    '/equipes': 'Equipes',
    '/robos': 'Robôs',
    '/modalidades': 'Modalidades',
    '/follow-line': 'Follow Line',
    '/sumo': 'Sumô',
    '/chaves': 'Chaves',
    '/partidas': 'Partidas',
    '/resultados': 'Resultados',
    '/configuracoes': 'Configurações',
    '/minha-equipe': 'Meu painel'
  }
  return titles[route.path] || (auth.isOrganization ? 'Gestão da competição' : 'Portal do participante')
})
const roleLabel = computed(() => (auth.isOrganization ? 'Organização' : 'Participante'))
const alertCount = computed(() => alerts.value.length)

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

function go(to: string) {
  router.push(to)
  mobileOpen.value = false
}

function logout() {
  auth.logout()
  router.push('/login')
}

function minutesUntil(value: string) {
  return Math.round((new Date(value).getTime() - Date.now()) / 60000)
}

async function loadAlerts() {
  if (!auth.isOrganization || !competition.selectedId) {
    alerts.value = []
    return
  }
  alertLoading.value = true
  try {
    const competitionId = competition.selectedId
    const [registrations, brackets] = await Promise.all([
      adminApi.registrations({ competitionId }),
      adminApi.brackets(competitionId).catch(() => [])
    ])
    const nextAlerts: AdminAlert[] = []
    const pending = registrations.filter((item) => item.status === 'PENDENTE')
    if (pending.length) {
      nextAlerts.push({
        id: 'pending-registrations',
        title: `${pending.length} inscrição(ões) pendente(s)`,
        detail: 'Há inscrições aguardando análise da organização.',
        to: '/inscricoes',
        kind: 'attention'
      })
    }

    const matchGroups = await Promise.all(brackets.map((bracket) => adminApi.matches(bracket.id).catch(() => [])))
    const matches = matchGroups.flat()
    const upcoming = matches
      .filter((match) => match.dataHora && ['AGENDADA', 'EM_ANDAMENTO'].includes(match.status || ''))
      .map((match) => ({ match, minutes: minutesUntil(match.dataHora!) }))
      .filter(({ minutes }) => minutes >= -10 && minutes <= 90)
      .sort((a, b) => a.minutes - b.minutes)
      .slice(0, 4)

    for (const { match, minutes } of upcoming) {
      nextAlerts.push({
        id: `match-${match.id}`,
        title: minutes <= 0 ? 'Partida em andamento' : `Partida em ${minutes} min`,
        detail: `${match.robotANome || 'A definir'} × ${match.robotBNome || 'A definir'}`,
        to: '/partidas',
        kind: 'match'
      })
    }

    if (registrations.filter((item) => item.status === 'APROVADA').length >= 2 && brackets.length === 0) {
      nextAlerts.push({
        id: 'bracket-pending',
        title: 'Chave ainda não gerada',
        detail: 'Existem inscrições aprovadas e nenhum chaveamento nesta competição.',
        to: '/chaves',
        kind: 'info'
      })
    }
    alerts.value = nextAlerts
  } catch {
    alerts.value = []
  } finally {
    alertLoading.value = false
  }
}

onMounted(async () => {
  if (auth.isOrganization) {
    await competition.load()
    await loadAlerts()
  }
})

watch(() => competition.selectedId, loadAlerts)
</script>

<template>
  <div class="app-shell admin-shell-v2" :class="{ collapsed }">
    <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
      <button class="sidebar-collapse-edge" :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'" :title="collapsed ? 'Expandir menu' : 'Recolher menu'" @click="collapsed = !collapsed">
        <el-icon><component :is="collapsed ? ArrowRight : ArrowLeft" /></el-icon>
      </button>

      <button class="brand sidebar-brand-v2" @click="go(auth.isOrganization ? '/' : '/minha-equipe')">
        <span class="sidebar-rascomp-logo" aria-hidden="true">
          <svg viewBox="0 0 96 96">
            <path d="M48 15v10" /><circle cx="48" cy="11" r="4" /><rect x="22" y="28" width="52" height="45" rx="14" />
            <path d="M22 43H12v17h10M74 43h10v17H74" /><circle cx="38" cy="49" r="4" /><circle cx="58" cy="49" r="4" /><path d="M37 61c3 4 7 6 11 6s8-2 11-6" />
          </svg>
        </span>
        <div v-if="!collapsed" class="brand-copy">
          <strong>RasComp</strong>
          <small>{{ auth.isOrganization ? 'Painel de Gestão' : 'Portal do Participante' }}</small>
        </div>
      </button>

      <div class="sidebar-divider" />
      <nav class="nav-list" aria-label="Navegação principal">
        <section v-for="section in sections" :key="section.label" class="nav-section">
          <span v-if="!collapsed" class="nav-caption">{{ section.label }}</span>
          <button v-for="item in section.items" :key="item.to" class="nav-item" :class="{ active: isActive(item.to) }" :title="collapsed ? item.label : undefined" @click="go(item.to)">
            <el-icon><component :is="item.icon" /></el-icon><span v-if="!collapsed">{{ item.label }}</span>
          </button>
        </section>
      </nav>
      <div class="sidebar-foot"><div v-if="!collapsed" class="sidebar-profile"><span class="role-pill">{{ roleLabel }}</span><small>IEEE RAS · UFRB</small></div></div>
    </aside>

    <div v-if="mobileOpen" class="mobile-backdrop" @click="mobileOpen = false" />

    <main class="main-area">
      <header class="topbar">
        <button class="mobile-menu-button" aria-label="Abrir menu" @click="mobileOpen = true">☰</button>
        <div class="topbar-copy"><span>{{ pageTitle }}</span><small>{{ auth.user?.nome }}</small></div>

        <div v-if="auth.isOrganization" class="topbar-competition">
          <span>Competição em foco</span>
          <el-select v-model="competition.selectedId" placeholder="Selecionar competição" size="small" style="width:260px" @change="(value:number) => competition.select(value)">
            <el-option v-for="item in competition.competitions" :key="item.id" :label="item.nome" :value="item.id" />
          </el-select>
        </div>

        <div class="topbar-actions">
          <el-popover v-if="auth.isOrganization" placement="bottom-end" :width="360" trigger="click" @show="loadAlerts">
            <template #reference>
              <button class="topbar-icon-button" aria-label="Alertas"><el-icon><Bell /></el-icon><span v-if="alertCount" class="notification-badge">{{ alertCount }}</span></button>
            </template>
            <div class="notification-panel" v-loading="alertLoading">
              <div class="notification-heading"><strong>Alertas operacionais</strong><small>{{ alertCount ? `${alertCount} item(ns)` : 'Tudo em dia' }}</small></div>
              <button v-for="alert in alerts" :key="alert.id" class="notification-item" :class="`kind-${alert.kind}`" @click="go(alert.to)"><strong>{{ alert.title }}</strong><span>{{ alert.detail }}</span></button>
              <div v-if="!alerts.length && !alertLoading" class="notification-empty">Nenhum alerta para a competição em foco.</div>
            </div>
          </el-popover>
          <div class="topbar-user"><span>{{ auth.user?.nome }}</span><small>{{ roleLabel }}</small></div>
          <el-button text @click="logout">Sair</el-button>
        </div>
      </header>

      <section class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="admin-page-slide" mode="out-in"><component :is="Component" /></transition>
        </router-view>
      </section>
    </main>
  </div>
</template>
