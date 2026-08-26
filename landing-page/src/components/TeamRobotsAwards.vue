<script setup lang="ts">
import { ref } from 'vue'

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
const activeMemberId = ref<number | null>(1)
const openRobotId = ref<number | null>(1)
const openAwardId = ref<number | null>(1)

const team: Person[] = [
  { id: 1, name: 'Integrante 01', area: 'Follow Line', initials: '01' },
  { id: 2, name: 'Integrante 02', area: 'Sumô', initials: '02' },
  { id: 3, name: 'Integrante 03', area: 'Eletrônica', initials: '03' },
  { id: 4, name: 'Integrante 04', area: 'Programação', initials: '04' },
  { id: 5, name: 'Integrante 05', area: 'Extensão', initials: '05' },
  { id: 6, name: 'Integrante 06', area: 'Projetos', initials: '06' },
  { id: 7, name: 'Integrante 07', area: 'Comunicação', initials: '07' },
  { id: 8, name: 'Integrante 08', area: 'Robótica', initials: '08' }
]

const board: Person[] = [
  { id: 11, name: 'Diretor(a) 01', area: 'Gestão do capítulo', role: 'Presidência', initials: 'P' },
  { id: 12, name: 'Diretor(a) 02', area: 'Gestão do capítulo', role: 'Vice-presidência', initials: 'VP' },
  { id: 13, name: 'Diretor(a) 03', area: 'Organização', role: 'Secretaria', initials: 'S' },
  { id: 14, name: 'Diretor(a) 04', area: 'Projetos e atividades', role: 'Diretoria técnica', initials: 'DT' },
  { id: 15, name: 'Diretor(a) 05', area: 'Comunicação', role: 'Diretoria de comunicação', initials: 'DC' },
  { id: 16, name: 'Diretor(a) 06', area: 'Extensão', role: 'Diretoria de extensão', initials: 'DE' }
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

function toggleMember(id: number) {
  activeMemberId.value = activeMemberId.value === id ? null : id
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
          Conheça quem faz parte do capítulo, a diretoria, os robôs desenvolvidos e algumas das conquistas que marcam nossa trajetória.
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

          <div v-if="activePeopleTab === 'equipe'" class="team-member-list" role="tabpanel">
            <button
              v-for="person in team"
              :key="person.id"
              type="button"
              class="team-member-row"
              :class="{ active: activeMemberId === person.id }"
              @mouseenter="activeMemberId = person.id"
              @focus="activeMemberId = person.id"
              @click="toggleMember(person.id)"
            >
              <span class="team-member-photo" aria-hidden="true">
                <b>{{ person.initials }}</b>
                <small>foto</small>
              </span>
              <span class="team-member-copy">
                <strong>{{ person.name }}</strong>
                <small>{{ person.area }}</small>
              </span>
              <span class="team-member-arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <div v-else class="board-mosaic" role="tabpanel">
            <article v-for="person in board" :key="person.id" class="board-person-card">
              <div class="board-person-photo" aria-hidden="true">
                <span>{{ person.initials }}</span>
                <small>foto oficial</small>
              </div>
              <div class="board-person-overlay" />
              <div class="board-person-copy">
                <small>{{ person.role }}</small>
                <strong>{{ person.name }}</strong>
                <span>{{ person.area }}</span>
              </div>
            </article>
          </div>

          <footer class="people-showcase-footer">
            <p v-if="activePeopleTab === 'equipe'">
              A equipe aparece como lista para comportar melhor muitos integrantes. Ao passar o cursor ou tocar, o item ganha destaque.
            </p>
            <p v-else>
              A diretoria mantém o mosaico fotográfico para destacar funções e lideranças do capítulo.
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
                  <div class="robot-detail-media" aria-hidden="true"><span>foto do robô</span></div>
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
