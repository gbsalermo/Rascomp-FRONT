<script setup lang="ts">
const partnerLogoModules = import.meta.glob(
  '../assets/footer/partners/*.{jpg,jpeg,png,webp,avif,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>

const contactEmail = String(
  import.meta.env.VITE_RAS_EMAIL || 'ieeerasufrb@gmail.com'
).trim()

const instagramUrl = String(
  import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/ieeerasufrb/'
).trim()

const whatsappUrl = String(
  import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/5573981264674'
).trim()

const emailHref = `mailto:${contactEmail}`

function partnerLogo(name: 'ufrb' | 'ieee' | 'cetec') {
  const entry = Object.entries(partnerLogoModules).find(([path]) => {
    const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '').toLowerCase() || ''
    return fileName === name
  })

  return entry?.[1] || ''
}
</script>

<template>
  <footer id="contato" class="institutional-footer">
    <section class="institutional-footer-main">
      <div class="institutional-footer-container footer-main-grid">
        <section class="footer-identity-column">
          <img
            class="footer-main-logo"
            src="/ieee-ras-footer-white.png"
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
            <article class="footer-partner-card footer-partner-card--ufrb">
              <span v-if="partnerLogo('ufrb')" class="footer-partner-logo-frame footer-partner-logo-frame--ufrb">
                <img
                  class="footer-partner-logo footer-partner-logo--ufrb"
                  :src="partnerLogo('ufrb')"
                  alt="UFRB"
                />
              </span>
              <strong v-else>UFRB</strong>
              <small>Universidade</small>
            </article>

            <article>
              <img v-if="partnerLogo('ieee')" :src="partnerLogo('ieee')" alt="IEEE" />
              <strong v-else>IEEE</strong>
              <small>Instituição</small>
            </article>

            <article class="footer-partner-card footer-partner-card--ras">
              <span class="footer-partner-logo-frame footer-partner-logo-frame--ras">
                <img
                  class="footer-partner-logo footer-partner-logo--ras"
                  src="/ieee-ras-official.png"
                  alt="IEEE Robotics & Automation Society"
                />
              </span>
              <small>Sociedade</small>
            </article>

            <article>
              <img v-if="partnerLogo('cetec')" :src="partnerLogo('cetec')" alt="CETEC" />
              <strong v-else>CETEC</strong>
              <small>Centro</small>
            </article>
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
            <a class="footer-contact-card" :href="emailHref">
              <span class="footer-contact-icon" aria-hidden="true">✉</span>
              <div><strong>E-mail</strong><small>{{ contactEmail }}</small></div>
              <b aria-hidden="true">›</b>
            </a>

            <a
              class="footer-contact-card"
              :href="instagramUrl"
              target="_blank"
              rel="noreferrer"
            >
              <span class="footer-contact-icon" aria-hidden="true">◎</span>
              <div><strong>Instagram</strong><small>@ieeerasufrb</small></div>
              <b aria-hidden="true">›</b>
            </a>

            <a
              class="footer-contact-card"
              :href="whatsappUrl"
              target="_blank"
              rel="noreferrer"
            >
              <span class="footer-contact-icon footer-contact-icon--whatsapp" aria-hidden="true">◉</span>
              <div><strong>WhatsApp</strong><small>+55 73 98126-4674</small></div>
              <b aria-hidden="true">›</b>
            </a>
          </div>
        </section>
      </div>
    </section>

    <section class="institutional-footer-bottom">
      <div class="institutional-footer-container footer-bottom-center">
        <p>© {{ new Date().getFullYear() }} RAS UFRB — Todos os direitos reservados.</p>
        <p>Feito com <span aria-label="amor">♥</span> por membros da RAS UFRB</p>
        <p class="footer-developer-credit">
          <span>Dev principal</span>
          <a href="https://github.com/gbsalermo" target="_blank" rel="noreferrer">
            <b aria-hidden="true">⌘</b>
            gbsalermo
          </a>
        </p>
      </div>
    </section>
  </footer>
</template>
