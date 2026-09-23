<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Aim,
  ArrowRight,
  Bell,
  Connection,
  Cpu,
  DataBoard,
  Flag,
  Grid,
  Medal,
  Tickets,
  Timer,
  Trophy,
  User,
  UserFilled
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

const devSections = [
  { label: 'Geral', items: [{ label: 'Dashboard', to: '/', icon: DataBoard }] },
  {
    label: 'Operação ao vivo',
    items: [
      { label: 'Follow Line', to: '/follow-line', icon: Timer },
      { label: 'Sumô', to: '/sumo', icon: Aim },
      { label: 'Partidas', to: '/partidas', icon: Flag },
      { label: 'Resultados', to: '/resultados', icon: Medal }
    ]
  },
  {
    label: 'Competição',
    items: [
      { label: 'Competição', to: '/competicoes', icon: Trophy },
      { label: 'Inscrições', to: '/inscricoes', icon: Tickets },
      { label: 'Equipes', to: '/equipes', icon: User },
      { label: 'Competidores', to: '/competidores', icon: UserFilled },
      { label: 'Robôs', to: '/robos', icon: Cpu },
      { label: 'Modalidades', to: '/modalidades', icon: Grid },
      { label: 'Chaves', to: '/chaves', icon: Connection }
    ]
  },
  {
    label: 'Administração',
    items: [
      { label: 'Usuários', to: '/usuarios', icon: User }
    ]
  }
]

const participantSections = [
  {
    label: 'Participante',
    items: [{ label: 'Meu painel', to: '/minha-equipe', icon: DataBoard }]
  }
]

const mediaSections = [
  {
    label: 'Mídia',
    items: [{ label: 'Painel', to: '/', icon: DataBoard }]
  }
]

const sections = computed(() => {
  if (auth.isParticipant) return participantSections
  if (auth.isMedia) return mediaSections
  if (auth.isDev) return devSections
  return devSections.filter((section) => section.label !== 'Administração')
})
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Visão geral',
    '/competicoes': 'Competição',
    '/inscricoes': 'Inscrições',
    '/equipes': 'Equipes',
    '/competidores': 'Competidores',
    '/robos': 'Robôs',
    '/modalidades': 'Modalidades',
    '/follow-line': 'Follow Line',
    '/sumo': 'Sumô',
    '/chaves': 'Chaves',
    '/partidas': 'Partidas',
    '/resultados': 'Resultados',
    '/usuarios': 'Usuários',
    '/configuracoes': 'Configurações',
    '/minha-equipe': 'Meu painel'
  }
  if (titles[route.path]) return titles[route.path]
  if (route.name === 'follow-run') return 'Operação Follow Line'
  if (route.name === 'sumo-match') return 'Partida de Sumô'
  if (auth.isParticipant) return 'Portal do participante'
  if (auth.isMedia) return 'Painel de mídia'
  return 'Gestão da competição'
})
const roleLabel = computed(() => {
  const labels = {
    DEV: 'DEV',
    GESTAO: 'Gestão',
    MIDIA: 'Mídia',
    PARTICIPANTE: 'Participante'
  } as const
  return auth.user ? labels[auth.user.role] : 'Usuário'
})
const panelLabel = computed(() => {
  if (auth.isParticipant) return 'Portal do Participante'
  if (auth.isMedia) return 'Painel de Mídia'
  return 'Painel de Gestão'
})
const alertCount = computed(() => alerts.value.length)

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

function go(to: string) {
  router.push(to)
  mobileOpen.value = false
}

function openMobileMenu() {
  collapsed.value = false
  mobileOpen.value = true
}

function syncResponsiveShell() {
  if (window.innerWidth <= 980) {
    collapsed.value = false
    return
  }
  mobileOpen.value = false
}

async function logout() {
  await auth.logout()
  router.push('/login')
}

function minutesUntil(value: string) {
  return Math.round((new Date(value).getTime() - Date.now()) / 60000)
}

async function loadAlerts() {
  if (!auth.canOperateCompetition || !competition.selectedId) {
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
        detail: 'Há inscrições aguardando análise da gestão.',
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
  syncResponsiveShell()
  window.addEventListener('resize', syncResponsiveShell)

  if (auth.canOperateCompetition) {
    await competition.load()
    await loadAlerts()
  }
})

onBeforeUnmount(() => window.removeEventListener('resize', syncResponsiveShell))

watch(() => competition.selectedId, loadAlerts)
</script>

