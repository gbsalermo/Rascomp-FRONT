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
        { icon: 'global', title: 'Alcance global', text: 'Uma rede internacional que conecta conhecimento, pessoas e diferentes áreas da engenharia e tecnologia.' },
        { icon: 'innovation', title: 'Inovação e impacto', text: 'Publicações, conferências, padrões e comunidades técnicas que impulsionam o desenvolvimento tecnológico.' },
        { icon: 'education', title: 'Educação e desenvolvimento', text: 'Formação contínua, troca de experiências e incentivo ao crescimento de jovens talentos.' }
      ]
    }
  }

  return {
    brand: 'IEEE RAS UFRB',
    slogan: 'Robotics & Automation Society · Student Chapter',
    intro:
      'A RAS UFRB é o capítulo estudantil da IEEE Robotics & Automation Society na Universidade Federal do Recôncavo da Bahia, reunindo estudantes em torno de robótica, automação, inovação e extensão.',
    points: [
      { icon: 'robot', title: 'Projetos práticos', text: 'Desenvolvimento de robôs e soluções que aproximam teoria, experimentação e engenharia aplicada.' },
      { icon: 'community', title: 'Extensão e comunidade', text: 'Oficinas, visitas e ações que compartilham conhecimento dentro e fora da universidade.' },
      { icon: 'team', title: 'Formação em equipe', text: 'Experiências em competições, organização de eventos e trabalho colaborativo multidisciplinar.' }
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
                <span class="about-feature-icon" aria-hidden="true">
                  <svg v-if="point.icon === 'global'" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3.1a15 15 0 0 0-1.5-3.3A8.1 8.1 0 0 1 18.9 8ZM12 4c.9 1.1 1.6 2.4 2 4h-4c.4-1.6 1.1-2.9 2-4ZM4.6 14a8 8 0 0 1 0-4h3.8a17 17 0 0 0 0 4H4.6Zm.5 2h3.3c.3 1.2.8 2.4 1.5 3.3A8.1 8.1 0 0 1 5.1 16ZM8.4 8H5.1a8.1 8.1 0 0 1 4.8-3.3A15 15 0 0 0 8.4 8Zm3.6 12c-.9-1.1-1.6-2.4-2-4h4c-.4 1.6-1.1 2.9-2 4Zm2.4-6H9.6a15 15 0 0 1 0-4h4.8a15 15 0 0 1 0 4Zm-.3 5.3c.7-.9 1.2-2.1 1.5-3.3h3.3a8.1 8.1 0 0 1-4.8 3.3ZM15.6 14a17 17 0 0 0 0-4h3.8a8 8 0 0 1 0 4h-3.8Z"/>
                  </svg>
                  <svg v-else-if="point.icon === 'innovation'" viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 0 0-4.2 12.6c.8.6 1.2 1.1 1.3 1.7h5.8c.1-.6.5-1.1 1.3-1.7A7 7 0 0 0 12 2Zm-2 16h4v2h-4v-2Zm1 3h2v1h-2v-1Zm.1-7.7c-.3-1.8-1.2-3.3-2.5-4.4l1.3-1.5c.9.8 1.6 1.7 2.1 2.8.5-1.1 1.2-2 2.1-2.8l1.3 1.5a8 8 0 0 0-2.5 4.4l-1.8-.1Z"/>
                  </svg>
                  <svg v-else-if="point.icon === 'education'" viewBox="0 0 24 24">
                    <path d="m2 7 10-5 10 5-10 5L2 7Zm4 4.2 6 3 6-3V16c-3.8 2.4-8.2 2.4-12 0v-4.8ZM20 9h2v7h-2V9Z"/>
                  </svg>
                  <svg v-else-if="point.icon === 'robot'" viewBox="0 0 24 24">
                    <path d="M11 2h2v3h3a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h3V2ZM8 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 6v2h8v-2H8ZM2 10h2v6H2v-6Zm18 0h2v6h-2v-6Z"/>
                  </svg>
                  <svg v-else-if="point.icon === 'community'" viewBox="0 0 24 24">
                    <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM1 21v-2c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v2H1Zm14-8c4.4 0 8 2.7 8 6v2h-6v-2c0-2.2-.8-4.2-2.2-5.7l.2-.3Z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path d="M12 2 3 6v6c0 5.1 3.8 9.8 9 10 5.2-.2 9-4.9 9-10V6l-9-4Zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm5 10.2A7 7 0 0 1 12 19a7 7 0 0 1-5-2.8V15c1.3-1.3 3.1-2 5-2s3.7.7 5 2v1.2Z"/>
                  </svg>
                </span>
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
