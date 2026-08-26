<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type PeopleTab = 'equipe' | 'diretoria'

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
  year: string
  description: string
  competitions: string
  result: string
}

type Award = {
  id: number
  title: string
  event: string
  date: string
  modality: string
  team: string
  robot: string
  description: string
}

const activePeopleTab = ref<PeopleTab>('equipe')
const activePersonId = ref<number | null>(1)
const openRobotId = ref<number | null>(1)
const openAwardId = ref<number | null>(1)

const team: Person[] = [
  { id: 1, name: 'Integrante 01', area: 'Follow Line', initials: '01' },
  { id: 2, name: 'Integrante 02', area: 'Sumô', initials: '02' },
  { id: 3, name: 'Integrante 03', area: 'Eletrônica', initials: '03' },
  { id: 4, name: 'Integrante 04', area: 'Programação', initials: '04' },
  { id: 5, name: 'Integrante 05', area: 'Extensão', initials: '05' },
  { id: 6, name: 'Integrante 06', area: 'Projetos', initials: '06' }
]

const board: Person[] = [
  { id: 11, name: 'Diretor(a) 01', area: 'Gestão do capítulo', role: 'Presidência', initials: 'P' },
  { id: 12, name: 'Diretor(a) 02', area: 'Gestão do capítulo', role: 'Vice-presidência', initials: 'VP' },
  { id: 13, name: 'Diretor(a) 03', area: 'Organização', role: 'Secretaria', initials: 'S' },
  { id: 14, name: 'Diretor(a) 04', area: 'Projetos e atividades', role: 'Diretoria técnica', initials: 'DT' },
  { id: 15, name: 'Diretor(a) 05', area: 'Comunicação', role: 'Diretoria de comunicação', initials: 'DC' }
]

const robots: Robot[] = [
  {
    id: 1,
    name: 'Vespa',
    modality: 'Follow Line',
    year: 'Projeto em destaque',
    description: 'Espaço preparado para apresentar trajetória, construção e evolução técnica do robô.',
    competitions: 'Competições e participações serão adicionadas com o histórico oficial.',
    result: 'Resultados relevantes serão vinculados ao acervo institucional.'
  },
  {
    id: 2,
    name: 'Robô 02',
    modality: 'Sumô',
    year: 'Ano a confirmar',
    description: 'Placeholder para um dos robôs representativos do capítulo.',
    competitions: 'Participações a confirmar.',
    result: 'Resultados a confirmar.'
  },
  {
    id: 3,
    name: 'Robô 03',
    modality: 'Projeto especial',
    year: 'Ano a confirmar',
    description: 'Placeholder para projeto de robótica ou automação desenvolvido pela equipe.',
    competitions: 'Histórico será preenchido com dados oficiais.',
    result: 'Conquistas e reconhecimentos serão adicionados depois.'
  }
]

const awards: Award[] = [
  {
    id: 1,
    title: 'Premiação em destaque',
    event: 'Evento a confirmar',
    date: 'Data a confirmar',
    modality: 'Modalidade a confirmar',
    team: 'Equipe RAS UFRB',
    robot: 'Robô a confirmar',
    description: 'Espaço reservado para uma das principais conquistas da equipe, com contexto e resultado.'
  },
  {
    id: 2,
    title: 'Resultado de competição',
    event: 'Competição a confirmar',
    date: 'Data a confirmar',
    modality: 'Modalidade a confirmar',
    team: 'Equipe RAS UFRB',
    robot: 'Robô a confirmar',
    description: 'Registro institucional de participação, colocação e impacto técnico da conquista.'
  },
  {
    id: 3,
    title: 'Reconhecimento institucional',
    event: 'Instituição/evento a confirmar',
    date: 'Data a confirmar',
    modality: 'Capítulo / projeto',
    team: 'RAS UFRB',
    robot: '—',
    description: 'Espaço para prêmio, menção, certificado ou reconhecimento recebido pelo capítulo.'
  }
]

const visiblePeople = computed(() => (activePeopleTab.value === 'equipe' ? team : board))

watch(activePeopleTab, () => {
  activePersonId.value = visiblePeople.value[0]?.id ?? null
})

function togglePerson(id: number) {
  activePersonId.value = activePersonId.value === id ? null : id
}

function toggleRobot(id: number) {
  openRobotId.value = openRobotId.value === id ? null : id
}

function toggleAward(id: number) {
  openAwardId.value = openAwardId.value === id ? null : id
}
</script>

