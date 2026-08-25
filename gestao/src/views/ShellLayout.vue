<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Collection,
  DataBoard,
  Expand,
  Fold,
  Tickets,
  Timer,
  Trophy,
  User
} from '@element-plus/icons-vue'
import { useAuthStore } from '../store'

const auth = useAuthStore()
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
      { label: 'Competições', to: '/competicoes', icon: Trophy },
      { label: 'Inscrições', to: '/inscricoes', icon: Tickets }
    ]
  },
  {
    label: 'Operação',
    items: [
      { label: 'Seguidor de Linha', to: '/follow-line', icon: Timer },
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
    '/competicoes': 'Competições',
    '/inscricoes': 'Inscrições',
    '/follow-line': 'Seguidor de Linha',
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
</script>

<template>
  <div class="app-shell" :class="{ collapsed }">
    <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
      <button class="brand" @click="go('/')">
        <img src="/rascomp-logo.webp" alt="RASCOMP" />
        <div v-if="!collapsed" class="brand-copy">
          <strong>RASCOMP</strong>
          <small>Gestão RRC</small>
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
        <button class="nav-item nav-collapse" @click="collapsed = !collapsed">
          <el-icon><component :is="collapsed ? Expand : Fold" /></el-icon>
          <span v-if="!collapsed">Recolher menu</span>
        </button>
      </div>
    </aside>

    <div v-if="mobileOpen" class="mobile-backdrop" @click="mobileOpen = false" />

    <main class="main-area">
      <header class="topbar">
        <div class="topbar-context">
          <button class="mobile-menu" aria-label="Abrir menu" @click="mobileOpen = true">☰</button>
          <div>
            <span class="eyebrow">IEEE RAS · UFRB</span>
            <strong>{{ pageTitle }}</strong>
          </div>
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
