<template>
  <footer id="contato" class="institutional-footer">
    <section class="institutional-footer-light">
      <div class="institutional-footer-container footer-light-grid">
        <section class="footer-identity-column">
          <a href="#top" class="footer-identity" aria-label="IEEE RAS UFRB — voltar ao início">
            <img
              class="footer-identity-logo"
              src="/ieee-ras-official.png"
              alt="IEEE Robotics & Automation Society"
            />
            <span class="footer-identity-copy">
              <strong><b>IEEE</b> <em>RAS</em> UFRB</strong>
              <small>Robotics & Automation Society</small>
              <small>UFRB Student Chapter</small>
            </span>
          </a>

          <p class="footer-identity-description">
            Promovemos conhecimento, inovação e robótica para transformar ideias em soluções que constroem o futuro.
          </p>

          <div class="footer-location-list">
            <div>
              <span class="footer-mini-icon" aria-hidden="true">●</span>
              <p><strong>UFRB — Campus Cruz das Almas</strong><small>Cruz das Almas, BA — Brasil</small></p>
            </div>
            <div>
              <span class="footer-mini-icon" aria-hidden="true">✉</span>
              <p><strong>Contato oficial</strong><small>E-mail a confirmar</small></p>
            </div>
          </div>

          <div class="footer-socials" aria-label="Redes sociais">
            <a href="#" @click.prevent aria-label="Instagram">◎</a>
            <a href="#" @click.prevent aria-label="YouTube">▶</a>
            <a href="#" @click.prevent aria-label="LinkedIn">in</a>
            <a href="#" @click.prevent aria-label="GitHub">⌘</a>
          </div>
        </section>

        <nav class="footer-link-column" aria-label="Navegação institucional">
          <h3>Navegação</h3>
          <span class="footer-heading-line" aria-hidden="true" />
          <a href="#top"><span aria-hidden="true">⌂</span>Início<b aria-hidden="true">›</b></a>
          <a href="#sobre"><span aria-hidden="true">ⓘ</span>Sobre a RAS<b aria-hidden="true">›</b></a>
          <a href="#equipe"><span aria-hidden="true">♙</span>Equipe<b aria-hidden="true">›</b></a>
          <a href="#equipe"><span aria-hidden="true">▣</span>Robôs<b aria-hidden="true">›</b></a>
          <a href="#eventos"><span aria-hidden="true">□</span>Eventos<b aria-hidden="true">›</b></a>
          <a href="#competicao-atual"><span aria-hidden="true">♜</span>Competição<b aria-hidden="true">›</b></a>
          <a href="#galeria"><span aria-hidden="true">▧</span>Galeria<b aria-hidden="true">›</b></a>
          <a href="#contato"><span aria-hidden="true">➤</span>Contato<b aria-hidden="true">›</b></a>
        </nav>

        <nav class="footer-link-column footer-useful-links" aria-label="Links úteis">
          <h3>Links úteis</h3>
          <span class="footer-heading-line" aria-hidden="true" />
          <a href="https://www.ieee-ras.org/" target="_blank" rel="noreferrer"><span aria-hidden="true">◎</span>IEEE RAS Global</a>
          <a href="https://www.ieee.org.br/" target="_blank" rel="noreferrer"><span aria-hidden="true">⚑</span>IEEE Brasil</a>
          <a href="https://ieeexplore.ieee.org/" target="_blank" rel="noreferrer"><span aria-hidden="true">⌕</span>IEEE Xplore</a>
          <a href="#eventos"><span aria-hidden="true">□</span>Eventos</a>
          <a href="#" @click.prevent><span aria-hidden="true">◇</span>Recursos para estudantes</a>
          <a href="#" @click.prevent><span aria-hidden="true">▤</span>Guias e materiais</a>
          <a href="#" @click.prevent><span aria-hidden="true">♢</span>Código de conduta</a>
        </nav>

        <section class="footer-partners-column" aria-label="Apoio e parceiros">
          <h3>Apoio e parceiros</h3>
          <span class="footer-heading-line" aria-hidden="true" />

          <div class="footer-partner-grid">
            <article><strong>UFRB</strong><small>Universidade</small></article>
            <article><strong>IEEE</strong><small>Instituição</small></article>
            <article><strong>IEEE RAS</strong><small>Sociedade</small></article>
            <article><strong>CETEC</strong><small>Centro</small></article>
          </div>

          <a class="footer-partner-cta" href="#contato">
            <span aria-hidden="true">◇</span>
            <strong>Seja um parceiro</strong>
            <b aria-hidden="true">→</b>
          </a>
        </section>

        <section class="footer-contact-column">
          <h3>Fale conosco</h3>
          <span class="footer-heading-line" aria-hidden="true" />
          <p>Tem dúvidas, sugestões ou quer saber mais sobre a RAS UFRB? Entre em contato conosco.</p>

          <div class="footer-contact-cards">
            <a href="#" @click.prevent>
              <span class="footer-contact-icon" aria-hidden="true">✉</span>
              <div><strong>E-mail</strong><small>Contato oficial a confirmar</small></div>
              <b aria-hidden="true">›</b>
            </a>
            <a href="#" @click.prevent>
              <span class="footer-contact-icon" aria-hidden="true">◎</span>
              <div><strong>Instagram</strong><small>Canal oficial a confirmar</small></div>
              <b aria-hidden="true">›</b>
            </a>
            <a href="#" @click.prevent>
              <span class="footer-contact-icon" aria-hidden="true">♙</span>
              <div><strong>Mande uma mensagem</strong><small>Formulário de contato futuro</small></div>
              <b aria-hidden="true">›</b>
            </a>
          </div>
        </section>
      </div>
    </section>

    <section class="institutional-footer-bottom">
      <div class="institutional-footer-container footer-bottom-grid">
        <div class="footer-bottom-brand">
          <span class="footer-bottom-mark" aria-hidden="true">RAS</span>
          <strong>IEEE RAS UFRB</strong>
          <p>Organização dedicada ao avanço da tecnologia para o benefício da humanidade.</p>
        </div>

        <div class="footer-bottom-center">
          <p>© {{ new Date().getFullYear() }} RAS UFRB — Todos os direitos reservados.</p>
          <p>Feito com <span aria-label="amor">♥</span> por membros da RAS UFRB</p>
        </div>

        <nav class="footer-bottom-actions" aria-label="Políticas e navegação final">
          <a href="/privacidade">Privacidade</a>
          <i aria-hidden="true" />
          <a href="/termos-de-uso">Termos de Uso</a>
          <a class="footer-back-to-top" href="#top" aria-label="Voltar ao topo">↑</a>
        </nav>
      </div>
    </section>
  </footer>
</template>
