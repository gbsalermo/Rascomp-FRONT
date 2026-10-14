<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { preloadImages, showPreparedImage } from '../utils/imagePreload'
import { HOME_MEDIA } from '../content/homeMedia'
import {previewImageStyle,type PreviewDraft,type PreviewFrame} from '../content/localMediaPreview'

const props = defineProps<{
  competition?: any
  competitionHeroEnabled?: boolean
  competitionMedia?: PreviewDraft['competition'] | null
  categories: any[]
  registrations: any[]
  enabledCategoryIds: number[]
  currentRegistrationLot?: any
  managementUrl: string
  mediaPreview?: PreviewDraft|null
}>()

type HeroTone = 'competition' | 'institutional' | 'community' | 'workshop' | 'award'

type HeroSlide = {
  id: string
  eyebrow: string
  title: string
  description: string
  cta: string
  href: string
  secondary?: string
  secondaryHref?: string
  tone: HeroTone
  image?: string
  imageAlt: string
  mediaLabel: string
  kind?: 'competition'
  categories?: string[]
  lotLabel?: string
  previewFrame?: PreviewFrame
  showButton?: boolean
}

type QuickLink = {
  title: string
  description: string
  icon: 'projects' | 'workshops' | 'schools' | 'competitions'
}

const current = ref(0)
let timer: number | undefined

const publicCompetitionStatuses = ['INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO']

const competitionVisible = computed(() =>
  publicCompetitionStatuses.includes(props.competition?.status)
)

const competitionCategories = computed(() =>
  props.categories.filter((item) => props.enabledCategoryIds.includes(item.id))
)

const competitionLotLabel = computed(() =>
  props.currentRegistrationLot?.nome || ''
)

const institutionalSlides = computed<HeroSlide[]>(() => {
  if(props.mediaPreview){
    const authored=props.mediaPreview.heroes.filter(item=>item.active).map((item):HeroSlide=>({
      id:item.id,eyebrow:item.eyebrow,title:item.title,description:item.description,
      cta:item.cta,href:item.href||'#top',showButton:item.showButton,
      tone:'institutional',image:item.image?.src,imageAlt:item.title,
      previewFrame:item.image?.frame,mediaLabel:'Destaque editorial da RAS UFRB'
    }))
    return authored.length ? authored : [{
      id:'media-empty-preview',eyebrow:'Prévia editorial',title:'Nenhum Hero ativado',
      description:'Ative um Hero na Gestão de Mídia para visualizar aqui.',cta:'',
      href:'#top',showButton:false,tone:'institutional',imageAlt:'',mediaLabel:'Sem destaque ativo'
    }]
  }
  return [
  {
    id: 'ras',
    eyebrow: 'IEEE RAS UFRB',
    title: 'Tecnologia, formação e comunidade em movimento.',
    description:
      'Promovendo a robótica, a automação e a inovação por meio de projetos, oficinas, competições e ações de extensão na UFRB e na comunidade.',
    cta: 'Conheça a RAS',
    href: '#sobre',
    secondary: 'Ver atividades',
    secondaryHref: '#eventos',
    tone: 'institutional',
    image: HOME_MEDIA.hero.ras.src || undefined,
    imageAlt: HOME_MEDIA.hero.ras.alt,
    mediaLabel: 'Foto principal da RAS UFRB'
  },
  {
    id: 'schools',
    eyebrow: 'RAS nas Escolas',
    title: 'Robótica e tecnologia mais perto da comunidade.',
    description:
      'Ações de extensão aproximam estudantes da ciência, da engenharia e da robótica por meio de experiências práticas.',
    cta: 'Ver ações',
    href: '#eventos',
    secondary: 'Ver registros',
    secondaryHref: '#galeria',
    tone: 'community',
    image: HOME_MEDIA.hero.schools.src || undefined,
    imageAlt: HOME_MEDIA.hero.schools.alt,
    mediaLabel: 'Foto do RAS nas Escolas'
  },
  {
    id: 'workshops',
    eyebrow: 'Oficinas',
    title: 'Aprendizado prático para transformar ideias em projetos.',
    description:
      'Oficinas, treinamentos e encontros técnicos conectam estudantes ao desenvolvimento de soluções em robótica e automação.',
    cta: 'Ver oficinas',
    href: '#eventos',
    secondary: 'Conheça a equipe',
    secondaryHref: '#equipe',
    tone: 'workshop',
    image: HOME_MEDIA.hero.workshops.src || undefined,
    imageAlt: HOME_MEDIA.hero.workshops.alt,
    mediaLabel: 'Foto de oficina ou treinamento'
  },
  {
    id: 'awards',
    eyebrow: 'Conquistas',
    title: 'Resultados construídos em equipe.',
    description:
      'Competições e premiações representam o desenvolvimento técnico, a colaboração e a evolução dos projetos do capítulo.',
    cta: 'Ver conquistas',
    href: '#premiacoes',
    secondary: 'Ver registros',
    secondaryHref: '#galeria',
    tone: 'award',
    image: HOME_MEDIA.hero.awards.src || undefined,
    imageAlt: HOME_MEDIA.hero.awards.alt,
    mediaLabel: 'Foto de premiação ou competição'
  }
]})

