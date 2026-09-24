import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/main.css'
import './styles/management-ui.css'
import './styles/login-ui.css'
import './styles/auth-onboarding.css'
import './styles/participant-onboarding.css'
import './styles/registrations-ui.css'
import './styles/login-viewport-fix.css'
import './styles/admin-ui.css'
import './styles/competition-hub.css'
import './styles/bracket-history.css'
import App from './App.vue'
import router from './router'
import { AUTH_UNAUTHORIZED_EVENT } from './api'

const app = createApp(App)

if (typeof window !== 'undefined') {
  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, () => {
    const currentRoute = router.currentRoute.value
    if (currentRoute.meta.public) return

    const redirect = currentRoute.fullPath
    queueMicrotask(() => {
      router.replace({ name: 'login', query: { redirect } })
    })
  })
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: undefined })
app.mount('#app')
