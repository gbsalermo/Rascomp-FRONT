import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import PasswordRecoveryView from './views/PasswordRecoveryView.vue'
import VerifyEmailView from './views/VerifyEmailView.vue'
import ResetPasswordView from './views/ResetPasswordView.vue'
import ActivateInternalAccountView from './views/ActivateInternalAccountView.vue'
import ShellLayout from './views/ShellLayout.vue'
import DashboardView from './views/DashboardView.vue'
import AgendaView from './views/AgendaView.vue'
import CompetitionsView from './views/CompetitionsView.vue'
import RegistrationsView from './views/RegistrationsView.vue'
import AdminCatalogView from './views/AdminCatalogView.vue'
import CompetitorsView from './views/CompetitorsView.vue'
import FollowView from './views/FollowView.vue'
import FollowRunView from './views/FollowRunView.vue'
import SumoView from './views/SumoView.vue'
import SumoMatchView from './views/SumoMatchView.vue'
import BracketHistoryView from './views/BracketHistoryView.vue'
import MatchesView from './views/MatchesView.vue'
import ResultsView from './views/ResultsView.vue'
import UsersView from './views/UsersView.vue'
import SettingsView from './views/SettingsView.vue'
import ParticipantView from './views/ParticipantView.vue'
import NotFoundView from './views/NotFoundView.vue'
import type { AuthCapability } from './types'

const competitionMeta = { capability: 'operateCompetition' as AuthCapability }
const usersMeta = { capability: 'manageUsers' as AuthCapability }
const systemMeta = { capability: 'manageSystem' as AuthCapability }
const participantMeta = { capability: 'participant' as AuthCapability }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/cadastro', name: 'register', component: RegisterView, meta: { public: true } },
    { path: '/recuperar-senha', name: 'password-recovery', component: PasswordRecoveryView, meta: { public: true } },
    { path: '/verificar-email', name: 'verify-email', component: VerifyEmailView, meta: { public: true } },
    { path: '/redefinir-senha', name: 'password-reset', component: ResetPasswordView, meta: { public: true } },
    { path: '/ativar-conta', name: 'internal-account-activation', component: ActivateInternalAccountView, meta: { public: true } },
    {
      path: '/',
      component: ShellLayout,
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'competicoes', name: 'competitions', component: CompetitionsView, meta: competitionMeta },
        { path: 'inscricoes', name: 'registrations', component: RegistrationsView, meta: competitionMeta },
        { path: 'equipes', name: 'teams-admin', component: AdminCatalogView, meta: competitionMeta },
        { path: 'competidores', name: 'competitors-admin', component: CompetitorsView, meta: competitionMeta },
        { path: 'robos', name: 'robots-admin', component: AdminCatalogView, meta: competitionMeta },
        { path: 'modalidades', name: 'modalities-admin', component: AdminCatalogView, meta: competitionMeta },
        { path: 'agenda', name: 'agenda', component: AgendaView, meta: competitionMeta },
        { path: 'follow-line', name: 'follow', component: FollowView, meta: competitionMeta },
        { path: 'follow-line/tomada/:registrationId', name: 'follow-run', component: FollowRunView, meta: competitionMeta },
        { path: 'sumo', name: 'sumo', component: SumoView, meta: competitionMeta },
        { path: 'sumo/partida/:matchId', name: 'sumo-match', component: SumoMatchView, meta: competitionMeta },
        { path: 'chaves', name: 'brackets-history', component: BracketHistoryView, meta: competitionMeta },
        { path: 'partidas', name: 'matches-admin', component: MatchesView, meta: competitionMeta },
        { path: 'resultados', name: 'results-admin', component: ResultsView, meta: competitionMeta },
        { path: 'usuarios', name: 'users-admin', component: UsersView, meta: usersMeta },
        { path: 'configuracoes', name: 'settings-admin', component: SettingsView, meta: systemMeta },
        { path: 'minha-equipe', name: 'participant', component: ParticipantView, meta: participantMeta }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { public: true } }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.hydrated) {
    try {
      await auth.hydrate()
    } catch {
      // hydrate limpa a sessão inválida; a decisão de rota é feita abaixo.
    }
  }

  if (to.meta.public) {
    if (auth.isAuthenticated && auth.user && ['login', 'register'].includes(String(to.name))) {
      return auth.isParticipant ? { name: 'participant' } : { name: 'dashboard' }
    }
    return true
  }

  if (!auth.isAuthenticated || !auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (auth.isParticipant && to.name === 'dashboard') {
    return { name: 'participant' }
  }

  const requiredCapability = to.meta.capability as AuthCapability | undefined
  if (requiredCapability && !auth.hasCapability(requiredCapability)) {
    return auth.isParticipant ? { name: 'participant' } : { name: 'dashboard' }
  }
  return true
})

router.afterEach((to) => {
  if (to.name === 'not-found') return

  const auth = useAuthStore()
  if (to.name === 'login') {
    document.title = 'RasComp · Entrar'
    return
  }
  if (to.name === 'register') {
    document.title = 'RasComp · Cadastro'
    return
  }
  if (to.name === 'verify-email') {
    document.title = 'RasComp · Verificar e-mail'
    return
  }
  if (to.name === 'internal-account-activation') {
    document.title = 'RasComp · Primeiro acesso'
    return
  }
  if (to.name === 'password-recovery' || to.name === 'password-reset') {
    document.title = 'RasComp · Recuperar acesso'
    return
  }
  if (auth.isParticipant) {
    document.title = 'RasComp · Participante'
    return
  }
  if (auth.user?.role === 'DEV') {
    document.title = 'RasComp · Administração'
    return
  }
  document.title = 'RasComp · Gestão'
})

export default router
