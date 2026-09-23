<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="login-page">
    <div class="login-shell auth-shell-compact">
      <section class="login-brand-panel" aria-label="Identidade RASCOMP">
        <div class="login-brand-content">
          <svg class="login-robot-icon" viewBox="0 0 96 96" aria-hidden="true">
            <path d="M48 15v10" />
            <circle cx="48" cy="11" r="4" />
            <rect x="22" y="28" width="52" height="45" rx="14" />
            <path d="M22 43H12v17h10M74 43h10v17H74" />
            <circle cx="38" cy="49" r="4" />
            <circle cx="58" cy="49" r="4" />
            <path d="M37 61c3 4 7 6 11 6s8-2 11-6" />
          </svg>
          <strong class="login-brand-name">RasComp</strong>
          <span class="login-brand-subtitle">Recuperação de acesso</span>
          <span class="login-brand-event">RAS UFRB · RRC</span>
        </div>
      </section>

      <section class="login-form-panel">
        <div class="login-card">
          <header class="login-form-heading">
            <h1>Recuperar senha</h1>
            <p>Infelizmente, a recuperação automática de senha ainda não está disponível nesta versão do RasComp.</p>
          </header>

          <div class="auth-pending-note">
            <strong>Precisa recuperar seu acesso?</strong>
            <span>Por enquanto, entre em contato com a organização da competição para receber suporte. A recuperação direta pelo próprio RasComp será disponibilizada em uma etapa futura.</span>
          </div>

          <div class="auth-secondary-action">
            <router-link to="/login">← Voltar para o login</router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </div>
      </section>
    </div>
  </div>
</template>
