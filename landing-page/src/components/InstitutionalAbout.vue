<script setup lang="ts">
import { computed, ref } from 'vue'
import { HOME_MEDIA } from '../content/homeMedia'

type AboutTab = 'ieee' | 'ras'

const activeTab = ref<AboutTab>('ieee')

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
        <div class="about-media-panel" aria-label="Imagem institucional da RAS UFRB">
          <div class="about-photo-main">
            <img
              v-if="HOME_MEDIA.about.ras.src"
              class="about-photo-image"
              :src="HOME_MEDIA.about.ras.src"
              :alt="HOME_MEDIA.about.ras.alt"
            />
            <div v-else class="about-photo-placeholder" aria-hidden="true" />

            <div class="about-photo-overlay" />
            <span class="about-photo-badge">RAS UFRB</span>

            <div class="about-photo-copy">
              <strong>Equipe RAS UFRB</strong>
              <p>Membros reunidos em atividades, projetos e eventos do capítulo.</p>
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
