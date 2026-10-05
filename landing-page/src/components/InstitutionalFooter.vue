<script setup lang="ts">
const contactEmail = String(import.meta.env.VITE_RAS_EMAIL || '').trim()
const instagramUrl = String(import.meta.env.VITE_INSTAGRAM_URL || '').trim()
const whatsappUrl = String(import.meta.env.VITE_WHATSAPP_URL || '').trim()

const emailHref = contactEmail ? `mailto:${contactEmail}` : ''
</script>

<template>
  <footer id="contato" class="institutional-footer">
    <section class="institutional-footer-main">
      <div class="institutional-footer-container footer-main-grid">
        <section class="footer-identity-column">
          <img
            class="footer-main-logo"
            src="/ieee-ras-official.png"
            alt="IEEE Robotics & Automation Society"
          />

          <p class="footer-main-message">
            Promovemos conhecimento, inovação e robótica para transformar ideias em soluções que constroem o futuro.
          </p>

          <div class="footer-campus">
            <span aria-hidden="true">●</span>
            <div>
              <strong>UFRB — Campus Cruz das Almas</strong>
              <small>Cruz das Almas, BA — Brasil</small>
            </div>
          </div>
        </section>

        <nav class="footer-links-column" aria-label="Links institucionais">
          <span class="footer-column-eyebrow">Explore e conecte-se</span>
          <h3>Links úteis</h3>
          <span class="footer-heading-line" aria-hidden="true" />

          <a href="https://www.ufrb.edu.br/" target="_blank" rel="noreferrer">
            <strong>UFRB</strong>
            <small>Universidade Federal do Recôncavo da Bahia</small>
            <span aria-hidden="true">↗</span>
          </a>

          <a href="https://www.ieee.org/" target="_blank" rel="noreferrer">
            <strong>IEEE</strong>
            <small>Institute of Electrical and Electronics Engineers</small>
            <span aria-hidden="true">↗</span>
          </a>

          <a href="https://www.ieee-ras.org/" target="_blank" rel="noreferrer">
            <strong>IEEE RAS</strong>
            <small>Robotics & Automation Society</small>
            <span aria-hidden="true">↗</span>
          </a>

          <a href="https://www.ieee.org.br/" target="_blank" rel="noreferrer">
            <strong>IEEE Brasil</strong>
            <small>Atuação e iniciativas do IEEE no Brasil</small>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <section class="footer-support-column" aria-label="Apoio e parceiros">
          <h3>Apoio e parceiros</h3>
          <span class="footer-heading-line" aria-hidden="true" />

          <div class="footer-partner-grid">
            <article><strong>UFRB</strong><small>Universidade</small></article>
            <article><strong>IEEE</strong><small>Instituição</small></article>
            <article><strong>IEEE RAS</strong><small>Sociedade</small></article>
            <article><strong>CETEC</strong><small>Centro</small></article>
          </div>

          <p class="footer-support-copy">
            <strong>Apoie o projeto.</strong>
            Quer contribuir com nossas ações, eventos e iniciativas? Fale conosco e ajude a fortalecer a robótica e a tecnologia na comunidade.
          </p>
        </section>

        <section class="footer-contact-column">
          <h3>Fale conosco</h3>
          <span class="footer-heading-line" aria-hidden="true" />
          <p>Tem dúvidas, sugestões ou quer saber mais sobre a RAS UFRB? Entre em contato conosco.</p>

          <div class="footer-contact-cards">
            <a v-if="emailHref" class="footer-contact-card" :href="emailHref">
              <span class="footer-contact-icon" aria-hidden="true">✉</span>
              <div><strong>E-mail</strong><small>{{ contactEmail }}</small></div>
              <b aria-hidden="true">›</b>
            </a>
            <div v-else class="footer-contact-card is-pending">
              <span class="footer-contact-icon" aria-hidden="true">✉</span>
              <div><strong>E-mail</strong><small>Contato oficial a cadastrar</small></div>
            </div>

            <a
              v-if="instagramUrl"
              class="footer-contact-card"
              :href="instagramUrl"
              target="_blank"
              rel="noreferrer"
            >
              <span class="footer-contact-icon" aria-hidden="true">◎</span>
              <div><strong>Instagram</strong><small>Canal oficial da RAS UFRB</small></div>
              <b aria-hidden="true">›</b>
            </a>
            <div v-else class="footer-contact-card is-pending">
              <span class="footer-contact-icon" aria-hidden="true">◎</span>
              <div><strong>Instagram</strong><small>Canal oficial a cadastrar</small></div>
            </div>

            <a
              v-if="whatsappUrl"
              class="footer-contact-card"
              :href="whatsappUrl"
              target="_blank"
              rel="noreferrer"
            >
              <span class="footer-contact-icon footer-contact-icon--whatsapp" aria-hidden="true">◉</span>
              <div><strong>WhatsApp</strong><small>Fale diretamente com a RAS UFRB</small></div>
              <b aria-hidden="true">›</b>
            </a>
            <div v-else class="footer-contact-card is-pending">
              <span class="footer-contact-icon footer-contact-icon--whatsapp" aria-hidden="true">◉</span>
              <div><strong>WhatsApp</strong><small>Número oficial a cadastrar</small></div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <section class="institutional-footer-bottom">
      <div class="institutional-footer-container footer-bottom-center">
        <p>© {{ new Date().getFullYear() }} RAS UFRB — Todos os direitos reservados.</p>
        <p>Feito com <span aria-label="amor">♥</span> por membros da RAS UFRB</p>
      </div>
    </section>
  </footer>
</template>
