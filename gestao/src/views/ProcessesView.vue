<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { camundaApi } from '../api'

const loading = ref(false)
const definitions = ref<any[]>([])
const error = ref('')

async function load() {
  if (!camundaApi.enabled) return
  loading.value = true
  try {
    definitions.value = await camundaApi.processDefinitions()
  } catch {
    error.value = 'Camunda está habilitado, mas o Engine REST não respondeu.'
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>

<template>
  <div class="page-stack">
    <div class="page-heading">
      <div><span class="eyebrow">Orquestração</span><h1>Processos</h1><p class="muted">Ponto de encaixe do Camunda sem duplicar regras competitivas no frontend.</p></div>
      <span class="integration-chip" :class="{ live: camundaApi.enabled }">{{ camundaApi.enabled ? 'Engine REST habilitado' : 'VITE_CAMUNDA_ENABLED=false' }}</span>
    </div>

    <article class="process-card" v-loading="loading">
      <div class="process-flow">
        <div class="process-node done"><small>1</small><strong>Registration</strong><span>PENDENTE</span></div>
        <span class="flow-arrow">→</span>
        <div class="process-node pending"><small>2</small><strong>Camunda Task</strong><span>aprovar / rejeitar</span></div>
        <span class="flow-arrow">→</span>
        <div class="process-node"><small>3</small><strong>Backend</strong><span>estado oficial</span></div>
      </div>
      <p class="muted">Enquanto o BPMN não for implantado, a análise permanece disponível diretamente em Inscrições. Quando a flag for ligada, o frontend passa a tratar a decisão como tarefa de processo.</p>
    </article>

    <article class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Engine REST</span><h2>Definições implantadas</h2></div></div>
      <el-alert v-if="error" :title="error" type="warning" show-icon :closable="false" />
      <el-empty v-else-if="!camundaApi.enabled" description="Integração desabilitada até o BPMN RASCOMP ser implantado." />
      <el-table v-else :data="definitions" empty-text="Nenhuma definição encontrada"><el-table-column prop="name" label="Processo" /><el-table-column prop="key" label="Key" /><el-table-column prop="version" label="Versão" width="100" /></el-table>
    </article>
  </div>
</template>
