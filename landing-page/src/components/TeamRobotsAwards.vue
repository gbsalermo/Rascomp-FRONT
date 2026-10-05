<script setup lang="ts">
import { computed } from 'vue'

type BoardMember = {
  id: number
  name: string
  role: string
  area: string
  initials: string
}

type Award = {
  id: number
  place: string
  title: string
  event: string
  description: string
  year: string
  tone: 'gold' | 'silver' | 'bronze' | 'highlight'
}

const boardImageModules = import.meta.glob(
  '../assets/team/board/*.{jpg,jpeg,png,webp,avif}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>

const volunteerImageModules = import.meta.glob(
  '../assets/team/volunteers/*.{jpg,jpeg,png,webp,avif}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>

const board: BoardMember[] = [
  { id: 1, name: 'Presidente', role: 'Presidente', area: 'Gestão do capítulo', initials: 'P' },
  { id: 2, name: 'Vice-presidente', role: 'Vice-presidente', area: 'Gestão do capítulo', initials: 'VP' },
  { id: 3, name: 'Tesoureiro', role: 'Tesoureiro', area: 'Financeiro', initials: 'T' },
  { id: 4, name: 'Secretário', role: 'Secretário', area: 'Organização', initials: 'S' },
  { id: 5, name: 'Marketing', role: 'Marketing', area: 'Comunicação', initials: 'M' },
  { id: 6, name: 'Orientador', role: 'Orientador', area: 'Orientação acadêmica', initials: 'O' }
]

const boardImages = computed(() =>
  Object.entries(boardImageModules)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map(([, src]) => src)
)

const volunteerImages = computed(() =>
  Object.entries(volunteerImageModules)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map(([, src]) => src)
)

const volunteerLoopImages = computed(() =>
  volunteerImages.value.length > 1
    ? [...volunteerImages.value, ...volunteerImages.value]
    : volunteerImages.value
)

const awards: Award[] = [
  {
    id: 1,
    place: '1º lugar',
    title: 'Premiação em robótica',
    event: 'Evento a confirmar · Categoria a confirmar',
    description: 'Destaque em competição de robótica, representando evolução técnica, preparação e trabalho em equipe.',
    year: '2026',
    tone: 'gold'
  },
  {
    id: 2,
    place: '2º lugar',
    title: 'Resultado técnico',
    event: 'Evento a confirmar · Categoria a confirmar',
    description: 'Reconhecimento pelo desempenho técnico e pela estratégia desenvolvida pela equipe.',
    year: '2025',
    tone: 'silver'
  },
  {
    id: 3,
    place: '3º lugar',
    title: 'Destaque em competição',
    event: 'Evento a confirmar · Categoria a confirmar',
    description: 'Premiação pelo desenvolvimento de soluções criativas e eficientes em ambiente competitivo.',
    year: '2025',
    tone: 'bronze'
  },
  {
    id: 4,
    place: 'Destaque',
    title: 'Reconhecimento institucional',
    event: 'Instituição a confirmar',
    description: 'Reconhecimento pelo impacto das ações de extensão, formação e contribuição para a comunidade.',
    year: '2025',
    tone: 'highlight'
  }
]
</script>

<template>
  <section id="equipe" class="team-robots-awards-section">
    <div class="team-robots-awards-container">
      <header class="team-robots-awards-heading">
        <span>Pessoas e conquistas</span>
        <h2>Equipe e Conquistas</h2>
        <p>Conheça as pessoas que movem a RAS UFRB e algumas conquistas que ajudam a contar a trajetória do capítulo.</p>
      </header>

      <article class="team-board-block">
        <header class="team-section-heading">
          <div>
            <span class="team-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM1 21v-2c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v2H1Zm14-8c4.4 0 8 2.7 8 6v2h-6v-2c0-2.2-.8-4.2-2.2-5.7l.2-.3Z"/>
              </svg>
            </span>
            <div>
              <h3>Diretoria</h3>
              <p>Liderança e organização do capítulo.</p>
            </div>
          </div>

        </header>

        <div class="team-board-grid">
          <article v-for="(person, index) in board" :key="person.id" class="team-board-card">
            <img
              v-if="boardImages[index]"
              class="team-board-photo"
              :src="boardImages[index]"
              :alt="`${person.name} — ${person.role}`"
            />
            <div v-else class="team-board-photo-placeholder" aria-hidden="true">
              <strong>{{ person.initials }}</strong>
              <small>foto oficial</small>
            </div>

            <div class="team-board-shade" aria-hidden="true" />
            <div class="team-board-copy">
              <strong>{{ person.name }}</strong>
              <small>{{ person.area }}</small>
            </div>
          </article>
        </div>
      </article>

      <article class="team-volunteers-block">
        <header class="team-section-heading team-section-heading--simple">
          <div>
            <span class="team-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-9 9v-1c0-4.4 3.6-8 8-8h2c4.4 0 8 3.6 8 8v1H3Z"/>
              </svg>
            </span>
            <div>
              <h3>E outros voluntários que fazem tudo acontecer</h3>
              <p>Estudantes de diferentes áreas que contribuem com projetos, oficinas, competições e ações de extensão.</p>
            </div>
          </div>
        </header>

        <div
          v-if="volunteerImages.length"
          class="team-volunteer-carousel"
          aria-label="Registros coletivos dos voluntários da RAS UFRB"
        >
          <div
            class="team-volunteer-track"
            :class="{ 'is-static': volunteerImages.length === 1 }"
          >
            <figure
              v-for="(photo, index) in volunteerLoopImages"
              :key="`${photo}-${index}`"
              class="team-volunteer-slide"
              :aria-hidden="index >= volunteerImages.length ? 'true' : undefined"
            >
              <img
                :src="photo"
                :alt="index < volunteerImages.length ? `Registro coletivo de voluntários da RAS UFRB ${index + 1}` : ''"
              />
            </figure>
          </div>
        </div>

        <div v-else class="team-volunteer-placeholder">
          <span>Adicione fotos coletivas em <b>src/assets/team/volunteers/</b></span>
        </div>
      </article>

      <article class="team-awards-block">
        <header class="team-section-heading">
          <div>
            <span class="team-section-icon team-section-icon--award" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 3h10v3h4v3c0 3.1-1.7 5.7-4.2 7.1A6 6 0 0 1 13 19.9V22h4v2H7v-2h4v-2.1a6 6 0 0 1-3.8-3.8A8 8 0 0 1 3 9V6h4V3Zm0 5H5v1c0 1.8.8 3.4 2.1 4.5A11 11 0 0 1 7 12V8Zm10 0v4c0 .5 0 1-.1 1.5A5.7 5.7 0 0 0 19 9V8h-2Z"/>
              </svg>
            </span>
            <div>
              <h3>Premiações</h3>
              <p>Conquistas que refletem dedicação, trabalho em equipe e evolução técnica.</p>
            </div>
          </div>

          <a href="#galeria" class="team-outline-cta">Ver todas as conquistas <span aria-hidden="true">→</span></a>
        </header>

        <div class="team-awards-timeline">
          <article
            v-for="award in awards"
            :key="award.id"
            class="team-award-row"
            :class="`tone-${award.tone}`"
          >
            <span class="team-award-marker" aria-hidden="true" />
            <span class="team-award-icon" aria-hidden="true">
              <svg v-if="award.tone !== 'highlight'" viewBox="0 0 24 24">
                <path d="M7 3h10v3h4v3c0 3.1-1.7 5.7-4.2 7.1A6 6 0 0 1 13 19.9V22h4v2H7v-2h4v-2.1a6 6 0 0 1-3.8-3.8A8 8 0 0 1 3 9V6h4V3Zm0 5H5v1c0 1.8.8 3.4 2.1 4.5A11 11 0 0 1 7 12V8Zm10 0v4c0 .5 0 1-.1 1.5A5.7 5.7 0 0 0 19 9V8h-2Z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path d="m12 2 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 2Z"/>
              </svg>
            </span>

            <div class="team-award-main">
              <strong>{{ award.place }} — {{ award.title }}</strong>
              <span>{{ award.event }}</span>
            </div>

            <p>{{ award.description }}</p>
            <time>{{ award.year }}</time>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>
