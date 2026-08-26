<script setup lang="ts">
import { computed, ref } from 'vue'

type Person = {
  id: number
  name: string
  area: string
  role?: string
  initials: string
}

type Robot = {
  id: number
  name: string
  modality: string
  status: string
  description: string
  detail: string
}

type Award = {
  id: number
  place: string
  title: string
  event: string
  year: string
  tone: 'gold' | 'silver' | 'bronze' | 'highlight'
}

const query = ref('')
const area = ref('Todos')
const openRobotId = ref<number | null>(null)

const team: Person[] = [
  { id: 1, name: 'Integrante 01', area: 'Programação', initials: '01' },
  { id: 2, name: 'Integrante 02', area: 'Eletrônica', initials: '02' },
  { id: 3, name: 'Integrante 03', area: 'Mecânica', initials: '03' },
  { id: 4, name: 'Integrante 04', area: 'Controle', initials: '04' },
  { id: 5, name: 'Integrante 05', area: 'Comunicação', initials: '05' },
  { id: 6, name: 'Integrante 06', area: 'Gestão', initials: '06' },
  { id: 7, name: 'Integrante 07', area: 'Follow Line', initials: '07' },
  { id: 8, name: 'Integrante 08', area: 'Sumô', initials: '08' }
]

const board: Person[] = [
  { id: 11, name: 'Diretor(a) 01', area: 'Gestão do capítulo', role: 'Presidência', initials: 'P' },
  { id: 12, name: 'Diretor(a) 02', area: 'Gestão do capítulo', role: 'Vice-presidência', initials: 'VP' },
  { id: 13, name: 'Diretor(a) 03', area: 'Organização', role: 'Tesouraria', initials: 'T' },
  { id: 14, name: 'Diretor(a) 04', area: 'Organização', role: 'Secretaria', initials: 'S' },
  { id: 15, name: 'Diretor(a) 05', area: 'Projetos', role: 'Diretoria técnica', initials: 'DT' },
  { id: 16, name: 'Diretor(a) 06', area: 'Comunicação', role: 'Diretoria de comunicação', initials: 'DC' }
]

const robots: Robot[] = [
  {
    id: 1,
    name: 'Vespa',
    modality: 'Follow Line',
    status: 'Ativo',
    description: 'Robô seguidor de linha preparado para competições e evolução contínua de controle e sensoriamento.',
    detail: 'Histórico de versões, sensores, competições e resultados será preenchido com o acervo oficial.'
  },
  {
    id: 2,
    name: 'PIPETA',
    modality: 'Automação',
    status: 'Ativo',
    description: 'Projeto de irrigação autônoma voltado a experimentação, automação e aplicação prática de sistemas embarcados.',
    detail: 'Detalhes técnicos, equipe responsável e reconhecimentos serão ligados ao histórico institucional.'
  },
  {
    id: 3,
    name: 'Projeto 03',
    modality: 'Robótica',
    status: 'Em desenvolvimento',
    description: 'Espaço reservado para outro projeto ou robô representativo do capítulo.',
    detail: 'Nome, modalidade e trajetória serão substituídos pelos dados oficiais.'
  }
]

const awards: Award[] = [
  { id: 1, place: '1º lugar', title: 'Premiação em robótica', event: 'Evento a confirmar', year: '2026', tone: 'gold' },
  { id: 2, place: '2º lugar', title: 'Resultado técnico', event: 'Evento a confirmar', year: '2025', tone: 'silver' },
  { id: 3, place: '3º lugar', title: 'Destaque em competição', event: 'Evento a confirmar', year: '2025', tone: 'bronze' },
  { id: 4, place: 'Destaque', title: 'Reconhecimento institucional', event: 'Evento a confirmar', year: '2025', tone: 'highlight' }
]

const areas = computed(() => ['Todos', ...Array.from(new Set(team.map((member) => member.area)))])

const filteredTeam = computed(() => {
  const normalized = query.value.trim().toLowerCase()
  return team.filter((member) => {
    const matchesArea = area.value === 'Todos' || member.area === area.value
    const matchesQuery = !normalized || `${member.name} ${member.area}`.toLowerCase().includes(normalized)
    return matchesArea && matchesQuery
  })
})

function toggleRobot(id: number) {
  openRobotId.value = openRobotId.value === id ? null : id
}
</script>

