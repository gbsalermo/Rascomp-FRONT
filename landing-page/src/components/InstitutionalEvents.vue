<script setup lang="ts">
import { ref } from 'vue'

type EventTone = 'red' | 'purple' | 'neutral' | 'mixed'

type InstitutionalEvent = {
  id: string
  index: string
  title: string
  category: string
  summary: string
  objective: string
  audience: string
  periodicity: string
  history: string
  tone: EventTone
  cta: string
  href: string
}

const openEventId = ref('rrc')

const events: InstitutionalEvent[] = [
  {
    id: 'rrc',
    index: '01',
    title: 'RRC',
    category: 'Competição de robótica',
    summary: 'Um dos eventos competitivos promovidos pela RAS UFRB, reunindo equipes, robôs, modalidades e desafios técnicos.',
    objective: 'Criar um ambiente prático de competição, desenvolvimento técnico e integração entre estudantes.',
    audience: 'Estudantes, equipes de robótica e comunidade acadêmica.',
    periodicity: 'Edições conforme calendário oficial do capítulo.',
    history: 'Fotos, regulamentos e registros das realizações poderão ser vinculados aqui.',
    tone: 'red',
    cta: 'Conhecer o RRC',
    href: '#competicao-atual'
  },
  {
    id: 'robodori',
    index: '02',
    title: 'Robodori',
    category: 'Robótica e integração',
    summary: 'Espaço reservado para apresentar o Robodori como uma das ações/eventos ligados à trajetória da RAS UFRB.',
    objective: 'Descrição institucional e objetivo oficial serão adicionados com o material definitivo do capítulo.',
    audience: 'Público e formato a confirmar com a organização.',
    periodicity: 'Periodicidade a confirmar.',
    history: 'Edições, fotos e destaques poderão ser organizados nesta área.',
    tone: 'purple',
    cta: 'Ver detalhes',
    href: '#galeria'
  },
  {
    id: 'schools',
    index: '03',
    title: 'RAS nas Escolas',
    category: 'Extensão',
    summary: 'Ações de aproximação entre robótica, tecnologia e estudantes, levando experiências práticas para além da universidade.',
    objective: 'Estimular interesse por ciência, engenharia, programação e robótica por meio de ações de extensão.',
    audience: 'Estudantes e comunidades atendidas pelas ações do capítulo.',
    periodicity: 'De acordo com o calendário de visitas e ações da RAS UFRB.',
    history: 'Cada visita poderá reunir fotos, instituição atendida e resumo das atividades realizadas.',
    tone: 'mixed',
    cta: 'Ver registros',
    href: '#galeria'
  },
  {
    id: 'workshops',
    index: '04',
    title: 'Oficinas',
    category: 'Formação e capacitação',
    summary: 'Atividades práticas voltadas à troca de conhecimento em robótica, eletrônica, programação e automação.',
    objective: 'Criar oportunidades de aprendizagem prática e compartilhamento de conhecimento técnico.',
    audience: 'Estudantes e participantes das atividades do capítulo.',
    periodicity: 'Conforme programação institucional e disponibilidade da equipe.',
    history: 'Temas, turmas, materiais e registros de cada oficina poderão ser apresentados aqui.',
    tone: 'neutral',
    cta: 'Ver oficinas',
    href: '#galeria'
  }
]

function toggleEvent(id: string) {
  openEventId.value = openEventId.value === id ? '' : id
}
</script>

<template>
  <section id="eventos" class="institutional-events-section">
    <div class="institutional-events-container">
      <header class="institutional-events-heading">
        <div>
          <span>Experiências que conectam</span>
          <h2>Eventos e ações da RAS UFRB</h2>
          <p>
            Competição, extensão, formação e integração fazem parte da atuação do capítulo dentro e fora da universidade.
          </p>
        </div>
        <a class="events-calendar-link" href="#calendario">Ver calendário <span aria-hidden="true">→</span></a>
      </header>

      <div class="institutional-events-list">
        <article
          v-for="event in events"
          :key="event.id"
          class="institutional-event-card"
          :class="[`tone-${event.tone}`, { open: openEventId === event.id }]"
        >
          <button
            type="button"
            class="institutional-event-trigger"
            :aria-expanded="openEventId === event.id"
            @click="toggleEvent(event.id)"
          >
            <span class="event-index">{{ event.index }}</span>

            <span class="event-title-block">
              <small>{{ event.category }}</small>
              <strong>{{ event.title }}</strong>
            </span>

            <span class="event-summary">{{ event.summary }}</span>

            <span class="event-toggle" aria-hidden="true">
              {{ openEventId === event.id ? '−' : '+' }}
            </span>
          </button>

          <div v-if="openEventId === event.id" class="institutional-event-detail">
            <div class="event-media-placeholder" aria-hidden="true">
              <div>
                <strong>{{ event.title }}</strong>
                <span>imagem do evento</span>
              </div>
            </div>

            <div class="event-detail-content">
              <div class="event-detail-grid">
                <article>
                  <span>Objetivo</span>
                  <p>{{ event.objective }}</p>
                </article>
                <article>
                  <span>Público</span>
                  <p>{{ event.audience }}</p>
                </article>
                <article>
                  <span>Periodicidade</span>
                  <p>{{ event.periodicity }}</p>
                </article>
              </div>

              <div class="event-detail-footer">
                <p>{{ event.history }}</p>
                <a :href="event.href">{{ event.cta }} <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <footer class="events-footnote">
        <span aria-hidden="true">◎</span>
        <p>Programação, datas e detalhes oficiais serão atualizados conforme o calendário institucional da RAS UFRB.</p>
      </footer>
    </div>
  </section>
</template>
