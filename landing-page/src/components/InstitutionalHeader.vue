<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  competition?: any
  managementUrl: string
  registrationOpen: boolean
  competitionModeEnabled: boolean
}>()

const emit = defineEmits<{
  (event: 'registrationUnavailable'): void
}>()

const mobileOpen = ref(false)
const competitionMenu = ref<HTMLDetailsElement>()

const publicCompetitionStatuses = ['INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO']

const competitionVisible = computed(() =>
  props.competitionModeEnabled &&
  publicCompetitionStatuses.includes(props.competition?.status)
)

const competitionNoticeLabel = computed(() => {
  const name = props.competition?.nome || 'Competição'

  if (props.competition?.status === 'INSCRICOES_ABERTAS') {
    return `${name} · inscrições abertas`
  }

  if (props.competition?.status === 'INSCRICOES_ENCERRADAS') {
    return `${name} · inscrições encerradas`
  }

  return `${name} em andamento`
})

const participantAccess = computed(() =>
  ['INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO'].includes(props.competition?.status)
)

const competitionNoticeAction = computed(() =>
  props.competition?.status === 'EM_ANDAMENTO' ? 'Acompanhar competição' : 'Ver competição'
)

function closeMobile() {
  mobileOpen.value = false
  if (competitionMenu.value) competitionMenu.value.open = false
}
</script>

<template>
  <div class="institutional-header-wrap">
    <div v-if="competitionVisible" class="competition-notice">
      <div class="header-container competition-notice-inner">
        <span class="competition-notice-status">
          <span class="competition-notice-dot" aria-hidden="true" />
          <b>{{ competitionNoticeLabel }}</b>
        </span>

        <a href="#competicao-atual" @click="closeMobile">
          {{ competitionNoticeAction }} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <header class="site-header institutional-header">
      <div
        class="header-container header-main-row"
        :class="{ 'header-main-row--institutional': !competitionModeEnabled }"
      >
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

          <details v-if="competitionVisible" ref="competitionMenu" class="competition-nav-dropdown">
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

        <template v-if="competitionModeEnabled">
          <a
            v-if="(registrationOpen || participantAccess) && managementUrl"
            class="header-registration-cta desktop-registration-cta"
            :href="managementUrl"
            @click="closeMobile"
          >
            {{ participantAccess ? 'Área do participante' : 'Inscrever-se' }}
          </a>
          <button
            v-else
            type="button"
            class="header-registration-cta desktop-registration-cta"
            @click="closeMobile(); emit('registrationUnavailable')"
          >
            {{ participantAccess ? 'Área do participante' : 'Inscrever-se' }}
          </button>
        </template>

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
