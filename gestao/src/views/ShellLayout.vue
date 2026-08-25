<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DataBoard,
  Trophy,
  Tickets,
  Timer,
  Collection,
  User,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const collapsed = ref(false)
const mobileOpen = ref(false)

const organizationItems = [
  { label: 'Visão geral', to: '/', icon: DataBoard },
  { label: 'Competições', to: '/competicoes', icon: Trophy },
  { label: 'Inscrições', to: '/inscricoes', icon: Tickets },
  { label: 'Seguidor de Linha', to: '/follow-line', icon: Timer },
  { label: 'Sumô', to: '/sumo', icon: Collection }
]
const participantItems = [
  { label: 'Visão geral', to: '/', icon: DataBoard },
  { label: 'Minha equipe', to: '/minha-equipe', icon: User }
]
const items = computed(() => (auth.isOrganization ? organizationItems : participantItems))

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
        <div v-if="!collapsed">
          <strong>RASCOMP</strong>
          <small>Competition Ops</small>
        </div>
      </button>

      <nav class="nav-list">
        <button
          v-for="item in items"
          :key="item.to"
          class="nav-item"
          :class="{ active: $route.path === item.to }"
          @click="go(item.to)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-if="!collapsed">{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-foot">
        <span v-if="!collapsed" class="role-pill">{{ auth.user?.role }}</span>
        <button class="nav-item" @click="collapsed = !collapsed">
          <el-icon><component :is="collapsed ? Expand : Fold" /></el-icon>
          <span v-if="!collapsed">Recolher menu</span>
        </button>
      </div>
    </aside>

    <div v-if="mobileOpen" class="mobile-backdrop" @click="mobileOpen = false" />

    <main class="main-area">
      <header class="topbar">
        <button class="mobile-menu" @click="mobileOpen = true">☰</button>
        <div>
          <span class="eyebrow">IEEE RAS · UFRB</span>
          <strong>Gestão da competição</strong>
        </div>
        <div class="topbar-user">
          <div class="user-copy">
            <strong>{{ auth.user?.nome }}</strong>
            <small>{{ auth.user?.email }}</small>
          </div>
          <el-dropdown>
            <button class="avatar">{{ auth.user?.nome?.slice(0, 1).toUpperCase() }}</button>
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
