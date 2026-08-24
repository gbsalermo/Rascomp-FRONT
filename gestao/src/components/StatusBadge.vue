<script setup lang="ts">
defineProps<{ value?: string }>()
</script>

<template>
  <span class="status-badge" :class="`status-${String(value || 'NEUTRO').toLowerCase()}`">
    {{ value || '—' }}
  </span>
</template>
