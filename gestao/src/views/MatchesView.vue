<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket, Match } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

interface MatchRow extends Match {
  categoryNome?: string
  bracketNome?: string
  historical?: boolean
}

const route = useRoute()
const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<MatchRow[]>([])
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

function formatDateTime(value?: string) {
  if (!value) return 'Não agendada'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

function canOpenArena(row: MatchRow) {
  return Boolean(row.id)
    && Boolean(row.registrationAId)
    && Boolean(row.registrationBId)
    && row.status !== 'BYE'
    && row.status !== 'AGUARDANDO_PARTICIPANTES'
}

function arenaRoute(row: MatchRow) {
  return {
    name: 'sumo-match',
    params: { matchId: String(row.id) },
    query: {
      ...(row.competitionId ? { competitionId: String(row.competitionId) } : {}),
      ...(row.categoryId ? { categoryId: String(row.categoryId) } : {}),
      ...(row.bracketId ? { bracketId: String(row.bracketId) } : {})
    }
  }
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
        const matches = await adminApi.matches(bracket.id)
        return matches.map((match) => ({
          ...match,
          categoryNome: bracket.categoryNome,
          bracketNome: bracket.nome,
          historical: bracket.atual === false
        }))
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
watch(() => route.fullPath, load)
onMounted(load)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">{{ scopedBracket?.atual === false ? 'Consulta histórica' : 'Competição ao vivo' }}</span>
        <h1>Partidas</h1>
        <p class="muted">{{ scopedBracket ? `Partidas de ${scopedBracket.nome}.` : 'Agenda consolidada apenas das chaves vigentes da competição em foco.' }}</p>
      </div>
      <div class="heading-actions"><router-link :to="sumoLink" class="link-button">Abrir no Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip" :class="{ 'historical-bracket-banner': scopedBracket?.atual === false }">
      <div>
        <span class="eyebrow">{{ scopedBracket ? (scopedBracket.atual === false ? 'Chave histórica · somente leitura' : 'Chave vigente') : 'Competição em foco' }}</span>
        <h2>{{ scopedBracket?.nome || competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2>
      </div>
      <strong>{{ rows.length }} partida(s)</strong>
    </article>

    <article class="table-card">
      <el-table :data="rows" empty-text="Nenhuma partida encontrada">
        <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
        <el-table-column v-if="!scopedBracket" prop="bracketNome" label="Chave" min-width="210" />
        <el-table-column label="Confronto" min-width="260">
          <template #default="{ row }"><strong>{{ row.robotANome || 'A definir' }}</strong><span class="versus">×</span><strong>{{ row.robotBNome || 'A definir' }}</strong></template>
        </el-table-column>
        <el-table-column prop="rodada" label="Rodada" width="90" />
        <el-table-column label="Horário" width="170"><template #default="{ row }">{{ formatDateTime(row.dataHora) }}</template></el-table-column>
        <el-table-column label="Status" width="170"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
        <el-table-column label="Ação" width="130" align="right">
          <template #default="{ row }">
            <router-link v-if="canOpenArena(row)" :to="arenaRoute(row)" class="text-link">
              {{ row.status === 'FINALIZADA' || row.status === 'CANCELADA' || row.historical ? 'Ver partida' : 'Abrir partida' }}
            </router-link>
            <span v-else class="muted">Aguardando</span>
          </template>
        </el-table-column>
      </el-table>
    </article>
  </div>
</template>
