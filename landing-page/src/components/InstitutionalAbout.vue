<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type AboutTab = 'ieee' | 'ras'

type AboutSlide = {
  id: string
  label: string
  detail: string
  src: string
  alt: string
}

const aboutImageModules = import.meta.glob(
  '../assets/about/*.{jpg,jpeg,png,webp,avif}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>

const activeTab = ref<AboutTab>('ieee')
const activePhoto = ref(0)
let photoTimer: number | undefined

function filenameToLabel(path: string) {
  const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '') || 'RAS UFRB'

  return filename
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const photos = computed<AboutSlide[]>(() =>
  Object.entries(aboutImageModules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, 'pt-BR', { numeric: true }))
    .map(([path, src], index) => {
      const label = filenameToLabel(path)

      return {
        id: `about-photo-${index}-${path}`,
        label,
        detail: 'Registro de projetos, eventos, competições e ações da IEEE RAS UFRB.',
        src,
        alt: `${label} — IEEE RAS UFRB`
      }
    })
)

const emptyPhoto: AboutSlide = {
  id: 'about-empty',
  label: 'RAS UFRB',
  detail: 'Adicione imagens em src/assets/about para alimentar este carrossel automaticamente.',
  src: '',
  alt: 'Área de imagens institucionais da IEEE RAS UFRB'
}

const activePhotoItem = computed(
  () => photos.value[activePhoto.value] || photos.value[0] || emptyPhoto
)

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

function goToPhoto(index: number) {
  activePhoto.value = index
  restartPhotoTimer()
}

function previousPhoto() {
  if (photos.value.length <= 1) return
  activePhoto.value = (activePhoto.value - 1 + photos.value.length) % photos.value.length
  restartPhotoTimer()
}

function nextPhoto() {
  if (photos.value.length <= 1) return
  activePhoto.value = (activePhoto.value + 1) % photos.value.length
  restartPhotoTimer()
}

function startPhotoTimer() {
  stopPhotoTimer()
  if (photos.value.length <= 1) return

  photoTimer = window.setInterval(() => {
    activePhoto.value = (activePhoto.value + 1) % photos.value.length
  }, 7000)
}

function stopPhotoTimer() {
  if (photoTimer) window.clearInterval(photoTimer)
  photoTimer = undefined
}

function restartPhotoTimer() {
  startPhotoTimer()
}

onMounted(startPhotoTimer)
onBeforeUnmount(stopPhotoTimer)
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
        <div class="about-media-panel" aria-label="Destaques visuais da RAS UFRB">
          <div
            class="about-photo-main"
            @mouseenter="stopPhotoTimer"
            @mouseleave="startPhotoTimer"
          >
            <img
              v-if="activePhotoItem.src"
              class="about-photo-image"
              :src="activePhotoItem.src"
              :alt="activePhotoItem.alt"
            />
            <div v-else class="about-photo-placeholder" aria-hidden="true" />

            <div class="about-photo-overlay" />
            <span class="about-photo-badge">RAS UFRB</span>

            <div class="about-photo-copy">
              <strong>{{ activePhotoItem.label }}</strong>
              <p>{{ activePhotoItem.detail }}</p>
            </div>

            <button
              v-if="photos.length > 1"
              class="about-photo-arrow previous"
              type="button"
              aria-label="Imagem anterior"
              @click="previousPhoto"
            >←</button>
            <button
              v-if="photos.length > 1"
              class="about-photo-arrow next"
              type="button"
              aria-label="Próxima imagem"
              @click="nextPhoto"
            >→</button>

            <div v-if="photos.length > 1" class="about-photo-dots" aria-label="Selecionar imagem">
              <button
                v-for="(photo, index) in photos"
                :key="photo.id"
                type="button"
                :class="{ active: index === activePhoto }"
                :aria-label="`Mostrar ${photo.label}`"
                @click="goToPhoto(index)"
              />
            </div>
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
    </div>
  </section>
</template>