const slides = computed<HeroSlide[]>(() => {
  const base = institutionalSlides.value

  if (!props.competitionHeroEnabled) return base
  if (!competitionVisible.value || !props.competition) return base

  return [
    ...base,
    {
      id: 'competition-current',
      eyebrow:
        props.competition.status === 'INSCRICOES_ABERTAS'
          ? 'Inscrições abertas'
          : props.competition.status === 'INSCRICOES_ENCERRADAS'
            ? 'Inscrições encerradas'
            : 'Competição em andamento',
      title: props.competition.nome,
      description: [
        props.competition.descricao || 'Acompanhe a competição vigente da IEEE RAS UFRB.',
        ...(props.competitionMedia ? [props.competitionMedia.subtitle,props.competitionMedia.description] : [])
      ].filter(Boolean).join(' — '),
      cta: props.competition.status === 'INSCRICOES_ABERTAS' ? 'Inscrever-se' : 'Área do participante',
      href: props.managementUrl,
      secondary:props.competitionMedia
        ? (props.competitionMedia?.showExtra ? props.competitionMedia?.extraLabel : undefined)
        : 'Acompanhar evento',
      secondaryHref:props.competitionMedia?.extraDestination==='gallery' ? '#galeria'
        : props.competitionMedia?.extraDestination==='events' ? '#eventos' : '#competicao-atual',
      tone: 'competition',
      image:props.competitionMedia?.heroImage?.src,
      previewFrame:props.competitionMedia?.heroImage?.frame,
      imageAlt: 'Hero da competição',
      mediaLabel: 'Competição vigente da IEEE RAS UFRB',
      kind: 'competition',
      categories: competitionCategories.value.map((item) => item.nome),
      lotLabel: competitionLotLabel.value
    }
  ]
})

const quickLinks = computed<QuickLink[]>(() => [
  {
    title: 'Projetos',
    description: 'Desenvolvimento de projetos e robôs nas áreas de robótica e automação.',
    icon: 'projects'
  },
  {
    title: 'Oficinas',
    description: 'Capacitação prática por meio de oficinas, treinamentos e troca de conhecimento.',
    icon: 'workshops'
  },
  {
    title: 'RAS nas Escolas',
    description: 'Ações de extensão que levam robótica, ciência e tecnologia às escolas da região.',
    icon: 'schools'
  },
  {
    title: 'Competições',
    description: 'Participação em competições de robótica nacionais e internacionais.',
    icon: 'competitions'
  }
])

const activeSlide = computed(() => slides.value[current.value] || slides.value[0])

let navigationSequence=0
function navigateTo(index:number) {
  if(!slides.value.length)return
  const next=(index+slides.value.length)%slides.value.length
  const sequence=++navigationSequence
  const slide=slides.value[next]
  void showPreparedImage(slide?.image,()=>{
    if(sequence!==navigationSequence)return
    current.value=next
    preloadImages([slides.value[(next+1)%slides.value.length]?.image,slides.value[(next+2)%slides.value.length]?.image])
  })
}
function goTo(index: number) { navigateTo(index); restartTimer() }
function previous() { navigateTo(current.value-1); restartTimer() }
function next() { navigateTo(current.value+1); restartTimer() }
function startTimer() {
  stopTimer()
  timer = window.setInterval(() => navigateTo(current.value+1), 9000)
}
watch(slides,(items)=>preloadImages(items.map(item=>item.image),items.length),{immediate:true})
function stopTimer() {
  if (timer) window.clearInterval(timer)
  timer = undefined
}

function restartTimer() {
  startTimer()
}

onMounted(startTimer)
onBeforeUnmount(stopTimer)
</script>

