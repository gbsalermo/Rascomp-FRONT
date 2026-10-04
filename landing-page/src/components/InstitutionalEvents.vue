<script setup lang="ts">
import { computed, ref } from 'vue'
import { LANDING_EVENTS } from '../content/events'

type EventFilter = 'Todos os eventos' | 'Organizados pela RAS' | 'Participações' | 'Oficinas' | 'Palestras' | 'Competições'
type EventTone = 'red' | 'purple' | 'blue' | 'green'

type PastEvent = {
  id: string
  title: string
  category: string
  date: string
  tone: EventTone
}

const activeFilter = ref<EventFilter>('Todos os eventos')
const newsletterEmail = ref('')
const newsletterSent = ref(false)

const filters: EventFilter[] = ['Todos os eventos', 'Organizados pela RAS', 'Participações', 'Oficinas', 'Palestras', 'Competições']

const events = LANDING_EVENTS

const pastEvents: PastEvent[] = [
  { id: 'rrc-2025', title: 'RRC 2025', category: 'Competição de Robótica', date: 'Nov 2025', tone: 'red' },
  { id: 'impressao-3d', title: 'Oficina de Impressão 3D', category: 'Modelagem e impressão', date: 'Out 2025', tone: 'purple' },
  { id: 'robos-autonomos', title: 'Palestra: Robôs Autônomos', category: 'Desafios e aplicações', date: 'Set 2025', tone: 'blue' },
  { id: 'escolas-2025', title: 'RAS nas Escolas', category: 'Colégio Estadual', date: 'Ago 2025', tone: 'green' }
]

const visibleEvents = computed(() => {
  if (activeFilter.value === 'Todos os eventos') return events.slice(0, 4)
  if (activeFilter.value === 'Organizados pela RAS') return events.filter((event) => event.organizedByRas).slice(0, 4)
  return events.filter((event) => event.type === activeFilter.value).slice(0, 4)
})

const agendaEvents = computed(() => events.slice(0, 4))

function submitNewsletter() {
  if (!newsletterEmail.value.trim()) return
  newsletterSent.value = true
}
</script>

