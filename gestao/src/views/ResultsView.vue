<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'

interface ResultRow {
  id: number
  matchId: number
  categoryNome?: string
  winnerRobotNome?: string
  pontosA?: number
  pontosB?: number
  robotANome?: string
  robotBNome?: string
}

const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<ResultRow[]>([])

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
        const [matches, results] = await Promise.all([
          adminApi.matches(bracket.id),
          adminApi.results(bracket.id)
        ])
        return results.map((result) => {
          const match = matches.find((item) => item.id === result.matchId)
          return {
            id: result.id,
            matchId: result.matchId,
            categoryNome: bracket.categoryNome,
            winnerRobotNome: result.winnerRobotNome,
            pontosA: result.pontosA,
            pontosB: result.pontosB,
            robotANome: match?.robotANome,
            robotBNome: match?.robotBNome
          }
        })
      })
    )
    rows.value = groups.flat().sort((a, b) => b.matchId - a.matchId)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os resultados.')
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
      <div><span class="eyebrow">Competição ao vivo</span><h1>Resultados</h1><p class="muted">Resultados consolidados da competição em foco.</p></div>
      <div class="heading-actions"><router-link to="/sumo" class="link-button">Operar Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip">
      <div><span class="eyebrow">Competição em foco</span><h2>{{ competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2></div>
      <strong>{{ rows.length }} resultado(s)</strong>
    </article>

    <article class="table-card">
      <el-table :data="rows" empty-text="Nenhum resultado consolidado">
        <el-table-column prop="categoryNome" label="Categoria" min-width="170" />
        <el-table-column label="Confronto" min-width="260">
          <template #default="{ row }">{{ row.robotANome || '—' }} <span class="versus">×</span> {{ row.robotBNome || '—' }}</template>
        </el-table-column>
        <el-table-column prop="winnerRobotNome" label="Vencedor" min-width="180" />
        <el-table-column label="Placar" width="110"><template #default="{ row }"><strong>{{ row.pontosA ?? 0 }} × {{ row.pontosB ?? 0 }}</strong></template></el-table-column>
        <el-table-column prop="matchId" label="Partida" width="90" />
      </el-table>
    </article>
  </div>
</template>
