<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type AboutTab = 'ieee' | 'ras'

const activeTab = ref<AboutTab>('ras')
const activePhoto = ref(0)
let timer: number | undefined

const photos = [
  { label: 'Equipe RAS UFRB', detail: 'Pessoas, projetos e experiências construídas em conjunto.' },
  { label: 'Premiações', detail: 'Conquistas que registram a evolução técnica e coletiva do capítulo.' },
  { label: 'Eventos e oficinas', detail: 'Ações de formação, extensão e aproximação com a comunidade.' },
  { label: 'Projetos', detail: 'Robótica, automação e iniciativas desenvolvidas pelos membros.' }
]

const content = computed(() => {
  if (activeTab.value === 'ieee') {
    return {
      eyebrow: 'IEEE',
      title: 'Tecnologia, conhecimento e comunidade em escala global.',
      paragraphs: [
        'O IEEE reúne profissionais, pesquisadores e estudantes ligados à engenharia, computação e áreas tecnológicas, promovendo o intercâmbio de conhecimento e o desenvolvimento técnico.',
        'Dentro desse ecossistema, sociedades técnicas e capítulos estudantis aproximam essa rede internacional da formação universitária e das iniciativas locais.'
      ],
      points: ['Comunidade técnica internacional', 'Formação e desenvolvimento profissional', 'Integração entre pesquisa, indústria e universidade']
    }
  }

  return {
    eyebrow: 'RAS UFRB',
    title: 'Robótica e automação que saem da sala de aula e chegam à comunidade.',
    paragraphs: [
      'A RAS UFRB é o capítulo estudantil da IEEE Robotics & Automation Society na Universidade Federal do Recôncavo da Bahia.',
      'O capítulo reúne estudantes em torno de robótica, automação, inovação e extensão, criando espaço para desenvolver projetos, participar de competições, promover oficinas e compartilhar conhecimento dentro e fora da universidade.'
    ],
    points: ['Projetos práticos de robótica e automação', 'Competições, oficinas e ações de extensão', 'Aprendizado colaborativo e desenvolvimento de equipe']
  }
})

function setPhoto(index: number) {
  activePhoto.value = index
}

function nextPhoto() {
  activePhoto.value = (activePhoto.value + 1) % photos.length
}

function previousPhoto() {
  activePhoto.value = (activePhoto.value - 1 + photos.length) % photos.length
}

onMounted(() => {
  timer = window.setInterval(nextPhoto, 6500)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <section id="sobre" class="institutional-about-section">
    <div class="institutional-about-container">
      <div class="institutional-about-heading">
        <span>Quem somos</span>
        <h2>Conheça a rede que nos conecta e o capítulo que transforma isso em prática.</h2>
      </div>

      <div class="institutional-about-grid">
        <div class="about-photo-slider" aria-label="Destaques institucionais da RAS UFRB">
          <div class="about-photo-frame">
            <div class="about-photo-placeholder">
              <span class="about-photo-kicker">Imagem institucional</span>
              <strong>{{ photos[activePhoto].label }}</strong>
              <p>{{ photos[activePhoto].detail }}</p>
            </div>

            <button class="about-photo-arrow previous" type="button" aria-label="Imagem anterior" @click="previousPhoto">‹</button>
            <button class="about-photo-arrow next" type="button" aria-label="Próxima imagem" @click="nextPhoto">›</button>

            <div class="about-photo-caption">
              <span>{{ String(activePhoto + 1).padStart(2, '0') }}</span>
              <div>
                <strong>{{ photos[activePhoto].label }}</strong>
                <small>Fotos oficiais serão adicionadas posteriormente.</small>
              </div>
            </div>
          </div>

          <div class="about-photo-dots" aria-label="Selecionar destaque visual">
            <button
              v-for="(photo, index) in photos"
              :key="photo.label"
              type="button"
              :class="{ active: index === activePhoto }"
              :aria-label="`Mostrar ${photo.label}`"
              @click="setPhoto(index)"
            />
          </div>
        </div>

        <div class="about-content-panel">
          <div class="about-tabs" role="tablist" aria-label="Sobre IEEE e RAS UFRB">
            <button
              type="button"
              role="tab"
              :aria-selected="activeTab === 'ieee'"
              :class="{ active: activeTab === 'ieee' }"
              @click="activeTab = 'ieee'"
            >
              IEEE
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeTab === 'ras'"
              :class="{ active: activeTab === 'ras' }"
              @click="activeTab = 'ras'"
            >
              RAS UFRB
            </button>
          </div>

          <div class="about-copy" role="tabpanel">
            <span class="about-copy-eyebrow">{{ content.eyebrow }}</span>
            <h3>{{ content.title }}</h3>
            <p v-for="paragraph in content.paragraphs" :key="paragraph">{{ paragraph }}</p>

            <div class="about-principles">
              <div v-for="point in content.points" :key="point">
                <span aria-hidden="true">✓</span>
                <strong>{{ point }}</strong>
              </div>
            </div>

            <div class="about-actions">
              <a href="#eventos" class="about-primary-link">Conheça nossas ações <span aria-hidden="true">→</span></a>
              <a href="#equipe" class="about-secondary-link">Ver equipe</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
