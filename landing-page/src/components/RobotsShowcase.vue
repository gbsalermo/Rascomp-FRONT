<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type RobotCategorySlug = 'sumo' | 'mini-sumo' | 'hockey' | 'follow-line'

type RobotPhoto = {
  src: string
  name: string
  path: string
}

type RobotCategory = {
  slug: RobotCategorySlug
  label: string
  description: string
}

const categories: RobotCategory[] = [
  {
    slug: 'sumo',
    label: 'Sumô',
    description: 'Robôs preparados para disputas de força, estratégia e controle em arena.'
  },
  {
    slug: 'mini-sumo',
    label: 'Mini Sumô',
    description: 'A mesma lógica competitiva do Sumô em uma plataforma compacta e precisa.'
  },
  {
    slug: 'hockey',
    label: 'Hockey',
    description: 'Robôs desenvolvidos para partidas dinâmicas, controle e interação em equipe.'
  },
  {
    slug: 'follow-line',
    label: 'Follow Line',
    description: 'Precisão, sensoriamento e autonomia para percorrer trajetos com velocidade.'
  }
]

const robotImageModules = import.meta.glob(
  '../assets/robots/**/*.{jpg,jpeg,png,webp,avif}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>

function robotNameFromPath(path: string) {
  const fileName = path.split('/').pop() || ''
  const withoutExtension = fileName.replace(/\.[^.]+$/, '')
  const withoutOrder = withoutExtension.replace(/^\d+[\s_-]*/, '')
  const words = withoutOrder.replace(/[_-]+/g, ' ').trim().split(/\s+/).filter(Boolean)

  return words.length
    ? words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Robô RAS UFRB'
}

const photosByCategory = computed<Record<RobotCategorySlug, RobotPhoto[]>>(() => {
  const result: Record<RobotCategorySlug, RobotPhoto[]> = {
    'sumo': [],
    'mini-sumo': [],
    'hockey': [],
    'follow-line': []
  }

  Object.entries(robotImageModules)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .forEach(([path, src]) => {
      const relativePath = path.split('/assets/robots/')[1] || ''
      const category = relativePath.split('/')[0] as RobotCategorySlug

      if (!result[category]) return

      result[category].push({
        src,
        path,
        name: robotNameFromPath(path)
      })
    })

  return result
})

const activeCategory = ref<RobotCategorySlug>('sumo')
const activeIndex = ref(0)
const paused = ref(false)
let autoplayTimer: number | undefined

const activeCategoryData = computed(
  () => categories.find((category) => category.slug === activeCategory.value) || categories[0]
)

const activePhotos = computed(() => photosByCategory.value[activeCategory.value] || [])
const activeRobot = computed(() => activePhotos.value[activeIndex.value] || null)

function selectCategory(category: RobotCategorySlug) {
  activeCategory.value = category
}

function selectRobot(index: number) {
  activeIndex.value = index
}

function nextRobot() {
  if (activePhotos.value.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % activePhotos.value.length
}

function previousRobot() {
  if (activePhotos.value.length <= 1) return
  activeIndex.value =
    (activeIndex.value - 1 + activePhotos.value.length) % activePhotos.value.length
}

watch(activeCategory, () => {
  activeIndex.value = 0
})

watch(activePhotos, (photos) => {
  if (activeIndex.value >= photos.length) activeIndex.value = 0
})

onMounted(() => {
  autoplayTimer = window.setInterval(() => {
    if (!paused.value && activePhotos.value.length > 1) {
      nextRobot()
    }
  }, 6000)
})

onBeforeUnmount(() => {
  if (autoplayTimer) window.clearInterval(autoplayTimer)
})
</script>

<template>
  <section id="robos" class="robots-showcase-section" aria-labelledby="robots-showcase-title">
    <div class="robots-showcase-container">
      <article
        class="robots-showcase-hero"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <img
          v-if="activeRobot"
          class="robots-showcase-hero-image"
          :src="activeRobot.src"
          :alt="`${activeRobot.name} — categoria ${activeCategoryData.label}`"
        />
        <div v-else class="robots-showcase-hero-placeholder" aria-hidden="true" />

        <div class="robots-showcase-hero-overlay" aria-hidden="true" />

        <div class="robots-showcase-hero-copy">
          <span class="robots-showcase-kicker">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 2h6v2h1a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h1V2Zm-1 5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H8Zm1 3h2v2H9v-2Zm4 0h2v2h-2v-2ZM2 9h2v5H2V9Zm18 0h2v5h-2V9Z"/>
            </svg>
            Nossos Robôs
          </span>

          <span class="robots-showcase-category">{{ activeCategoryData.label }}</span>

          <h2 id="robots-showcase-title">
            {{ activeRobot?.name || activeCategoryData.label }}
          </h2>

          <p>{{ activeCategoryData.description }}</p>
        </div>

        <template v-if="activePhotos.length > 1">
          <button
            type="button"
            class="robots-showcase-arrow robots-showcase-arrow--left"
            aria-label="Foto anterior"
            @click="previousRobot"
          >
            ‹
          </button>

          <button
            type="button"
            class="robots-showcase-arrow robots-showcase-arrow--right"
            aria-label="Próxima foto"
            @click="nextRobot"
          >
            ›
          </button>

          <div class="robots-showcase-dots" aria-label="Fotos do robô">
            <button
              v-for="(_, index) in activePhotos"
              :key="index"
              type="button"
              :class="{ active: index === activeIndex }"
              :aria-label="`Mostrar foto ${index + 1}`"
              @click="selectRobot(index)"
            />
          </div>
        </template>
      </article>

      <nav class="robots-category-tabs" aria-label="Categorias de robôs">
        <button
          v-for="category in categories"
          :key="category.slug"
          type="button"
          class="robots-category-tab"
          :class="{ active: category.slug === activeCategory }"
          :aria-pressed="category.slug === activeCategory"
          @click="selectCategory(category.slug)"
        >
          <span class="robots-category-tab-media">
            <img
              v-if="photosByCategory[category.slug][0]"
              :src="photosByCategory[category.slug][0].src"
              alt=""
            />
            <span v-else aria-hidden="true">R</span>
          </span>

          <span class="robots-category-tab-copy">
            <strong>{{ category.label }}</strong>
            <small>
              {{ photosByCategory[category.slug].length }}
              {{ photosByCategory[category.slug].length === 1 ? 'robô' : 'robôs' }}
            </small>
          </span>

          <span class="robots-category-tab-arrow" aria-hidden="true">→</span>
        </button>
      </nav>

      <div class="robots-category-gallery">
        <header class="robots-category-gallery-heading">
          <div>
            <span aria-hidden="true" />
            <strong>Robôs da categoria {{ activeCategoryData.label }}</strong>
          </div>
          <small>{{ activePhotos.length }} {{ activePhotos.length === 1 ? 'robô' : 'robôs' }}</small>
        </header>

        <div v-if="activePhotos.length" class="robots-category-grid">
          <button
            v-for="(robot, index) in activePhotos"
            :key="robot.path"
            type="button"
            class="robots-category-card"
            :class="{ active: index === activeIndex }"
            @click="selectRobot(index)"
          >
            <img :src="robot.src" :alt="robot.name" />
            <span>{{ robot.name }}</span>
          </button>
        </div>

        <div v-else class="robots-category-empty">
          <strong>Nenhum robô adicionado nesta categoria ainda.</strong>
          <span>As imagens entram automaticamente quando forem adicionadas à pasta correspondente.</span>
        </div>
      </div>
    </div>
  </section>
</template>
