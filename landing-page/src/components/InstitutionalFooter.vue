<template>
  <footer id="contato" class="institutional-footer">
    <div class="institutional-footer-accent" aria-hidden="true" />

    <div class="institutional-footer-container">
      <div class="institutional-footer-main">
        <section class="footer-brand-column">
          <a href="#top" class="footer-brand" aria-label="RAS UFRB — voltar ao início">
            <span class="footer-brand-mark" aria-hidden="true">RAS</span>
            <span>
              <strong>IEEE RAS UFRB</strong>
              <small>Robotics & Automation Society</small>
            </span>
          </a>

          <p>
            Capítulo estudantil da IEEE Robotics & Automation Society na Universidade Federal do Recôncavo da Bahia,
            conectando estudantes por meio de robótica, automação, extensão e inovação.
          </p>

          <div class="footer-socials" aria-label="Redes sociais">
            <a href="#contato" aria-label="Instagram">◎</a>
            <a href="#contato" aria-label="YouTube">▶</a>
            <a href="#contato" aria-label="LinkedIn">in</a>
            <a href="#contato" aria-label="GitHub">⌘</a>
          </div>
        </section>

        <nav class="footer-links-column" aria-label="Links institucionais">
          <span>Institucional</span>
          <a href="#sobre">Sobre</a>
          <a href="#equipe">Equipe e Diretoria</a>
          <a href="#galeria">Galeria</a>
          <a href="#eventos">Eventos</a>
          <a href="#calendario">Calendário</a>
        </nav>

        <nav class="footer-links-column" aria-label="Links da competição">
          <span>Competição</span>
          <a href="#competicao-atual">RRC</a>
          <a href="#competicao-atual">Competição atual</a>
          <a href="#cronograma-competicao">Cronograma</a>
          <a href="#resultados">Resultados</a>
          <a href="#chaveamento">Chaveamento</a>
        </nav>

        <section class="footer-contact-column">
          <span>Contato</span>
          <div class="footer-contact-item">
            <small>E-mail</small>
            <strong>contato a definir</strong>
          </div>
          <div class="footer-contact-item">
            <small>Localização</small>
            <strong>UFRB · Cruz das Almas — BA</strong>
          </div>
          <a class="footer-contact-cta" href="#eventos">Acompanhar atividades <span aria-hidden="true">→</span></a>
        </section>
      </div>

      <section class="footer-support-section" aria-label="Apoio e parceiros">
        <div>
          <span>Apoio e parceiros</span>
          <p>Instituições que fortalecem ensino, extensão, pesquisa e robótica no capítulo.</p>
        </div>

        <div class="footer-support-list">
          <article>
            <strong>UFRB</strong>
            <small>Universidade</small>
          </article>
          <article>
            <strong>IEEE</strong>
            <small>Instituição</small>
          </article>
          <article>
            <strong>IEEE RAS</strong>
            <small>Sociedade</small>
          </article>
          <article>
            <strong>CETEC</strong>
            <small>Centro</small>
          </article>
          <article class="footer-support-placeholder">
            <strong>+</strong>
            <small>Parceiros futuros</small>
          </article>
        </div>
      </section>

      <div class="institutional-footer-bottom">
        <p>© {{ new Date().getFullYear() }} IEEE RAS UFRB. Conteúdo institucional.</p>
        <p>Competição e resultados oficiais gerenciados pelo RasComp.</p>
        <a href="#top">Voltar ao topo <span aria-hidden="true">↑</span></a>
      </div>
    </div>
  </footer>
</template>
