<script setup lang="ts">
import { onMounted } from 'vue'
import { useCompetitionStore } from '../store'

const competition = useCompetitionStore()
onMounted(() => competition.load())
</script>

<template>
  <div class="page-stack settings-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Sistema</span>
        <h1>Configurações</h1>
        <p class="muted">Atalhos para os principais pontos de configuração administrativa disponíveis hoje.</p>
      </div>
    </div>

    <section class="settings-grid">
      <article class="settings-card">
        <span class="eyebrow">Contexto</span>
        <h2>Competição em foco</h2>
        <strong>{{ competition.selectedCompetition?.nome || 'Nenhuma selecionada' }}</strong>
        <p>Datas, status, descrição e demais dados da edição são configurados na tela da competição.</p>
        <router-link to="/competicoes" class="text-link">Configurar competição →</router-link>
      </article>

      <article class="settings-card">
        <span class="eyebrow">Estrutura</span>
        <h2>Modalidades e categorias</h2>
        <p>Consulte as categorias vinculadas à edição e as modalidades ativas no sistema.</p>
        <router-link to="/modalidades" class="text-link">Ver modalidades →</router-link>
      </article>

      <article class="settings-card">
        <span class="eyebrow">Conta e acesso</span>
        <h2>Autenticação</h2>
        <p>Login e sessão já estão integrados. Recuperação de senha continua dependendo do endpoint específico no backend.</p>
      </article>
    </section>
  </div>
</template>
