<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  LANDING_EVENTS,
  RECENT_LANDING_EVENTS,
  type LandingEvent
} from '../content/events'

const props = defineProps<{
  managementUrl: string
  registrationOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'registrationUnavailable'): void
}>()

type EventFilter =
  | 'Todos os eventos'
  | 'Organizados pela RAS'
  | 'Participações'
  | 'Oficinas'
  | 'Palestras'
  | 'Competições'

const filters: EventFilter[] = [
  'Todos os eventos',
  'Organizados pela RAS',
  'Participações',
  'Oficinas',
  'Palestras',
  'Competições'
]

const activeFilter = ref<EventFilter>('Todos os eventos')
const expandedEventId = ref<string>(LANDING_EVENTS[0]?.id || '')
const fullAgenda = ref(false)

const visibleEvents = computed(() => {
  if (activeFilter.value === 'Todos os eventos') return LANDING_EVENTS

  if (activeFilter.value === 'Organizados pela RAS') {
    return LANDING_EVENTS.filter((event) => event.organizedByRas)
  }

  return LANDING_EVENTS.filter((event) => event.type === activeFilter.value)
})

const agendaEvents = computed(() =>
  fullAgenda.value ? visibleEvents.value : visibleEvents.value.slice(0, 4)
)

const highlightedEvents = computed(() => visibleEvents.value.slice(0, 4))

watch(visibleEvents, (events) => {
  if (!events.some((event) => event.id === expandedEventId.value)) {
    expandedEventId.value = events[0]?.id || ''
  }
  fullAgenda.value = false
})

function toggleEvent(event: LandingEvent) {
  expandedEventId.value = expandedEventId.value === event.id ? '' : event.id
}

function isRegistrationAction(event: LandingEvent) {
  return event.cta === 'Inscrever-se' || event.temporalLabel === 'Inscrições abertas'
}

function eventActionHref(event: LandingEvent) {
  if (event.href) return event.href
  if (isRegistrationAction(event) && props.registrationOpen && props.managementUrl) {
    return props.managementUrl
  }
  return ''
}

</script>

