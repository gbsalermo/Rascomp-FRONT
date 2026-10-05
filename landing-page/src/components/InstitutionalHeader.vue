<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  competition?: any
  managementUrl: string
}>()

const mobileOpen = ref(false)
const competitionMenu = ref<HTMLDetailsElement>()

const competitionLive = computed(() => props.competition?.status === 'EM_ANDAMENTO')
const competitionNoticeLabel = computed(() =>
  props.competition?.nome ? `${props.competition.nome} em andamento` : 'RRC em andamento'
)

function closeMobile() {
  mobileOpen.value = false
  if (competitionMenu.value) competitionMenu.value.open = false
}
</script>

<template>
  <div class="institutional-header-wrap">
    <div v-if="competitionLive" class="competition-notice">
      <div class="header-container competition-notice-inner">
        <span class="competition-notice-status">
          <span class="competition-notice-dot" aria-hidden="true" />
          <b>{{ competitionNoticeLabel }}</b>
        </span>

        <a href="#competicao-atual" @click="closeMobile">
          Acompanhar competição <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <header class="site-header institutional-header">
      <div class="header-container header-main-row">
        <a href="#top" class="institutional-brand" aria-label="RAS UFRB — início" @click="closeMobile">
          <img
            class="institutional-brand-logo"
            src="/ieee-ras-official.png"
            alt="IEEE Robotics & Automation Society"
          />
          <span class="institutional-brand-copy">
            <strong>IEEE RAS UFRB</strong>
            <small>Robotics & Automation Society</small>
          </span>
        </a>

        <nav
          id="public-primary-navigation"
          class="institutional-nav"
          :class="{ open: mobileOpen }"
          aria-label="Navegação principal"
        >
          <a href="#sobre" @click="closeMobile">Sobre</a>
          <a href="#equipe" @click="closeMobile">Equipe</a>
          <a href="#robos" @click="closeMobile">Robôs</a>
          <a href="#galeria" @click="closeMobile">Galeria</a>
          <a href="#eventos" @click="closeMobile">Eventos</a>

          <details v-if="competitionLive" ref="competitionMenu" class="competition-nav-dropdown">
            <summary>Competição <span aria-hidden="true">⌄</span></summary>
            <div class="competition-nav-menu">
              <a href="#competicao-atual" @click="closeMobile">Visão geral</a>
              <a href="#cronograma-competicao" @click="closeMobile">Cronograma</a>
              <a href="#resultados" @click="closeMobile">Resultados</a>
              <a href="#chaveamento" @click="closeMobile">Chaveamento</a>
            </div>
          </details>

          <a href="#contato" @click="closeMobile">Contato</a>
        </nav>

        <a
          v-if="managementUrl"
          class="header-registration-cta desktop-registration-cta"
          :href="managementUrl"
          @click="closeMobile"
        >
          Inscrever-se
        </a>
        <span
          v-else
          class="header-registration-cta header-registration-cta--disabled desktop-registration-cta"
          aria-disabled="true"
          title="Destino de inscrição ainda não configurado"
        >
          Inscrever-se
        </span>

        <button
          class="public-menu-toggle"
          :class="{ open: mobileOpen }"
          type="button"
          :aria-expanded="mobileOpen"
          aria-controls="public-primary-navigation"
          :aria-label="mobileOpen ? 'Fechar navegação' : 'Abrir navegação'"
          @click="mobileOpen = !mobileOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  </div>
</template>
