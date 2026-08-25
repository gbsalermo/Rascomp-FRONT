import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import PasswordRecoveryView from './views/PasswordRecoveryView.vue'
import ShellLayout from './views/ShellLayout.vue'
import DashboardView from './views/DashboardView.vue'
import CompetitionsView from './views/CompetitionsView.vue'
import RegistrationsView from './views/RegistrationsView.vue'
import AdminCatalogView from './views/AdminCatalogView.vue'
import FollowView from './views/FollowView.vue'
import SumoView from './views/SumoView.vue'
import BracketHistoryView from './views/BracketHistoryView.vue'
import MatchesView from './views/MatchesView.vue'
import ResultsView from './views/ResultsView.vue'
import SettingsView from './views/SettingsView.vue'
import ParticipantView from './views/ParticipantView.vue'

const organizationMeta = { role: 'ORGANIZACAO' }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/cadastro', name: 'register', component: RegisterView, meta: { public: true } },
    {
      path: '/recuperar-senha',
      name: 'password-recovery',
      component: PasswordRecoveryView,
      meta: { public: true }
    },
    {
      path: '/',
      component: ShellLayout,
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'competicoes', name: 'competitions', component: CompetitionsView, meta: organizationMeta },
        { path: 'inscricoes', name: 'registrations', component: RegistrationsView, meta: organizationMeta },
        { path: 'equipes', name: 'teams-admin', component: AdminCatalogView, meta: organizationMeta },
        { path: 'robos', name: 'robots-admin', component: AdminCatalogView, meta: organizationMeta },
        { path: 'modalidades', name: 'modalities-admin', component: AdminCatalogView, meta: organizationMeta },
        { path: 'follow-line', name: 'follow', component: FollowView, meta: organizationMeta },
        { path: 'sumo', name: 'sumo', component: SumoView, meta: organizationMeta },
        { path: 'chaves', name: 'brackets-history', component: BracketHistoryView, meta: organizationMeta },
        { path: 'partidas', name: 'matches-admin', component: MatchesView, meta: organizationMeta },
        { path: 'resultados', name: 'results-admin', component: ResultsView, meta: organizationMeta },
        { path: 'configuracoes', name: 'settings-admin', component: SettingsView, meta: organizationMeta },
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
    if (auth.isAuthenticated && ['login', 'register'].includes(String(to.name))) {
      return { name: 'dashboard' }
    }
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