<template>
  <div class="app-shell admin-shell-v2" :class="{ collapsed }">
    <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
      <button class="sidebar-collapse-edge" :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'" :title="collapsed ? 'Expandir menu' : 'Recolher menu'" @click="collapsed = !collapsed">
        <el-icon><component :is="collapsed ? ArrowRight : ArrowLeft" /></el-icon>
      </button>

      <button class="brand sidebar-brand-v2" @click="go(auth.isParticipant ? '/minha-equipe' : '/')">
        <span class="sidebar-rascomp-logo" aria-hidden="true">
          <svg viewBox="0 0 96 96">
            <path d="M48 15v10" /><circle cx="48" cy="11" r="4" /><rect x="22" y="28" width="52" height="45" rx="14" />
            <path d="M22 43H12v17h10M74 43h10v17H74" /><circle cx="38" cy="49" r="4" /><circle cx="58" cy="49" r="4" /><path d="M37 61c3 4 7 6 11 6s8-2 11-6" />
          </svg>
        </span>
        <div v-if="!collapsed" class="brand-copy">
          <strong>RasComp</strong>
          <small>{{ panelLabel }}</small>
        </div>
      </button>

      <div class="sidebar-divider" />

      <div v-if="auth.canOperateCompetition" class="sidebar-competition-mobile">
        <span>{{ auth.isDev ? 'Competição em foco' : 'Competição vigente' }}</span>
        <el-select
          v-if="auth.isDev"
          :model-value="competition.selectedId"
          :loading="competition.loading"
          placeholder="Selecionar competição"
          @change="competition.select"
        >
          <el-option v-for="item in competition.competitions" :key="item.id" :label="item.nome" :value="item.id" />
        </el-select>
        <div v-else class="sidebar-competition-static">
          <strong>{{ competition.selectedCompetition?.nome || 'Nenhuma edição vigente' }}</strong>
          <small>{{ competition.selectedCompetition?.status?.replaceAll('_', ' ') || 'Sem contexto operacional' }}</small>
        </div>
      </div>

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
      <header class="topbar admin-topbar-v2">
        <div class="topbar-context">
          <button class="mobile-menu" aria-label="Abrir menu" @click="openMobileMenu">☰</button>
          <div>
            <span class="eyebrow">IEEE RAS · UFRB</span>
            <strong>{{ pageTitle }}</strong>
          </div>
        </div>

        <div v-if="auth.canOperateCompetition" class="topbar-competition-switch">
          <div class="competition-switch-copy">
            <span>{{ auth.isDev ? 'Competição em foco' : 'Competição vigente' }}</span>
            <small>{{ competition.selectedCompetition?.status?.replaceAll('_', ' ') || 'Sem edição operacional' }}</small>
          </div>
          <el-select
            v-if="auth.isDev"
            :model-value="competition.selectedId"
            :loading="competition.loading"
            placeholder="Selecionar competição"
            style="width: 245px"
            @change="competition.select"
          >
            <el-option v-for="item in competition.competitions" :key="item.id" :label="item.nome" :value="item.id" />
          </el-select>
          <div v-else class="competition-context-static">
            {{ competition.selectedCompetition?.nome || 'Nenhuma edição vigente' }}
          </div>
        </div>

        <div class="topbar-user">
          <el-dropdown v-if="auth.canOperateCompetition" trigger="click" placement="bottom-end" @visible-change="(visible: boolean) => visible && loadAlerts()">
            <button class="notification-bell" aria-label="Abrir alertas" title="Alertas da competição">
              <el-badge :value="alertCount" :hidden="alertCount === 0" :max="9">
                <el-icon><Bell /></el-icon>
              </el-badge>
            </button>
            <template #dropdown>
              <el-dropdown-menu class="admin-alert-menu">
                <div class="admin-alert-header">
                  <strong>Alertas</strong>
                  <span>{{ competition.selectedCompetition?.nome || 'Competição' }}</span>
                </div>
                <el-dropdown-item v-if="alertLoading" disabled>Atualizando alertas...</el-dropdown-item>
                <el-dropdown-item v-else-if="alerts.length === 0" disabled>Nenhuma pendência imediata.</el-dropdown-item>
                <template v-else>
                  <el-dropdown-item v-for="item in alerts" :key="item.id" class="admin-alert-item" @click="go(item.to)">
                    <span class="alert-indicator" :class="`alert-${item.kind}`" />
                    <div><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></div>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <span class="topbar-role">{{ roleLabel }}</span>
          <div class="user-copy">
            <strong>{{ auth.user?.nome }}</strong>
            <small>{{ auth.user?.email }}</small>
          </div>
          <el-dropdown>
            <button class="avatar" :aria-label="`Menu de ${auth.user?.nome || 'usuário'}`">
              {{ auth.user?.nome?.slice(0, 1).toUpperCase() }}
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">Sair</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <section class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="admin-page-slide" mode="out-in"><component :is="Component" /></transition>
        </router-view>
      </section>
    </main>
  </div>
</template>
