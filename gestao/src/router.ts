import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store'
import LoginView from './views/LoginView.vue'
import ShellLayout from './views/ShellLayout.vue'
import DashboardView from './views/DashboardView.vue'
import CompetitionsView from './views/CompetitionsView.vue'
import RegistrationsView from './views/RegistrationsView.vue'
import FollowView from './views/FollowView.vue'
import SumoView from './views/SumoView.vue'
import ParticipantView from './views/ParticipantView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    {
      path: '/',
      component: ShellLayout,
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        {
          path: 'competicoes',
          name: 'competitions',
          component: CompetitionsView,
          meta: { role: 'ORGANIZACAO' }
        },
        {
          path: 'inscricoes',
          name: 'registrations',
          component: RegistrationsView,
          meta: { role: 'ORGANIZACAO' }
        },
        {
          path: 'follow-line',
          name: 'follow',
          component: FollowView,
          meta: { role: 'ORGANIZACAO' }
        },
        { path: 'sumo', name: 'sumo', component: SumoView, meta: { role: 'ORGANIZACAO' } },
        {
          path: 'minha-equipe',
          name: 'participant',
          component: ParticipantView,
          meta: { role: 'PARTICIPANTE' }
        }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.public) {
    if (auth.isAuthenticated && to.name === 'login') return { name: 'dashboard' }
    return true
  }
  if (!auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (!auth.user) {
    try {
      await auth.hydrate()
    } catch {
      return { name: 'login' }
    }
  }
  const requiredRole = to.meta.role as string | undefined
  if (requiredRole && auth.user?.role !== requiredRole) return { name: 'dashboard' }
  return true
})

export default router