<template>
  <section class="highlights-hero" aria-label="Início e destaques da RAS UFRB">
    <div class="highlights-shell">
      <div class="hero-editorial-grid">
        <article
          class="highlights-stage"
          :class="`tone-${activeSlide.tone}`"
          @mouseenter="stopTimer"
          @mouseleave="startTimer"
        >
          <img
            v-if="activeSlide.image"
            class="stage-media"
            :src="activeSlide.image"
            :style="previewImageStyle(activeSlide.previewFrame)"
            :alt="activeSlide.imageAlt"
          />
          <div v-else class="stage-visual-placeholder" aria-hidden="true">
            <span>{{ activeSlide.mediaLabel }}</span>
          </div>

          <div class="stage-overlay" />

          <div class="highlights-copy" :class="{ 'is-competition': activeSlide.kind === 'competition' }">
            <span class="highlights-kicker">{{ activeSlide.eyebrow }}</span>
            <h1>{{ activeSlide.title }}</h1>
            <p>{{ activeSlide.description }}</p>

            <div
              v-if="activeSlide.kind === 'competition' && activeSlide.categories?.length"
              class="hero-competition-categories"
            >
              <span class="hero-competition-categories-label">Categorias</span>
              <div class="hero-competition-category-list">
                <span
                  v-for="category in activeSlide.categories"
                  :key="category"
                  class="hero-competition-category"
                >
                  {{ category }}
                </span>
              </div>
            </div>

            <div
              v-if="activeSlide.kind === 'competition' && activeSlide.lotLabel"
              class="hero-competition-lot"
            >
              <span>Lote atual</span>
              <strong>{{ activeSlide.lotLabel }}</strong>
            </div>

            <div class="highlights-actions" :class="{ 'competition-actions': activeSlide.kind === 'competition' }">
              <a
                v-if="
                  activeSlide.showButton !== false && (
                  activeSlide.kind !== 'competition' ||
                  (activeSlide.href && ['INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS', 'EM_ANDAMENTO'].includes(competition?.status)))
                "
                class="highlight-primary"
                :href="activeSlide.href"
              >
                {{ activeSlide.cta }}
              </a>
              <a
                v-if="activeSlide.secondary && activeSlide.secondaryHref"
                class="highlight-secondary"
                :href="activeSlide.secondaryHref"
              >
                {{ activeSlide.secondary }}
              </a>
            </div>
          </div>

          <div class="hero-navigation" aria-label="Navegação dos destaques">
            <button type="button" aria-label="Destaque anterior" @click="previous">←</button>

            <div class="hero-dots" aria-label="Selecionar destaque">
              <button
                v-for="(slide, index) in slides"
                :key="slide.id"
                type="button"
                :class="{ active: index === current }"
                :aria-label="`Mostrar ${slide.title}`"
                @click="goTo(index)"
              />
            </div>

            <button type="button" aria-label="Próximo destaque" @click="next">→</button>
          </div>
        </article>

      </div>

      <div class="hero-quick-links" aria-label="Áreas de atuação da RAS UFRB">
        <article v-for="item in quickLinks" :key="item.title" class="hero-quick-card">
          <span class="hero-quick-icon" aria-hidden="true">
            <svg v-if="item.icon === 'projects'" viewBox="0 0 24 24">
              <path d="M4 7h16v11H4zM7 4h10v3H7zm1 7h3v3H8zm5 0h3v3h-3z" />
            </svg>
            <svg v-else-if="item.icon === 'workshops'" viewBox="0 0 24 24">
              <path d="M10.8 2h2.4l.5 2.2c.6.2 1.1.4 1.6.7l1.9-1.2 1.7 1.7-1.2 1.9c.3.5.5 1 .7 1.6l2.2.5v2.4l-2.2.5c-.2.6-.4 1.1-.7 1.6l1.2 1.9-1.7 1.7-1.9-1.2c-.5.3-1 .5-1.6.7l-.5 2.2h-2.4l-.5-2.2c-.6-.2-1.1-.4-1.6-.7l-1.9 1.2-1.7-1.7 1.2-1.9c-.3-.5-.5-1-.7-1.6L3 11.8V9.4l2.2-.5c.2-.6.4-1.1.7-1.6L4.7 5.4l1.7-1.7 1.9 1.2c.5-.3 1-.5 1.6-.7L10.8 2Zm1.2 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
            <svg v-else-if="item.icon === 'schools'" viewBox="0 0 24 24">
              <path d="m2 8 10-5 10 5-10 5L2 8Zm4 4.2 6 3 6-3V17c-3.8 2.4-8.2 2.4-12 0v-4.8ZM20 10h2v7h-2z" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path d="M7 3h10v3h4v3c0 3.1-1.7 5.7-4.2 7.1A6 6 0 0 1 13 19.9V22h4v2H7v-2h4v-2.1a6 6 0 0 1-3.8-3.8A8 8 0 0 1 3 9V6h4V3Zm0 5H5v1c0 1.8.8 3.4 2.1 4.5A11 11 0 0 1 7 12V8Zm10 0v4c0 .5 0 1-.1 1.5A5.7 5.7 0 0 0 19 9V8h-2Z" />
            </svg>
          </span>

          <span class="hero-quick-copy">
            <strong>{{ item.title }}</strong>
            <small>{{ item.description }}</small>
          </span>
        </article>
      </div>
    </div>
  </section>
</template>
