<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  Collection,
  DataBoard,
  Tickets,
  Timer,
  Trophy,
  User
} from '@element-plus/icons-vue'
import { useAuthStore, useCompetitionStore } from '../store'

const auth = useAuthStore()
const competition = useCompetitionStore()
const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const mobileOpen = ref(false)

const organizationSections = [
  {
    label: 'Geral',
    items: [{ label: 'Visão geral', to: '/', icon: DataBoard }]
  },
  {
    label: 'Competição',
    items: [
      { label: 'Competição', to: '/competicoes', icon: Trophy },
      { label: 'Inscrições', to: '/inscricoes', icon: Tickets }
    ]
  },
  {
    label: 'Categorias',
    items: [
      { label: 'Follow Line', to: '/follow-line', icon: Timer },
      { label: 'Sumô', to: '/sumo', icon: Collection }
    ]
  }
]

const participantSections = [
  {
    label: 'Geral',
    items: [{ label: 'Visão geral', to: '/', icon: DataBoard }]
  },
  {
    label: 'Participante',
    items: [{ label: 'Minha equipe', to: '/minha-equipe', icon: User }]
  }
]

const sections = computed(() => (auth.isOrganization ? organizationSections : participantSections))

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Visão geral',
    '/competicoes': 'Competição',
    '/inscricoes': 'Inscrições',
    '/follow-line': 'Follow Line',
    '/sumo': 'Sumô',
    '/minha-equipe': 'Minha equipe'
  }
  return titles[route.path] || 'Gestão da competição'
})

const roleLabel = computed(() => (auth.isOrganization ? 'Organização' : 'Participante'))

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

onMounted(() => {
  if (auth.isOrganization) competition.load()
})
</script>

<template>
  <div class="app-shell admin-shell-v2" :class="{ collapsed }">
    <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
      <button
        class="sidebar-collapse-edge"
        :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
        :title="collapsed ? 'Expandir menu' : 'Recolher menu'"
        @click="collapsed = !collapsed"
      >
        <el-icon><component :is="collapsed ? ArrowRight : ArrowLeft" /></el-icon>
      </button>

      <button class="brand sidebar-brand-v2" @click="go('/')">
        <span class="sidebar-rascomp-logo" aria-hidden="true">
          <svg viewBox="0 0 96 96">
            <path d="M48 15v10" />
            <circle cx="48" cy="11" r="4" />
            <rect x="22" y="28" width="52" height="45" rx="14" />
            <path d="M22 43H12v17h10M74 43h10v17H74" />
            <circle cx="38" cy="49" r="4" />
            <circle cx="58" cy="49" r="4" />
            <path d="M37 61c3 4 7 6 11 6s8-2 11-6" />
          </svg>
        </span>
        <div v-if="!collapsed" class="brand-copy">
          <strong>RasComp</strong>
          <small>Gestão do RRC</small>
        </div>
      </button>

      <div class="sidebar-divider" />

      <nav class="nav-list" aria-label="Navegação principal">
        <section v-for="section in sections" :key="section.label" class="nav-section">
          <span v-if="!collapsed" class="nav-caption">{{ section.label }}</span>
          <button
            v-for="item in section.items"
            :key="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
            :title="collapsed ? item.label : undefined"
            @click="go(item.to)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span v-if="!collapsed">{{ item.label }}</span>
          </button>
        </section>
      </nav>

      <div class="sidebar-foot">
        <div v-if="!collapsed" class="sidebar-profile">
          <span class="role-pill">{{ roleLabel }}</span>
          <small>IEEE RAS · UFRB</small>
        </div>
      </div>
    </aside>

    <div v-if="mobileOpen" class="mobile-backdrop" @click="mobileOpen = false" />

    <main class="main-area">
      <header class="topbar admin-topbar-v2">
        <div class="topbar-context">
          <button class="mobile-menu" aria-label="Abrir menu" @click="mobileOpen = true">☰</button>
          <div>
            <span class="eyebrow">IEEE RAS · UFRB</span>
            <strong>{{ pageTitle }}</strong>
          </div>
        </div>

        <div v-if="auth.isOrganization" class="topbar-competition-switch">
          <span>Competição em foco</span>
          <el-select
            :model-value="competition.selectedId"
            :loading="competition.loading"
            placeholder="Selecionar competição"
            size="small"
            style="width: 220px"
            @change="competition.select"
          >
            <el-option
              v-for="item in competition.competitions"
              :key="item.id"
              :label="item.nome"
              :value="item.id"
            />
          </el-select>
        </div>

        <div class="topbar-user">
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
        <router-view />
      </section>
    </main>
  </div>
</template>
