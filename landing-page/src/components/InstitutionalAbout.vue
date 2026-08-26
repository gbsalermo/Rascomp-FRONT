<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type AboutTab = 'ieee' | 'ras'

const activeTab = ref<AboutTab>('ieee')
const activePhoto = ref(0)
let timer: number | undefined

const photos = [
  { label: 'Equipe RAS UFRB', detail: 'Membros reunidos em atividades, projetos e eventos do capítulo.', tone: 'team' },
  { label: 'Premiações', detail: 'Conquistas e reconhecimentos que registram a evolução do capítulo.', tone: 'award' },
  { label: 'Robótica em ação', detail: 'Competições, testes e desenvolvimento prático de robôs.', tone: 'robot' },
  { label: 'Projetos e oficinas', detail: 'Aprendizado colaborativo e formação tecnológica dentro e fora da UFRB.', tone: 'workshop' }
]

const metrics = [
  { value: '25+', label: 'Membros ativos', detail: 'Estudantes dedicados', icon: '◉', tone: 'purple' },
  { value: '7+', label: 'Robôs desenvolvidos', detail: 'Projetos que inovam', icon: '🤖', tone: 'red' },
  { value: '18+', label: 'Prêmios conquistados', detail: 'Em competições e eventos', icon: '🏆', tone: 'purple' },
  { value: '10+', label: 'Eventos realizados', detail: 'Oficinas, palestras e visitas', icon: '▣', tone: 'red' },
  { value: '8+', label: 'Escolas visitadas', detail: 'Levando ciência e tecnologia', icon: '⌂', tone: 'purple' }
]

const content = computed(() => {
  if (activeTab.value === 'ieee') {
    return {
      brand: 'IEEE',
      slogan: 'Advancing Technology for Humanity',
      intro:
        'O IEEE (Institute of Electrical and Electronics Engineers) é uma organização técnica profissional global dedicada ao avanço da tecnologia e à conexão entre estudantes, pesquisadores e profissionais.',
      points: [
        { icon: '◎', title: 'Alcance global', text: 'Uma rede internacional que conecta conhecimento, pessoas e diferentes áreas da engenharia e tecnologia.' },
        { icon: '◇', title: 'Inovação e impacto', text: 'Publicações, conferências, padrões e comunidades técnicas que impulsionam o desenvolvimento tecnológico.' },
        { icon: '△', title: 'Educação e desenvolvimento', text: 'Formação contínua, troca de experiências e incentivo ao crescimento de jovens talentos.' }
      ]
    }
  }

  return {
    brand: 'IEEE RAS UFRB',
    slogan: 'Robotics & Automation Society · Student Chapter',
    intro:
      'A RAS UFRB é o capítulo estudantil da IEEE Robotics & Automation Society na Universidade Federal do Recôncavo da Bahia, reunindo estudantes em torno de robótica, automação, inovação e extensão.',
    points: [
      { icon: '◎', title: 'Projetos práticos', text: 'Desenvolvimento de robôs e soluções que aproximam teoria, experimentação e engenharia aplicada.' },
      { icon: '◇', title: 'Extensão e comunidade', text: 'Oficinas, visitas e ações que compartilham conhecimento dentro e fora da universidade.' },
      { icon: '△', title: 'Formação em equipe', text: 'Experiências em competições, organização de eventos e trabalho colaborativo multidisciplinar.' }
    ]
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
        <span>Sobre IEEE + RAS UFRB</span>
        <h2>Conheça a rede que nos conecta e o capítulo que transforma tecnologia em prática.</h2>
        <p>Uma apresentação institucional do IEEE e da RAS UFRB, conectando alcance global, formação, robótica e impacto na comunidade.</p>
      </div>

      <div class="institutional-about-grid institutional-about-grid-demo">
        <div class="about-media-panel" aria-label="Destaques institucionais da RAS UFRB">
          <div class="about-photo-main" :class="`tone-${photos[activePhoto].tone}`">
            <span class="about-photo-badge">RAS UFRB</span>
            <div class="about-photo-copy">
              <strong>{{ photos[activePhoto].label }}</strong>
              <p>{{ photos[activePhoto].detail }}</p>
            </div>
            <button class="about-photo-arrow previous" type="button" aria-label="Imagem anterior" @click="previousPhoto">‹</button>
            <button class="about-photo-arrow next" type="button" aria-label="Próxima imagem" @click="nextPhoto">›</button>
          </div>

          <div class="about-photo-thumbnails">
            <button
              v-for="(photo, index) in photos.slice(1)"
              :key="photo.label"
              type="button"
              class="about-photo-thumb"
              :class="[`tone-${photo.tone}`, { active: index + 1 === activePhoto }]"
              @click="setPhoto(index + 1)"
            >
              <span>{{ photo.label }}</span>
            </button>
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

        <div class="about-content-panel about-content-panel-demo">
          <div class="about-tabs about-tabs-demo" role="tablist" aria-label="Sobre IEEE e RAS UFRB">
            <button
              type="button"
              role="tab"
              :aria-selected="activeTab === 'ieee'"
              :class="{ active: activeTab === 'ieee' }"
              @click="activeTab = 'ieee'"
            >
              <span class="about-tab-icon">▥</span>
              <span>O que é o IEEE</span>
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeTab === 'ras'"
              :class="{ active: activeTab === 'ras' }"
              @click="activeTab = 'ras'"
            >
              <span class="about-tab-icon red">◉</span>
              <span>O que é a RAS UFRB</span>
            </button>
          </div>

          <div class="about-copy about-copy-demo" role="tabpanel">
            <div class="about-copy-brandline">
              <strong>{{ content.brand }}</strong>
              <span>{{ content.slogan }}</span>
            </div>

            <p class="about-copy-intro">{{ content.intro }}</p>

            <div class="about-feature-list">
              <article v-for="point in content.points" :key="point.title" class="about-feature-item">
                <span class="about-feature-icon">{{ point.icon }}</span>
                <div>
                  <strong>{{ point.title }}</strong>
                  <p>{{ point.text }}</p>
                </div>
              </article>
            </div>

            <div class="about-actions">
              <a href="#eventos" class="about-primary-link">Conheça nossas ações <span aria-hidden="true">→</span></a>
              <a href="#equipe" class="about-secondary-link">Ver equipe</a>
            </div>
          </div>
        </div>
      </div>

      <div class="about-impact-strip" aria-label="Indicadores institucionais temporários">
        <article v-for="item in metrics" :key="item.label" :class="`tone-${item.tone}`">
          <span class="impact-icon">{{ item.icon }}</span>
          <div>
            <strong>{{ item.value }}</strong>
            <b>{{ item.label }}</b>
            <small>{{ item.detail }}</small>
          </div>
        </article>
      </div>

      <p class="about-temporary-note">* Números e imagens desta seção são placeholders editoriais e serão substituídos pelos dados/arquivos oficiais da RAS UFRB.</p>
    </div>
  </section>
</template>
