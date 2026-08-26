<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  competition?: any
  managementUrl: string
}>()

type HeroTone = 'institutional' | 'community' | 'workshop' | 'competition'

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
  mediaLabel: string
}

const current = ref(0)
let timer: number | undefined

const competitionVisible = computed(() =>
  ['EM_ANDAMENTO', 'INSCRICOES_ABERTAS', 'INSCRICOES_ENCERRADAS'].includes(props.competition?.status)
)

const slides = computed<HeroSlide[]>(() => {
  const items: HeroSlide[] = [
    {
      id: 'ras',
      eyebrow: 'IEEE Robotics & Automation Society · UFRB',
      title: 'Tecnologia, formação e comunidade em movimento.',
      description:
        'O capítulo estudantil da RAS UFRB conecta estudantes por meio da robótica, automação, projetos, oficinas e ações de extensão.',
      cta: 'Conheça a RAS UFRB',
      href: '#sobre',
      secondary: 'Ver nossas atividades',
      secondaryHref: '#eventos',
      tone: 'institutional',
      mediaLabel: 'Foto institucional da equipe'
    },
    {
      id: 'schools',
      eyebrow: 'Extensão · RAS nas Escolas',
      title: 'Robótica também começa fora do laboratório.',
      description:
        'Ações em escolas aproximam estudantes da ciência, da engenharia e da programação através de experiências práticas.',
      cta: 'Conhecer a iniciativa',
      href: '#eventos',
      tone: 'community',
      mediaLabel: 'Foto de visita ou atividade em escola'
    },
    {
      id: 'workshop',
      eyebrow: 'Formação · Oficinas',
      title: 'Aprender fazendo é parte da nossa cultura.',
      description:
        'Oficinas e atividades técnicas criam espaço para experimentar eletrônica, programação, automação e construção de robôs.',
      cta: 'Ver atividades',
      href: '#eventos',
      tone: 'workshop',
      mediaLabel: 'Foto de oficina ou treinamento'
    }
  ]

  if (competitionVisible.value) {
    items.splice(1, 0, {
      id: 'competition',
      eyebrow: props.competition?.status === 'EM_ANDAMENTO' ? 'Competição em andamento' : 'Próxima competição',
      title: props.competition?.nome || 'Competição de robótica da RAS UFRB',
      description:
        props.competition?.descricao ||
        'Acompanhe inscrições, equipes, robôs, partidas, chaveamento e resultados oficiais publicados pelo RasComp.',
      cta: props.competition?.status === 'EM_ANDAMENTO' ? 'Acompanhar competição' : 'Ver competição',
      href: '#competicao-atual',
      secondary: props.competition?.status === 'INSCRICOES_ABERTAS' ? 'Fazer inscrição' : undefined,
      secondaryHref: props.competition?.status === 'INSCRICOES_ABERTAS' ? props.managementUrl : undefined,
      tone: 'competition',
      mediaLabel: 'Foto da competição atual'
    })
  }

  return items
})

const activeSlide = computed(() => slides.value[current.value] || slides.value[0])

function goTo(index: number) {
  current.value = index
  restartTimer()
}

function previous() {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length
  restartTimer()
}

function next() {
  current.value = (current.value + 1) % slides.value.length
  restartTimer()
}

function startTimer() {
  stopTimer()
  timer = window.setInterval(() => {
    current.value = (current.value + 1) % slides.value.length
  }, 7000)
}

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
  <section class="highlights-hero" aria-label="Destaques da RAS UFRB">
    <div class="highlights-shell">
      <div class="highlights-stage" :class="`tone-${activeSlide.tone}`">
        <div class="highlights-copy">
          <span class="highlights-kicker">{{ activeSlide.eyebrow }}</span>
          <h1>{{ activeSlide.title }}</h1>
          <p>{{ activeSlide.description }}</p>

          <div class="highlights-actions">
            <a class="highlight-primary" :href="activeSlide.href">{{ activeSlide.cta }} <span aria-hidden="true">→</span></a>
            <a
              v-if="activeSlide.secondary && activeSlide.secondaryHref"
              class="highlight-secondary"
              :href="activeSlide.secondaryHref"
            >
              {{ activeSlide.secondary }}
            </a>
          </div>
        </div>

        <div class="highlights-media" aria-hidden="true">
          <div class="media-placeholder">
            <span>{{ activeSlide.mediaLabel }}</span>
            <small>imagem será substituída por acervo oficial</small>
          </div>
        </div>

        <div class="hero-slide-controls" aria-label="Controles do destaque">
          <button type="button" aria-label="Destaque anterior" @click="previous">←</button>
          <span>{{ String(current + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}</span>
          <button type="button" aria-label="Próximo destaque" @click="next">→</button>
        </div>
      </div>

      <div class="highlights-index" aria-label="Outros destaques">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          type="button"
          :class="{ active: index === current }"
          @click="goTo(index)"
        >
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <div>
            <small>{{ slide.eyebrow.split('·')[0].trim() }}</small>
            <strong>{{ slide.title }}</strong>
          </div>
        </button>
      </div>

      <div class="highlights-newsline" aria-label="Novidades da RAS UFRB">
        <span>Novidades</span>
        <p>Oficinas, visitas, competições e atividades do capítulo ganham destaque aqui conforme forem publicadas.</p>
        <a href="#eventos">Ver agenda <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</template>
