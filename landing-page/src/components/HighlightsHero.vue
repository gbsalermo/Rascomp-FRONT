<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  competition?: any
  managementUrl: string
}>()

type HeroTone = 'institutional' | 'community' | 'workshop' | 'competition' | 'award'

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

type NewsItem = {
  tag: string
  date: string
  title: string
  description: string
  tone: HeroTone
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
      eyebrow: 'RAS UFRB',
      title: 'Tecnologia, formação e comunidade em movimento.',
      description:
        'O capítulo estudantil da RAS UFRB conecta estudantes por meio da robótica, automação, projetos, oficinas e ações de extensão.',
      cta: 'Conheça a RAS UFRB',
      href: '#sobre',
      secondary: 'Nossas atividades',
      secondaryHref: '#eventos',
      tone: 'institutional',
      mediaLabel: 'Foto institucional da equipe'
    },
    {
      id: 'schools',
      eyebrow: 'RAS nas Escolas',
      title: 'Inspirando o futuro com ciência e tecnologia.',
      description:
        'Visitamos escolas para compartilhar conhecimento, despertar novas ideias e aproximar estudantes da robótica.',
      cta: 'Conhecer a iniciativa',
      href: '#eventos',
      tone: 'community',
      mediaLabel: 'Foto de visita ou atividade em escola'
    },
    {
      id: 'workshop',
      eyebrow: 'Oficinas',
      title: 'Aprendizado que transforma.',
      description:
        'Nossas oficinas aproximam estudantes da tecnologia e do fazer inovador por meio de experiências práticas.',
      cta: 'Ver atividades',
      href: '#eventos',
      tone: 'workshop',
      mediaLabel: 'Foto de oficina ou treinamento'
    },
    {
      id: 'awards',
      eyebrow: 'Premiações',
      title: 'Conquistas que nos movem.',
      description:
        'Cada prêmio e resultado registra dedicação, trabalho em equipe, aprendizado e evolução técnica do capítulo.',
      cta: 'Conhecer conquistas',
      href: '#equipe',
      tone: 'award',
      mediaLabel: 'Foto de premiação ou troféu'
    }
  ]

  if (competitionVisible.value) {
    items.unshift({
      id: 'competition',
      eyebrow: props.competition?.status === 'EM_ANDAMENTO' ? 'Competição' : 'Próxima competição',
      title:
        props.competition?.status === 'EM_ANDAMENTO'
          ? `${props.competition?.nome || 'RRC'} em andamento!`
          : props.competition?.nome || 'Competição de robótica da RAS UFRB',
      description:
        props.competition?.descricao ||
        'Acompanhe equipes, robôs, partidas, chaveamento, ranking e resultados oficiais da competição.',
      cta: props.competition?.status === 'EM_ANDAMENTO' ? 'Acompanhar competição' : 'Ver competição',
      href: '#competicao-atual',
      secondary: props.competition?.status === 'INSCRICOES_ABERTAS' ? 'Fazer inscrição' : 'Saiba mais',
      secondaryHref:
        props.competition?.status === 'INSCRICOES_ABERTAS' ? props.managementUrl : '#competicao-atual',
      tone: 'competition',
      mediaLabel: 'Foto da competição atual'
    })
  }

  return items
})

const newsItems = computed<NewsItem[]>(() => {
  const items: NewsItem[] = [
    {
      tag: 'Oficina',
      date: 'Em breve',
      title: 'Oficinas e formação',
      description: 'Novas atividades técnicas da RAS UFRB aparecem aqui conforme forem divulgadas.',
      tone: 'workshop'
    },
    {
      tag: 'RAS nas Escolas',
      date: 'Agenda',
      title: 'Ações de extensão',
      description: 'Visitas, demonstrações e atividades com escolas ganham destaque no painel.',
      tone: 'community'
    },
    {
      tag: 'Premiação',
      date: 'Destaque',
      title: 'Conquistas do capítulo',
      description: 'Resultados relevantes e reconhecimentos podem ser publicados nesta área.',
      tone: 'award'
    }
  ]

  if (competitionVisible.value) {
    items[0] = {
      tag: 'Competição',
      date: props.competition?.status === 'EM_ANDAMENTO' ? 'Agora' : 'Próxima',
      title: props.competition?.nome || 'Competição atual',
      description:
        props.competition?.status === 'EM_ANDAMENTO'
          ? 'A competição está em andamento. Acompanhe os dados publicados pelo RasComp.'
          : 'Acompanhe as informações e atualizações da próxima competição.',
      tone: 'competition'
    }
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
      <div class="hero-editorial-grid">
        <article
          class="highlights-stage"
          :class="`tone-${activeSlide.tone}`"
          @mouseenter="stopTimer"
          @mouseleave="startTimer"
        >
          <div class="stage-visual-placeholder" aria-hidden="true">
            <span>{{ activeSlide.mediaLabel }}</span>
            <small>substituir por foto oficial</small>
          </div>
          <div class="stage-overlay" />

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

          <button class="hero-edge-arrow previous" type="button" aria-label="Destaque anterior" @click="previous">‹</button>
          <button class="hero-edge-arrow next" type="button" aria-label="Próximo destaque" @click="next">›</button>

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
        </article>

        <aside class="hero-news-panel" aria-label="Últimas novidades da RAS UFRB">
          <div class="hero-news-heading">
            <strong>Últimas novidades</strong>
            <a href="#eventos">Ver todas <span aria-hidden="true">→</span></a>
          </div>

          <article v-for="item in newsItems" :key="`${item.tag}-${item.title}`" class="hero-news-item">
            <div class="hero-news-thumb" :class="`tone-${item.tone}`" aria-hidden="true" />
            <div class="hero-news-copy">
              <div class="hero-news-meta">
                <span>{{ item.tag }}</span>
                <small>{{ item.date }}</small>
              </div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </aside>
      </div>

      <div class="hero-previews" aria-label="Slides do painel">
        <button
          v-for="(slide, index) in slides.slice(0, 4)"
          :key="slide.id"
          type="button"
          class="hero-preview-card"
          :class="[`tone-${slide.tone}`, { active: index === current }]"
          @click="goTo(index)"
        >
          <div class="preview-visual-placeholder" aria-hidden="true" />
          <div class="preview-overlay" />
          <div class="preview-copy">
            <span>{{ slide.eyebrow }}</span>
            <strong>{{ slide.title }}</strong>
            <p>{{ slide.description }}</p>
          </div>
          <div class="preview-dots" aria-hidden="true">
            <i v-for="(_, dotIndex) in slides.slice(0, 4)" :key="dotIndex" :class="{ active: dotIndex === index }" />
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
