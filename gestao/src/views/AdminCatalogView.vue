<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Category, Robot, Team } from '../types'

const route = useRoute()
const competition = useCompetitionStore()
const loading = ref(false)
const teams = ref<Team[]>([])
const robots = ref<Robot[]>([])
const categories = ref<Category[]>([])

const mode = computed(() => {
  if (route.path === '/equipes') return 'teams'
  if (route.path === '/robos') return 'robots'
  return 'categories'
})

const title = computed(() => ({ teams: 'Equipes', robots: 'Robôs', categories: 'Modalidades' })[mode.value])
const subtitle = computed(() => ({
  teams: 'Equipes cadastradas no sistema e suas instituições.',
  robots: 'Robôs cadastrados e respectivas equipes.',
  categories: 'Categorias/modalidades configuradas para a competição em foco.'
})[mode.value])

const filteredCategories = computed(() => {
  if (!competition.selectedId) return categories.value
  return categories.value.filter((item) => !item.competitionId || item.competitionId === competition.selectedId)
})

async function load() {
  loading.value = true
  try {
    await competition.load()
    if (mode.value === 'teams') teams.value = await adminApi.teams()
    if (mode.value === 'robots') robots.value = await adminApi.robots()
    if (mode.value === 'categories') categories.value = await adminApi.categories()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os dados.')
  } finally {
    loading.value = false
  }
}

watch(() => route.path, load)
watch(() => competition.selectedId, () => {
  if (mode.value === 'categories') load()
})
onMounted(load)
</script>

<template>
  <div class="page-stack admin-catalog-page" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Cadastros administrativos</span>
        <h1>{{ title }}</h1>
        <p class="muted">{{ subtitle }}</p>
      </div>
      <el-button @click="load">Atualizar</el-button>
    </div>

    <article v-if="mode === 'teams'" class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Base do sistema</span><h2>Equipes cadastradas</h2></div></div>
      <el-table :data="teams" empty-text="Nenhuma equipe cadastrada">
        <el-table-column prop="nome" label="Equipe" min-width="220" />
        <el-table-column prop="institutionNome" label="Instituição" min-width="220" />
        <el-table-column label="Situação" width="120">
          <template #default="{ row }">{{ row.ativo === false ? 'Inativa' : 'Ativa' }}</template>
        </el-table-column>
      </el-table>
    </article>

    <article v-else-if="mode === 'robots'" class="table-card">
      <div class="card-heading"><div><span class="eyebrow">Base do sistema</span><h2>Robôs cadastrados</h2></div></div>
      <el-table :data="robots" empty-text="Nenhum robô cadastrado">
        <el-table-column prop="nome" label="Robô" min-width="220" />
        <el-table-column prop="teamNome" label="Equipe" min-width="200" />
        <el-table-column prop="descricao" label="Descrição" min-width="260" />
        <el-table-column label="Situação" width="120">
          <template #default="{ row }">{{ row.ativo === false ? 'Inativo' : 'Ativo' }}</template>
        </el-table-column>
      </el-table>
    </article>

    <article v-else class="table-card">
      <div class="card-heading">
        <div><span class="eyebrow">Competição em foco</span><h2>{{ competition.selectedCompetition?.nome || 'Modalidades' }}</h2></div>
      </div>
      <el-table :data="filteredCategories" empty-text="Nenhuma modalidade configurada">
        <el-table-column prop="nome" label="Categoria" min-width="220" />
        <el-table-column label="Modalidade" width="170">
          <template #default="{ row }">{{ row.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}</template>
        </el-table-column>
        <el-table-column label="Situação" width="120">
          <template #default="{ row }">{{ row.ativo === false ? 'Inativa' : 'Ativa' }}</template>
        </el-table-column>
      </el-table>
    </article>
  </div>
</template>