<template>
  <section id="equipe" class="team-robots-awards-section">
    <div class="team-robots-awards-container">
      <header class="team-robots-awards-heading">
        <span>Pessoas, projetos e conquistas</span>
        <h2>Quem constrói a RAS UFRB e o que já nasceu daqui.</h2>
        <p>
          Uma visão do time, da diretoria, dos robôs desenvolvidos e das conquistas que ajudam a contar a trajetória do capítulo.
        </p>
      </header>

      <div class="team-robots-awards-grid">
        <article class="people-showcase-card">
          <div class="people-showcase-topbar">
            <div>
              <span>Nosso time</span>
              <strong>{{ activePeopleTab === 'equipe' ? 'Equipe' : 'Diretoria' }}</strong>
            </div>

            <div class="people-tabs" role="tablist" aria-label="Equipe e diretoria">
              <button
                type="button"
                role="tab"
                :aria-selected="activePeopleTab === 'equipe'"
                :class="{ active: activePeopleTab === 'equipe' }"
                @click="activePeopleTab = 'equipe'"
              >
                Equipe
              </button>
              <button
                type="button"
                role="tab"
                :aria-selected="activePeopleTab === 'diretoria'"
                :class="{ active: activePeopleTab === 'diretoria' }"
                @click="activePeopleTab = 'diretoria'"
              >
                Diretoria
              </button>
            </div>
          </div>

          <div class="people-strip" :class="{ board: activePeopleTab === 'diretoria' }">
            <button
              v-for="person in visiblePeople"
              :key="person.id"
              type="button"
              class="person-card"
              :class="{ active: activePersonId === person.id }"
              @mouseenter="activePersonId = person.id"
              @focus="activePersonId = person.id"
              @click="togglePerson(person.id)"
            >
              <span class="person-photo-placeholder" aria-hidden="true">
                <b>{{ person.initials }}</b>
                <small>foto</small>
              </span>

              <span class="person-gradient" aria-hidden="true" />

              <span class="person-copy">
                <small v-if="person.role">{{ person.role }}</small>
                <strong>{{ person.name }}</strong>
                <span>{{ person.area }}</span>
              </span>
            </button>
          </div>

          <footer class="people-showcase-footer">
            <p>
              Passe o cursor sobre um integrante — ou toque no celular — para destacar sua foto, nome e área de atuação.
            </p>
            <a href="#contato">Conheça o capítulo <span aria-hidden="true">→</span></a>
          </footer>
        </article>

        <aside class="legacy-showcase-stack">
          <section class="legacy-panel robots-panel">
            <header>
              <div>
                <span>Projetos em movimento</span>
                <h3>Robôs</h3>
              </div>
              <strong>03</strong>
            </header>

            <div class="legacy-list">
              <article v-for="robot in robots" :key="robot.id" class="legacy-item" :class="{ open: openRobotId === robot.id }">
                <button type="button" class="legacy-trigger" :aria-expanded="openRobotId === robot.id" @click="toggleRobot(robot.id)">
                  <span class="legacy-index">0{{ robot.id }}</span>
                  <span class="legacy-trigger-copy">
                    <strong>{{ robot.name }}</strong>
                    <small>{{ robot.modality }} · {{ robot.year }}</small>
                  </span>
                  <span class="legacy-plus" aria-hidden="true">{{ openRobotId === robot.id ? '−' : '+' }}</span>
                </button>

                <div v-if="openRobotId === robot.id" class="legacy-detail robot-detail">
                  <div class="robot-detail-media" aria-hidden="true">
                    <span>foto do robô</span>
                  </div>
                  <div>
                    <p>{{ robot.description }}</p>
                    <dl>
                      <div><dt>Modalidade</dt><dd>{{ robot.modality }}</dd></div>
                      <div><dt>Competições</dt><dd>{{ robot.competitions }}</dd></div>
                      <div><dt>Destaque</dt><dd>{{ robot.result }}</dd></div>
                    </dl>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="legacy-panel awards-panel">
            <header>
              <div>
                <span>Principais resultados</span>
                <h3>Premiações</h3>
              </div>
              <strong>03</strong>
            </header>

            <div class="legacy-list">
              <article v-for="award in awards" :key="award.id" class="legacy-item" :class="{ open: openAwardId === award.id }">
                <button type="button" class="legacy-trigger" :aria-expanded="openAwardId === award.id" @click="toggleAward(award.id)">
                  <span class="award-medal" aria-hidden="true">✦</span>
                  <span class="legacy-trigger-copy">
                    <strong>{{ award.title }}</strong>
                    <small>{{ award.event }} · {{ award.date }}</small>
                  </span>
                  <span class="legacy-plus" aria-hidden="true">{{ openAwardId === award.id ? '−' : '+' }}</span>
                </button>

                <div v-if="openAwardId === award.id" class="legacy-detail award-detail">
                  <p>{{ award.description }}</p>
                  <dl>
                    <div><dt>Modalidade</dt><dd>{{ award.modality }}</dd></div>
                    <div><dt>Equipe</dt><dd>{{ award.team }}</dd></div>
                    <div><dt>Robô</dt><dd>{{ award.robot }}</dd></div>
                  </dl>
                </div>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </section>
</template>
