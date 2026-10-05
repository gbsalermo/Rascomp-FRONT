<script setup lang="ts">
import { computed, ref } from 'vue'

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

const robotBannerModules = import.meta.glob(
  '../assets/robots/banners/*.{jpg,jpeg,png,webp,avif}',
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

function categorySlugFromFile(path: string) {
  const fileName = path.split('/').pop() || ''
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[\s_-]*/, '')
    .toLowerCase() as RobotCategorySlug
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

const bannersByCategory = computed<Partial<Record<RobotCategorySlug, string>>>(() => {
  const result: Partial<Record<RobotCategorySlug, string>> = {}

  Object.entries(robotBannerModules)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .forEach(([path, src]) => {
      const slug = categorySlugFromFile(path)

      if (categories.some((category) => category.slug === slug)) {
        result[slug] = src
      }
    })

  return result
})

const activeCategory = ref<RobotCategorySlug>('sumo')

const activeCategoryData = computed(
  () => categories.find((category) => category.slug === activeCategory.value) || categories[0]
)

const activePhotos = computed(() => photosByCategory.value[activeCategory.value] || [])
const activeBanner = computed(() => bannersByCategory.value[activeCategory.value] || '')

function selectCategory(category: RobotCategorySlug) {
  activeCategory.value = category
}
</script>

<template>
  <section id="robos" class="robots-showcase-section" aria-labelledby="robots-showcase-title">
    <div class="robots-showcase-container">
      <article class="robots-showcase-hero">
        <img
          v-if="activeBanner"
          class="robots-showcase-hero-image"
          :src="activeBanner"
          :alt="`Banner da categoria ${activeCategoryData.label}`"
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

          <span class="robots-showcase-category">Categoria</span>

          <h2 id="robots-showcase-title">
            {{ activeCategoryData.label }}
          </h2>

          <p>{{ activeCategoryData.description }}</p>
        </div>
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
            <span class="robots-category-tab-title">
              <span class="robots-category-tab-icon" aria-hidden="true">
                <svg v-if="category.slug === 'sumo'" viewBox="0 0 24 24">
                  <path d="M5 8h14l-1.2 8.5A2 2 0 0 1 15.8 18H8.2a2 2 0 0 1-2-1.5L5 8Zm3-3h8l1 3H7l1-3Zm1.5 7h5M8 21h2M14 21h2"/>
                </svg>

                <svg v-else-if="category.slug === 'mini-sumo'" viewBox="0 0 24 24">
                  <rect x="5" y="7" width="14" height="10" rx="2"/>
                  <path d="M9 7V5h6v2M8 12h2M14 12h2M9 20h6"/>
                </svg>

                <svg v-else-if="category.slug === 'hockey'" viewBox="0 0 24 24">
                  <path d="M7 4v10c0 2.2 1.8 4 4 4h6M17 4v9M14 18h5"/>
                  <circle cx="18" cy="18" r="2"/>
                </svg>

                <svg v-else viewBox="0 0 24 24">
                  <path d="M3 12c3.5-6 6.5-6 9 0s5.5 6 9 0"/>
                  <circle cx="4" cy="12" r="1.4"/>
                  <circle cx="20" cy="12" r="1.4"/>
                </svg>
              </span>

              <strong>{{ category.label }}</strong>
            </span>

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
          <article
            v-for="robot in activePhotos"
            :key="robot.path"
            class="robots-category-card"
          >
            <img :src="robot.src" :alt="robot.name" />
            <span>{{ robot.name }}</span>
          </article>
        </div>

        <div v-else class="robots-category-empty">
          <strong>Nenhum robô adicionado nesta categoria ainda.</strong>
          <span>As imagens entram automaticamente quando forem adicionadas à pasta correspondente.</span>
        </div>
      </div>
    </div>
  </section>
</template>