<template>
  <section id="eventos" class="institutional-events-section">
    <div class="institutional-events-container">
      <header class="institutional-events-heading">
        <div>
          <span>Atuação e comunidade</span>
          <h2>Eventos da RAS</h2>
          <p>Participamos, organizamos e promovemos eventos que conectam conhecimento, inovação e comunidade.</p>
        </div>

        <div class="events-filter-row" aria-label="Filtrar eventos">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            :class="{ active: activeFilter === filter }"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
      </header>

      <div class="events-layout-grid">
        <div class="events-main-column">
          <section class="events-surface upcoming-events-surface">
            <header class="events-surface-heading">
              <div>
                <span class="surface-icon" aria-hidden="true">◫</span>
                <h3>Próximos Eventos</h3>
              </div>
              <small>{{ visibleEvents.length }} em destaque</small>
            </header>

            <div v-if="visibleEvents.length" class="upcoming-event-grid">
              <article v-for="event in visibleEvents" :key="event.id" class="upcoming-event-card" :class="`tone-${event.tone}`">
                <div class="upcoming-event-media">
                  <span v-if="event.status" class="event-status-badge">{{ event.status }}</span>
                  <div class="event-media-copy">
                    <small>{{ event.eyebrow }}</small>
                    <strong>{{ event.title }}</strong>
                  </div>
                </div>

                <div class="upcoming-event-body">
                  <div class="event-meta-line"><span aria-hidden="true">◷</span><strong>{{ event.dateLabel }}</strong></div>
                  <div class="event-meta-line"><span aria-hidden="true">⌖</span><span>{{ event.location }}</span></div>
                  <p>{{ event.summary }}</p>
                  <a :href="event.id === 'rrc-2026' ? '#competicao-atual' : '#galeria'">{{ event.cta }} <span aria-hidden="true">→</span></a>
                </div>
              </article>
            </div>

            <div v-else class="events-empty-state">
              <strong>Nenhum evento nesta categoria por enquanto.</strong>
              <p>Quando houver uma atividade correspondente, ela aparecerá aqui automaticamente.</p>
            </div>

            <a class="events-outline-cta" href="#calendario">Ver todos os eventos <span aria-hidden="true">→</span></a>
          </section>

          <section class="events-surface past-events-surface">
            <header class="events-surface-heading">
              <div>
                <span class="surface-icon" aria-hidden="true">▧</span>
                <h3>Destaques de eventos anteriores</h3>
              </div>
            </header>

            <div class="past-events-grid">
              <a v-for="event in pastEvents" :key="event.id" href="#galeria" class="past-event-card" :class="`tone-${event.tone}`">
                <div class="past-event-media"><span>{{ event.category }}</span></div>
                <div class="past-event-copy">
                  <div>
                    <strong>{{ event.title }}</strong>
                    <small>{{ event.category }}</small>
                  </div>
                  <span>{{ event.date }}</span>
                </div>
              </a>
            </div>
          </section>
        </div>

        <aside class="events-side-column">
          <section class="events-surface agenda-surface" id="calendario">
            <header class="events-surface-heading">
              <div>
                <span class="surface-icon" aria-hidden="true">◷</span>
                <h3>Próximos na agenda</h3>
              </div>
            </header>

            <div class="agenda-list">
              <article v-for="event in agendaEvents" :key="event.id" class="agenda-row">
                <div class="agenda-date">
                  <strong>{{ event.dateDay }}</strong>
                  <span>{{ event.dateMonth }}</span>
                </div>
                <div class="agenda-copy">
                  <strong>{{ event.title }}</strong>
                  <small>{{ event.eyebrow }}</small>
                </div>
                <span class="agenda-tag" :class="`tone-${event.tone}`">{{ event.type }}</span>
              </article>
            </div>

            <a class="agenda-link" href="#eventos">Ver agenda completa <span aria-hidden="true">→</span></a>
          </section>

          <section class="events-surface newsletter-surface">
            <header class="events-surface-heading">
              <div>
                <span class="surface-icon" aria-hidden="true">♢</span>
                <h3>Fique por dentro</h3>
              </div>
            </header>

            <p>Receba novidades sobre nossos eventos, inscrições e oportunidades.</p>

            <form class="newsletter-form" @submit.prevent="submitNewsletter">
              <input v-model="newsletterEmail" type="email" placeholder="Seu e-mail" aria-label="Seu e-mail" required />
              <button type="submit">Inscrever-se</button>
            </form>

            <small v-if="newsletterSent" class="newsletter-success">Cadastro demonstrativo realizado. A integração real será definida depois.</small>

            <div class="social-follow">
              <span>Ou acompanhe nossas redes</span>
              <div>
                <a href="#contato" aria-label="Instagram">◎</a>
                <a href="#contato" aria-label="YouTube">▶</a>
                <a href="#contato" aria-label="LinkedIn">in</a>
                <a href="#contato" aria-label="GitHub">⌘</a>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div class="events-impact-strip" aria-label="Indicadores de eventos">
        <article><span aria-hidden="true">◫</span><div><strong>20+</strong><small>Eventos realizados</small></div></article>
        <article><span aria-hidden="true">◉</span><div><strong>5k+</strong><small>Participantes impactados</small></div></article>
        <article><span aria-hidden="true">▥</span><div><strong>15+</strong><small>Escolas alcançadas</small></div></article>
        <article><span aria-hidden="true">✦</span><div><strong>8+</strong><small>Anos de tradição</small></div></article>
        <article><span aria-hidden="true">◎</span><div><strong>3</strong><small>Estados alcançados</small></div></article>
      </div>
    </div>
  </section>
</template>