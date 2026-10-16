<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Aim,
  ArrowRight,
  Bell,
  Calendar,
  Connection,
  Cpu,
  DataBoard,
  Flag,
  Grid,
  Medal,
  Picture,
  Collection,
  Document,
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
      { label: 'Agenda', to: '/agenda', icon: Calendar },
      { label: 'Follow Line', to: '/follow-line', icon: Timer },
      { label: 'Sumô', to: '/sumo', icon: Aim },
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
      { label: 'Usuários', to: '/usuarios', icon: User },
      { label: 'Documentos e ajuda', to: '/documentos-ajuda', icon: Document }
    ]
  }
]

const participantSections = [
  {
    label: 'Participante',
    items: [{ label: 'Meu painel', to: '/minha-equipe', icon: DataBoard },
      { label: 'Regras e Ajuda', to: '/regras-ajuda', icon: Document }]
  }
]

const mediaSections = [
  {
    label: 'Mídia',
    items: [
      { label: 'Painel', to: '/', icon: DataBoard },
      { label: 'Biblioteca', to: '/midia', icon: Picture },
      { label: 'Álbuns', to: '/midia/albuns', icon: Collection },
      { label: 'Landing', to: '/midia/landing', icon: Grid }
    ]
  }
]

// Mudar o ambiente visual nunca altera role, token ou capacidades da conta.
const isDevMediaWorkspace = computed(() => auth.isDev && (route.path === '/midia' || route.path.startsWith('/midia/')))
const devMediaSections = [
  {
    label: 'Gestão de Mídia',
    items: [
      { label: 'Biblioteca', to: '/midia', icon: Picture },
      { label: 'Álbuns', to: '/midia/albuns', icon: Collection },
      { label: 'Landing', to: '/midia/landing', icon: Grid }
    ]
  }
]
const sections = computed(() => {
  if (auth.isParticipant) return participantSections
  if (auth.isMedia) return mediaSections
  if (isDevMediaWorkspace.value) return devMediaSections
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
    '/agenda': 'Agenda',
    '/follow-line': 'Follow Line',
    '/sumo': 'Sumô',
    '/chaves': 'Chaves',
    '/partidas': 'Partidas',
    '/resultados': 'Resultados',
    '/usuarios': 'Usuários',
    '/configuracoes': 'Configurações',
    '/minha-equipe': 'Meu painel',
    '/regras-ajuda': 'Regras e Ajuda',
    '/documentos-ajuda': 'Documentos e ajuda',
    '/midia': 'Biblioteca de mídia',
    '/midia/albuns': 'Álbuns de fotos',
    '/midia/landing': 'Conteúdo da Landing'
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
  if (auth.isMedia || isDevMediaWorkspace.value) return 'Gestão de Mídia'
  if (auth.isDev) return 'Gestão DEV'
  return 'Painel de Gestão'
})
const alertCount = computed(() => alerts.value.length)

function isActive(to: string) {
  return to === '/' ? route.path === '/' : (to === '/midia' ? route.path === '/midia' : route.path.startsWith(to))
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
    const [registrations, brackets, agenda] = await Promise.all([
      adminApi.registrations({ competitionId }),
      adminApi.brackets(competitionId).catch(() => []),
      adminApi.agenda(competitionId).catch(() => [])
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

    const upcoming = agenda
      .filter((item) => item.dataHora)
      .filter((item) => !['FINALIZADA', 'CANCELADA'].includes(item.status || ''))
      .map((item) => ({ item, minutes: minutesUntil(item.dataHora!) }))
      .filter(({ minutes }) => minutes >= -10 && minutes <= 90)
      .sort((a, b) => a.minutes - b.minutes)
      .slice(0, 4)

    for (const { item, minutes } of upcoming) {
      const follow = item.modalidade === 'FOLLOW_LINE'
      nextAlerts.push({
        id: `agenda-${item.tipo}-${item.sourceId}`,
        title: minutes <= 0
          ? (follow ? 'Tomada em operação' : 'Batalha em operação')
          : `${follow ? 'Tomada' : 'Batalha'} em ${minutes} min`,
        detail: `${item.titulo} · ${item.pista || 'pista a definir'}`,
        to: '/agenda',
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

      <button class="brand sidebar-brand-v2" @click="go(auth.isParticipant ? '/minha-equipe' : auth.isMedia || isDevMediaWorkspace ? '/midia' : '/')">
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

      <div v-if="auth.isDev" class="dev-workspace-switch" aria-label="Selecionar ambiente">
        <span v-if="!collapsed" class="dev-workspace-caption">AMBIENTE DEV</span>
        <button type="button" class="dev-workspace-option" :class="{ active: !isDevMediaWorkspace }"
          :title="collapsed ? 'Gestão DEV' : undefined" :aria-current="!isDevMediaWorkspace ? 'page' : undefined"
          @click="go('/')">
          <el-icon><DataBoard /></el-icon><span v-if="!collapsed">Gestão DEV</span>
        </button>
        <button type="button" class="dev-workspace-option" :class="{ active: isDevMediaWorkspace }"
          :title="collapsed ? 'Gestão de Mídia' : undefined" :aria-current="isDevMediaWorkspace ? 'page' : undefined"
          @click="go('/midia/landing')">
          <el-icon><Picture /></el-icon><span v-if="!collapsed">Gestão de Mídia</span>
        </button>
      </div>

      <div v-if="auth.canOperateCompetition && !isDevMediaWorkspace" class="sidebar-competition-mobile">
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
          <button v-for="item in section.items" :key="item.to" class="nav-item" :class="{ active: isActive(item.to), 'nav-item--suspended': item.to === '/midia' || item.to === '/midia/albuns' }" :disabled="item.to === '/midia' || item.to === '/midia/albuns'" :aria-disabled="item.to === '/midia' || item.to === '/midia/albuns'" :title="item.to === '/midia' || item.to === '/midia/albuns' ? 'Temporariamente indisponível — migração da Galeria' : (collapsed ? item.label : undefined)" @click="go(item.to)">
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

        <div v-if="auth.canOperateCompetition && !isDevMediaWorkspace" class="topbar-competition-switch">
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
          <el-dropdown v-if="auth.canOperateCompetition && !isDevMediaWorkspace" trigger="click" placement="bottom-end" @visible-change="(visible: boolean) => visible && loadAlerts()">
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

<style scoped>
/* Alternância de ambiente visível apenas para DEV. Não troca permissões nem login. */
.dev-workspace-switch {
  display: grid;
  gap: 3px;
  padding: 10px 10px 13px;
  border-bottom: 1px solid rgba(255, 255, 255, .10);
}
.dev-workspace-caption {
  padding: 0 8px 7px;
  font-size: .64rem;
  font-weight: 850;
  letter-spacing: .09em;
  color: rgba(255, 255, 255, .43);
}
.dev-workspace-option {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 40px;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: rgba(255,255,255,.7);
  font: inherit;
  font-size: .79rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: background .16s, color .16s;
}
.dev-workspace-option:hover {
  background: rgba(195, 21, 73, .13);
  color: #fff;
}
.dev-workspace-option.active {
  border-color: rgba(228, 71, 121, .27);
  background: rgba(195, 21, 73, .28);
  color: #fff;
}
.dev-workspace-option .el-icon { font-size: 1rem; flex-shrink: 0; }
.collapsed .dev-workspace-switch { padding: 10px 4px 13px; }
.collapsed .dev-workspace-option { justify-content: center; padding: 10px 4px; }
@media(max-width: 980px) {
  .dev-workspace-option { min-height: 44px; }
}
</style>