<template>
  <section id="equipe" class="team-robots-awards-section">
    <div class="team-robots-awards-container">
      <header class="team-robots-awards-heading">
        <span>Pessoas, robôs e conquistas</span>
        <h2>Equipe / Diretoria / Robôs / Premiações</h2>
        <p>Conheça as pessoas que movem a RAS UFRB, os projetos que construímos e algumas conquistas que ajudam a contar nossa trajetória.</p>
      </header>

      <div class="team-legacy-layout">
        <article class="team-list-panel institutional-legacy-card">
          <header class="legacy-card-heading">
            <div class="legacy-heading-icon" aria-hidden="true">◎</div>
            <div>
              <h3>Nossa Equipe</h3>
              <p>Integrantes do capítulo e suas áreas de atuação.</p>
            </div>
            <span class="legacy-count-pill">25+ membros</span>
          </header>

          <div class="team-search-row">
            <label class="team-search-field">
              <span class="sr-only">Buscar integrante</span>
              <input v-model="query" type="search" placeholder="Buscar membro..." />
              <span aria-hidden="true">⌕</span>
            </label>
            <label class="team-area-field">
              <span class="sr-only">Filtrar por área</span>
              <select v-model="area">
                <option v-for="item in areas" :key="item" :value="item">{{ item === 'Todos' ? 'Todas as áreas' : item }}</option>
              </select>
            </label>
          </div>

          <div class="team-member-list">
            <button v-for="person in filteredTeam" :key="person.id" type="button" class="team-member-row">
              <span class="team-member-photo" aria-hidden="true">{{ person.initials }}</span>
              <span class="team-member-copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.area }}</small>
              </span>
              <span class="team-member-arrow" aria-hidden="true">›</span>
            </button>
            <p v-if="!filteredTeam.length" class="team-empty">Nenhum integrante encontrado.</p>
          </div>

          <a href="#contato" class="legacy-outline-cta">Ver toda a equipe <span aria-hidden="true">→</span></a>
        </article>

        <article class="board-panel institutional-legacy-card">
          <header class="legacy-card-heading">
            <div class="legacy-heading-icon" aria-hidden="true">◉</div>
            <div>
              <h3>Diretoria</h3>
              <p>Liderança e organização do capítulo.</p>
            </div>
          </header>

          <div class="board-mosaic">
            <article v-for="person in board" :key="person.id" class="board-person-card">
              <div class="board-person-photo" aria-hidden="true">
                <b>{{ person.initials }}</b>
                <small>foto oficial</small>
              </div>
              <span class="board-person-shade" aria-hidden="true" />
              <div class="board-person-copy">
                <small>{{ person.role }}</small>
                <strong>{{ person.name }}</strong>
                <span>{{ person.area }}</span>
              </div>
            </article>
          </div>

          <a href="#contato" class="legacy-outline-cta red">Ver toda a diretoria <span aria-hidden="true">→</span></a>
        </article>

        <article class="robots-panel institutional-legacy-card">
          <header class="legacy-card-heading">
            <div class="legacy-heading-icon" aria-hidden="true">▣</div>
            <div>
              <h3>Nossos Robôs</h3>
              <p>Projetos que unem inovação, técnica e propósito.</p>
            </div>
          </header>

          <div class="robot-showcase-list">
            <article v-for="robot in robots" :key="robot.id" class="robot-showcase-card" :class="{ open: openRobotId === robot.id }">
              <button type="button" class="robot-showcase-main" :aria-expanded="openRobotId === robot.id" @click="toggleRobot(robot.id)">
                <span class="robot-showcase-media" aria-hidden="true">foto do robô</span>
                <span class="robot-showcase-copy">
                  <span class="robot-showcase-title-row">
                    <strong>{{ robot.name }}</strong>
                    <small>{{ robot.status }}</small>
                  </span>
                  <em>{{ robot.modality }}</em>
                  <p>{{ robot.description }}</p>
                  <span class="robot-more">Saiba mais <b aria-hidden="true">→</b></span>
                </span>
              </button>
              <div v-if="openRobotId === robot.id" class="robot-showcase-detail">{{ robot.detail }}</div>
            </article>
          </div>

          <a href="#eventos" class="legacy-outline-cta">Ver todos os robôs <span aria-hidden="true">→</span></a>
        </article>

        <article class="awards-panel institutional-legacy-card">
          <header class="legacy-card-heading awards-heading">
            <div class="legacy-heading-icon" aria-hidden="true">♜</div>
            <div>
              <h3>Premiações</h3>
              <p>Conquistas que refletem esforço, dedicação e evolução técnica.</p>
            </div>
          </header>

          <div class="awards-showcase-grid">
            <article v-for="award in awards" :key="award.id" class="award-showcase-card" :class="`tone-${award.tone}`">
              <span class="award-showcase-icon" aria-hidden="true">{{ award.tone === 'highlight' ? '☆' : '♜' }}</span>
              <div>
                <strong>{{ award.place }}</strong>
                <b>{{ award.title }}</b>
                <span>{{ award.event }}</span>
                <small>{{ award.year }}</small>
              </div>
            </article>
          </div>

          <a href="#galeria" class="legacy-outline-cta">Ver todas as conquistas <span aria-hidden="true">→</span></a>
        </article>
      </div>

      <div class="legacy-impact-strip" aria-label="Indicadores institucionais temporários">
        <article><span aria-hidden="true">◎</span><div><strong>25+</strong><small>Membros ativos</small></div></article>
        <article><span aria-hidden="true">▣</span><div><strong>7+</strong><small>Robôs desenvolvidos</small></div></article>
        <article><span aria-hidden="true">♜</span><div><strong>18+</strong><small>Competições participadas</small></div></article>
        <article><span aria-hidden="true">♜</span><div><strong>10+</strong><small>Prêmios conquistados</small></div></article>
        <article><span aria-hidden="true">▤</span><div><strong>8+</strong><small>Escolas visitadas</small></div></article>
      </div>
    </div>
  </section>
</template>
