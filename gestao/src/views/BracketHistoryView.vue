<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<Bracket[]>([])

async function load() {
  loading.value = true
  try {
    await competition.load()
    rows.value = competition.selectedId ? await adminApi.brackets(competition.selectedId) : []
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar o histórico de chaves.')
  } finally {
    loading.value = false
  }
}

watch(() => competition.selectedId, load)
onMounted(load)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Histórico competitivo</span>
        <h1>Chaves</h1>
        <p class="muted">Consulte os chaveamentos já gerados para a competição em foco.</p>
      </div>
      <div class="heading-actions">
        <router-link to="/sumo" class="link-button">Abrir operação do Sumô</router-link>
        <el-button @click="load">Atualizar</el-button>
      </div>
    </div>

    <article class="feature-card compact admin-focus-strip">
      <div><span class="eyebrow">Competição em foco</span><h2>{{ competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2></div>
      <strong>{{ rows.length }} chave(s)</strong>
    </article>

    <article class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Arquivo da edição</span><h2>Chaveamentos gerados</h2></div></div>
      <el-table :data="rows" empty-text="Nenhuma chave gerada para esta competição">
        <el-table-column prop="nome" label="Chave" min-width="240" />
        <el-table-column prop="categoryNome" label="Categoria" min-width="190" />
        <el-table-column label="Status" width="160">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="Situação" width="120">
          <template #default="{ row }">{{ row.ativo === false ? 'Arquivada' : 'Ativa' }}</template>
        </el-table-column>
        <el-table-column label="" width="150" align="right">
          <template #default><router-link to="/sumo" class="text-link">Ver chave →</router-link></template>
        </el-table-column>
      </el-table>
    </article>
  </div>
</template>