<template>
  <section id="eventos" class="institutional-events-section">
    <div class="institutional-events-container">
      <header class="institutional-events-heading">
        <span>Atuação e comunidade</span>
        <h2>Eventos da RAS</h2>
        <p>Participamos, organizamos e promovemos eventos que conectam conhecimento, inovação e comunidade.</p>
      </header>

      <div class="events-filter-row" aria-label="Filtrar eventos">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          <span class="event-filter-icon" aria-hidden="true">
            <svg v-if="filter === 'Todos os eventos'" viewBox="0 0 24 24">
              <rect x="4" y="4" width="6" height="6" rx="1"/>
              <rect x="14" y="4" width="6" height="6" rx="1"/>
              <rect x="4" y="14" width="6" height="6" rx="1"/>
              <rect x="14" y="14" width="6" height="6" rx="1"/>
            </svg>
            <svg v-else-if="filter === 'Organizados pela RAS'" viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3"/>
              <circle cx="17" cy="9" r="2.5"/>
              <path d="M3 20c0-4 2.7-7 6-7s6 3 6 7M14 14c3.7 0 7 2.2 7 6"/>
            </svg>
            <svg v-else-if="filter === 'Participações'" viewBox="0 0 24 24">
              <path d="M8 4h8v4c0 3-2 5-4 5s-4-2-4-5V4Z"/>
              <path d="M6 5H3v2c0 3 2 5 5 5M18 5h3v2c0 3-2 5-5 5M12 13v4M8 21h8M10 17h4"/>
            </svg>
            <svg v-else-if="filter === 'Oficinas'" viewBox="0 0 24 24">
              <path d="m14 6 4-4 4 4-4 4M4 20l8-8M3 16l5 5M10 5l3 3"/>
            </svg>
            <svg v-else-if="filter === 'Palestras'" viewBox="0 0 24 24">
              <rect x="9" y="3" width="6" height="11" rx="3"/>
              <path d="M6 10v1a6 6 0 0 0 12 0v-1M12 17v4M8 21h8"/>
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path d="M5 21V4M5 5h11l-2 4 2 4H5"/>
            </svg>
          </span>
          {{ filter }}
        </button>
      </div>

      <div class="events-primary-grid">
        <aside class="events-surface events-agenda-panel">
          <header class="events-panel-heading">
            <div>
              <span class="events-panel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="16" rx="2"/>
                  <path d="M7 3v4M17 3v4M3 10h18"/>
                </svg>
              </span>
              <div>
                <h3>Próximos na agenda</h3>
                <p>Fique por dentro dos nossos próximos eventos.</p>
              </div>
            </div>
          </header>

          <div v-if="agendaEvents.length" class="events-agenda-list">
            <button
              v-for="event in agendaEvents"
              :key="event.id"
              type="button"
              class="events-agenda-row"
              :class="{ active: event.id === expandedEventId }"
              @click="expandedEventId = event.id"
            >
              <span class="events-agenda-date">
                <strong>{{ event.dateDay }}</strong>
                <small>{{ event.dateMonth }}</small>
              </span>

              <span class="events-agenda-copy">
                <strong>{{ event.title }}</strong>
                <small>{{ event.eyebrow }}</small>
              </span>

              <span class="events-temporal-badge" :class="`tone-${event.tone}`">
                {{ event.temporalLabel }}
              </span>
            </button>
          </div>

          <div v-else class="events-empty-state events-empty-state--agenda">
            <strong>Nenhum evento nesta categoria.</strong>
          </div>

          <button
            v-if="visibleEvents.length > 4"
            type="button"
            class="events-agenda-more"
            @click="fullAgenda = !fullAgenda"
          >
            {{ fullAgenda ? 'Mostrar menos' : 'Ver agenda completa' }}
            <span aria-hidden="true">→</span>
          </button>
        </aside>

        <section class="events-surface events-featured-panel">
          <header class="events-panel-heading">
            <div>
              <span class="events-panel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 2.6 5.2 5.7.8-4.1 4 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.1-4 5.7-.8L12 3Z"/>
                </svg>
              </span>
              <div>
                <h3>Eventos em destaque</h3>
                <p>Explore nossos principais eventos. Clique em um card para ver mais detalhes.</p>
              </div>
            </div>
          </header>

          <div v-if="highlightedEvents.length" class="events-accordion">
            <article
              v-for="event in highlightedEvents"
              :key="event.id"
              class="event-accordion-card"
              :class="{ expanded: event.id === expandedEventId }"
            >
              <button
                type="button"
                class="event-accordion-trigger"
                :aria-expanded="event.id === expandedEventId"
                @click="toggleEvent(event)"
              >
                <img :src="event.image" :alt="event.title" />

                <span class="event-accordion-summary">
                  <span class="event-accordion-date">{{ event.dateLabel }}</span>
                  <strong>{{ event.title }}</strong>
                  <small>{{ event.summary }}</small>
                </span>

                <span class="event-accordion-badges">
                  <span class="event-type-badge" :class="`tone-${event.tone}`">{{ event.type }}</span>
                  <span class="event-time-badge">{{ event.temporalLabel }}</span>
                </span>

                <span class="event-accordion-chevron" aria-hidden="true">
                  {{ event.id === expandedEventId ? '⌃' : '⌄' }}
                </span>
              </button>

              <div v-if="event.id === expandedEventId" class="event-accordion-content">
                <div class="event-accordion-visual">
                  <img :src="event.image" :alt="event.title" />
                </div>

                <div class="event-accordion-details">
                  <div class="event-detail-meta">
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2"/>
                        <path d="M7 3v4M17 3v4M3 10h18"/>
                      </svg>
                      {{ event.dateLabel }}
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/>
                        <circle cx="12" cy="10" r="2"/>
                      </svg>
                      {{ event.location }}
                    </span>
                  </div>

                  <h4>{{ event.title }}</h4>
                  <p>{{ event.description }}</p>

                  <div class="event-detail-highlights">
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 4h8v4c0 3-2 5-4 5s-4-2-4-5V4Z"/>
                        <path d="M6 5H3v2c0 3 2 5 5 5M18 5h3v2c0 3-2 5-5 5"/>
                      </svg>
                      {{ event.type }}
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 2 2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2Z"/>
                      </svg>
                      Inovação
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="5" y="5" width="14" height="14" rx="2"/>
                        <path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
                      </svg>
                      Tecnologia
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="8" cy="8" r="3"/>
                        <circle cx="16" cy="8" r="3"/>
                        <path d="M2 21c0-4 2.6-7 6-7s6 3 6 7M12 15c1-.7 2.3-1 4-1 3.4 0 6 3 6 7"/>
                      </svg>
                      Comunidade
                    </span>
                  </div>

                  <div
                    v-if="event.cta && (eventActionHref(event) || isRegistrationAction(event))"
                    class="event-detail-actions"
                  >
                    <a
                      v-if="eventActionHref(event)"
                      class="event-primary-action"
                      :href="eventActionHref(event)"
                    >
                      {{ event.cta }} <span aria-hidden="true">→</span>
                    </a>

                    <button
                      v-else-if="isRegistrationAction(event)"
                      type="button"
                      class="event-primary-action"
                      @click="emit('registrationUnavailable')"
                    >
                      {{ event.cta }} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="events-empty-state">
            <strong>Nenhum evento nesta categoria por enquanto.</strong>
            <p>Quando houver uma atividade correspondente, ela aparecerá aqui.</p>
          </div>
        </section>
      </div>

      <section class="events-surface events-recent-panel">
        <header class="events-recent-heading">
          <div>
            <span class="events-panel-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 2"/>
              </svg>
            </span>
            <div>
              <h3>Eventos recentes</h3>
              <p>Registros das nossas últimas atividades realizadas.</p>
            </div>
          </div>

          <button
            type="button"
            class="events-recent-link"
            @click="activeFilter = 'Todos os eventos'; fullAgenda = true"
          >
            Ver todos os eventos <span aria-hidden="true">→</span>
          </button>
        </header>

        <div class="events-recent-grid">
          <article
            v-for="event in RECENT_LANDING_EVENTS"
            :key="event.id"
            class="event-recent-card"
          >
            <div class="event-recent-media">
              <img :src="event.image" :alt="event.title" />
            </div>

            <div class="event-recent-copy">
              <div class="event-recent-meta">
                <span>{{ event.dateLabel }}</span>
                <span class="event-type-badge" :class="`tone-${event.tone}`">{{ event.category }}</span>
              </div>
              <strong>{{ event.title }}</strong>
              <p>{{ event.summary }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
