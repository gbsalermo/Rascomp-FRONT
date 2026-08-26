<script setup lang="ts">
const year = new Date().getFullYear()

// Reaproveita temporariamente o asset oficial já versionado no app de gestão.
// Antes da publicação definitiva, copiar o mesmo arquivo para landing-page/public.
const rasLogoUrl =
  'https://raw.githubusercontent.com/gbsalermo/Rascomp-FRONT/main/gestao/public/ieee-ras-official.png'
</script>

<template>
  <footer id="contato" class="institutional-footer">
    <div class="institutional-footer-inner">
      <div class="footer-identity-block">
        <a href="#top" class="footer-ras-logo" aria-label="IEEE RAS UFRB — voltar ao início">
          <img :src="rasLogoUrl" alt="IEEE RAS UFRB" />
        </a>

        <p>
          Promovemos conhecimento, inovamos soluções e inspiramos a próxima geração de engenheiros e pesquisadores.
        </p>
      </div>

      <div class="footer-signature-block">
        <p>© {{ year }} RAS UFRB — Todos os direitos reservados.</p>
        <p>Feito com <span aria-label="carinho">♥</span> por membros da RAS UFRB</p>
      </div>

      <div class="footer-legal-block">
        <span>Privacidade</span>
        <i aria-hidden="true" />
        <span>Termos de Uso</span>
        <a href="#top" class="footer-back-to-top" aria-label="Voltar ao topo">↑</a>
      </div>
    </div>
  </footer>
</template>
