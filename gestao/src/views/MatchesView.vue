<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Match } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

interface MatchRow extends Match {
  categoryNome?: string
}

const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<MatchRow[]>([])

function formatDateTime(value?: string) {
  if (!value) return 'Não agendada'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

async function load() {
  loading.value = true
  try {
    await competition.load()
    if (!competition.selectedId) {
      rows.value = []
      return
    }
    const brackets = await adminApi.brackets(competition.selectedId)
    const groups = await Promise.all(
      brackets.map(async (bracket) => {
        const matches = await adminApi.matches(bracket.id)
        return matches.map((match) => ({ ...match, categoryNome: bracket.categoryNome }))
      })
    )
    rows.value = groups.flat().sort((a, b) => {
      const dateA = a.dataHora ? new Date(a.dataHora).getTime() : Number.MAX_SAFE_INTEGER
      const dateB = b.dataHora ? new Date(b.dataHora).getTime() : Number.MAX_SAFE_INTEGER
      if (dateA !== dateB) return dateA - dateB
      if (a.rodada !== b.rodada) return a.rodada - b.rodada
      return a.ordem - b.ordem
    })
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar as partidas.')
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
      <div><span class="eyebrow">Competição ao vivo</span><h1>Partidas</h1><p class="muted">Agenda consolidada da competição em foco.</p></div>
      <div class="heading-actions"><router-link to="/sumo" class="link-button">Operar Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip">
      <div><span class="eyebrow">Competição em foco</span><h2>{{ competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2></div>
      <strong>{{ rows.length }} partida(s)</strong>
    </article>

    <article class="table-card">
      <el-table :data="rows" empty-text="Nenhuma partida encontrada">
        <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
        <el-table-column label="Confronto" min-width="260">
          <template #default="{ row }"><strong>{{ row.robotANome || 'A definir' }}</strong><span class="versus">×</span><strong>{{ row.robotBNome || 'A definir' }}</strong></template>
        </el-table-column>
        <el-table-column prop="rodada" label="Rodada" width="90" />
        <el-table-column label="Horário" width="170"><template #default="{ row }">{{ formatDateTime(row.dataHora) }}</template></el-table-column>
        <el-table-column label="Status" width="170"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
      </el-table>
    </article>
  </div>
</template>
