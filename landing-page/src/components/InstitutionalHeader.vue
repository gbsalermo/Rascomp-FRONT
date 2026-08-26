<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  competition?: any
  managementUrl: string
}>()

const mobileOpen = ref(false)

const competitionLive = computed(() => props.competition?.status === 'EM_ANDAMENTO')
const registrationsOpen = computed(() => props.competition?.status === 'INSCRICOES_ABERTAS')

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <div class="institutional-header-wrap">
    <div v-if="competitionLive" class="competition-notice">
      <div class="header-container competition-notice-inner">
        <span><b>RRC em andamento</b><span v-if="competition?.nome"> · {{ competition.nome }}</span></span>
        <a href="#competicao-atual">Acompanhar competição <span aria-hidden="true">→</span></a>
      </div>
    </div>

    <header class="site-header institutional-header">
      <div class="header-container header-main-row">
        <a href="#top" class="institutional-brand" aria-label="RAS UFRB — início" @click="closeMobile">
          <span class="institutional-brand-mark" aria-hidden="true">RAS</span>
          <span class="institutional-brand-copy">
            <strong>IEEE RAS UFRB</strong>
            <small>Robotics & Automation Society</small>
          </span>
        </a>

        <button
          class="public-menu-toggle"
          type="button"
          :aria-expanded="mobileOpen"
          aria-label="Abrir navegação"
          @click="mobileOpen = !mobileOpen"
        >
          <span />
          <span />
          <span />
        </button>

        <nav class="institutional-nav" :class="{ open: mobileOpen }" aria-label="Navegação principal">
          <a href="#top" class="active" @click="closeMobile">Início</a>
          <a href="#sobre" @click="closeMobile">Sobre</a>

          <details class="competition-nav-dropdown">
            <summary>Competição <span aria-hidden="true">⌄</span></summary>
            <div class="competition-nav-menu">
              <a href="#competicao-atual" @click="closeMobile">Competição atual</a>
              <a href="#cronograma-competicao" @click="closeMobile">Cronograma</a>
              <a href="#resultados" @click="closeMobile">Resultados</a>
              <a href="#chaveamento" @click="closeMobile">Chaveamento</a>
            </div>
          </details>

          <a href="#calendario" @click="closeMobile">Calendário</a>
          <a href="#eventos" @click="closeMobile">Eventos</a>
          <a href="#contato" @click="closeMobile">Contato</a>

          <a
            v-if="registrationsOpen"
            class="header-registration-cta mobile-registration-cta"
            :href="managementUrl"
            @click="closeMobile"
          >
            Inscrições
          </a>
        </nav>

        <a v-if="registrationsOpen" class="header-registration-cta desktop-registration-cta" :href="managementUrl">
          Inscrições
        </a>
      </div>
    </header>
  </div>
</template>
