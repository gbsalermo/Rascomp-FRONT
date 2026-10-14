<script setup lang="ts">
defineProps<{ value?: string }>()
const labels: Record<string,string> = {
  PLANEJADA:'Planejada',
  INSCRICOES_ABERTAS:'Inscrições abertas',
  INSCRICOES_ENCERRADAS:'Inscrições encerradas',
  EM_ANDAMENTO:'Em andamento',
  FINALIZADA:'Finalizada',
  CANCELADA:'Cancelada'
}
</script>

<template>
  <span class="status-badge" :class="`status-${String(value || 'NEUTRO').toLowerCase()}`">
    {{ labels[String(value || '').toUpperCase()] || String(value || '—').replaceAll('_', ' ') }}
  </span>
</template>
