<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { Bracket, CompetitionCategoryResult } from '../types'

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
const auth = useAuthStore()
const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<ResultRow[]>([])
const scopedBracket = ref<Bracket>()
const categoryResults = ref<CompetitionCategoryResult[]>([])

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

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(3)} s`
}

function winnerDetail(item: CompetitionCategoryResult) {
  if (item.status !== 'CONCLUIDO') return 'Resultado ainda pendente'
  if (item.modalidade === 'FOLLOW_LINE') {
    return `Melhor tempo: ${formatSeconds(item.tempoFinalSegundos)}`
  }
  return item.pontosA != null && item.pontosB != null
    ? `Final: ${item.pontosA} × ${item.pontosB}`
    : 'Campeão da chave atual'
}

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
      categoryResults.value = []
      scopedBracket.value = undefined
      return
    }

    const brackets = await adminApi.brackets(competition.selectedId)
    const requestedBracket = queryNumber(route.query.bracketId)
    scopedBracket.value = requestedBracket ? brackets.find((item) => item.id === requestedBracket) : undefined
    const sourceBrackets = scopedBracket.value
      ? [scopedBracket.value]
      : brackets.filter((item) => item.atual !== false && item.ativo !== false)

    categoryResults.value = scopedBracket.value
      ? []
      : await adminApi.competitionResults(competition.selectedId)

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
        <p class="muted">{{ scopedBracket ? `Resultados de ${scopedBracket.nome}.` : 'Vencedores por categoria e resultados consolidados da edição operacional.' }}</p>
      </div>
      <div class="heading-actions"><router-link :to="sumoLink" class="link-button">Abrir no Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip" :class="{ 'historical-bracket-banner': scopedBracket?.atual === false }">
      <div>
        <span class="eyebrow">{{ scopedBracket ? (scopedBracket.atual === false ? 'Chave histórica · somente leitura' : 'Chave vigente') : (auth.isDev ? 'Competição em foco' : 'Competição vigente') }}</span>
        <h2>{{ scopedBracket?.nome || competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2>
      </div>
      <strong>{{ rows.length }} resultado(s)</strong>
    </article>

    <section v-if="!scopedBracket" class="results-winners-section">
      <div class="section-mini-heading">
        <div>
          <span class="eyebrow">Classificação final</span>
          <strong>Vencedores por categoria</strong>
        </div>
        <span>{{ categoryResults.filter((item) => item.status === 'CONCLUIDO').length }}/{{ categoryResults.length }} definidos</span>
      </div>

      <div v-if="categoryResults.length" class="category-winners-grid">
        <article v-for="item in categoryResults" :key="item.categoryId" class="category-winner-card" :class="{ pending: item.status !== 'CONCLUIDO' }">
          <div class="winner-card-top">
            <el-tag :type="item.modalidade === 'FOLLOW_LINE' ? 'success' : 'danger'" effect="light">
              {{ item.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}
            </el-tag>
            <span>{{ item.status === 'CONCLUIDO' ? 'Definido' : 'Pendente' }}</span>
          </div>
          <small>{{ item.categoryNome }}</small>
          <template v-if="item.status === 'CONCLUIDO'">
            <strong>{{ item.winnerRobotNome }}</strong>
            <span>{{ item.winnerTeamNome }}</span>
            <em>{{ winnerDetail(item) }}</em>
          </template>
          <template v-else>
            <strong>Campeão ainda não definido</strong>
            <span>{{ winnerDetail(item) }}</span>
          </template>
          <router-link
            v-if="item.modalidade === 'SUMO' && item.finalMatchId"
            :to="{ name: 'sumo-match', params: { matchId: String(item.finalMatchId) } }"
            class="text-link"
          >Ver final</router-link>
          <router-link
            v-else-if="item.modalidade === 'FOLLOW_LINE'"
            :to="{ name: 'follow', query: { categoryId: String(item.categoryId), competitionId: String(competition.selectedId || '') } }"
            class="text-link"
          >Ver ranking</router-link>
        </article>
      </div>
      <div v-else class="results-winners-empty">Nenhuma categoria com inscrições nesta edição.</div>
    </section>

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


<style scoped>
.results-winners-section { display:grid; gap:12px; }
.category-winners-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
.category-winner-card { display:grid; gap:6px; min-height:180px; padding:16px; border:1px solid #e8dce2; border-radius:15px; background:linear-gradient(145deg,#fff,#fff8fa); box-shadow:0 8px 22px rgba(69,23,45,.04); }
.category-winner-card.pending { background:#fcfafb; }
.winner-card-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.winner-card-top > span { color:#88777f; font-size:10px; font-weight:800; text-transform:uppercase; }
.category-winner-card > small { color:#8c7d84; }
.category-winner-card > strong { margin-top:5px; color:#31242a; font-size:20px; }
.category-winner-card > span { color:#6f6067; font-size:12px; }
.category-winner-card > em { color:#9f0f3b; font-size:12px; font-style:normal; font-weight:800; }
.category-winner-card .text-link { margin-top:auto; }
.results-winners-empty { padding:28px; border:1px dashed #ddd0d6; border-radius:14px; color:#84757d; text-align:center; }
@media (max-width:1000px) { .category-winners-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:680px) { .category-winners-grid { grid-template-columns:1fr; } }
</style>
