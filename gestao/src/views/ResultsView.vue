<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket } from '../types'

interface ResultRow {
  id: number
  matchId: number
  categoryNome?: string
  bracketNome?: string
  winnerRobotNome?: string
  pontosA?: number
  pontosB?: number
  robotANome?: string
  robotBNome?: string
}

const route = useRoute()
const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<ResultRow[]>([])
const scopedBracket = ref<Bracket>()

const sumoLink = computed(() =>
  scopedBracket.value
    ? {
        path: '/sumo',
        query: {
          competitionId: String(scopedBracket.value.competitionId),
          categoryId: String(scopedBracket.value.categoryId),
          bracketId: String(scopedBracket.value.id)
        }
      }
    : '/sumo'
)

function queryNumber(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

async function load() {
  loading.value = true
  try {
    await competition.load()

    const requestedCompetition = queryNumber(route.query.competitionId)
    if (requestedCompetition && competition.competitions.some((item) => item.id === requestedCompetition)) {
      if (competition.selectedId !== requestedCompetition) competition.select(requestedCompetition)
    }

    if (!competition.selectedId) {
      rows.value = []
      scopedBracket.value = undefined
      return
    }

    const brackets = await adminApi.brackets(competition.selectedId)
    const requestedBracket = queryNumber(route.query.bracketId)
    scopedBracket.value = requestedBracket ? brackets.find((item) => item.id === requestedBracket) : undefined
    const sourceBrackets = scopedBracket.value
      ? [scopedBracket.value]
      : brackets.filter((item) => item.atual !== false && item.ativo !== false)

    const groups = await Promise.all(
      sourceBrackets.map(async (bracket) => {
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
            bracketNome: bracket.nome,
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
watch(() => route.fullPath, load)
onMounted(load)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">{{ scopedBracket?.atual === false ? 'Consulta histórica' : 'Competição ao vivo' }}</span>
        <h1>Resultados</h1>
        <p class="muted">{{ scopedBracket ? `Resultados de ${scopedBracket.nome}.` : 'Resultados consolidados apenas das chaves vigentes da competição em foco.' }}</p>
      </div>
      <div class="heading-actions"><router-link :to="sumoLink" class="link-button">Abrir no Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip" :class="{ 'historical-bracket-banner': scopedBracket?.atual === false }">
      <div>
        <span class="eyebrow">{{ scopedBracket ? (scopedBracket.atual === false ? 'Chave histórica · somente leitura' : 'Chave vigente') : 'Competição em foco' }}</span>
        <h2>{{ scopedBracket?.nome || competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2>
      </div>
      <strong>{{ rows.length }} resultado(s)</strong>
    </article>

    <article class="table-card">
      <el-table :data="rows" empty-text="Nenhum resultado consolidado">
        <el-table-column prop="categoryNome" label="Categoria" min-width="170" />
        <el-table-column v-if="!scopedBracket" prop="bracketNome" label="Chave" min-width="210" />
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
