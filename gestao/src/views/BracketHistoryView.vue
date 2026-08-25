<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

interface BracketHistoryRow extends Bracket {
  quantidadePartidas: number
}

const competition = useCompetitionStore()
const loading = ref(false)
const rows = ref<BracketHistoryRow[]>([])
const categoryFilter = ref<number>()
const statusFilter = ref('')
const search = ref('')

const categories = computed(() => {
  const map = new Map<number, string>()
  rows.value.forEach((item) => map.set(item.categoryId, item.categoryNome || `Categoria ${item.categoryId}`))
  return [...map.entries()]
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
})

const statuses = computed(() =>
  [...new Set(rows.value.map((item) => item.status).filter(Boolean) as string[])].sort()
)

function matchesFilters(item: BracketHistoryRow) {
  if (categoryFilter.value && item.categoryId !== categoryFilter.value) return false
  if (statusFilter.value && item.status !== statusFilter.value) return false
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  if (!term) return true
  return [item.nome, item.categoryNome, item.status]
    .filter(Boolean)
    .some((value) => String(value).toLocaleLowerCase('pt-BR').includes(term))
}

const currentRows = computed(() => rows.value.filter((item) => item.atual !== false && matchesFilters(item)))
const historicalRows = computed(() => rows.value.filter((item) => item.atual === false && matchesFilters(item)))
const historicalTotal = computed(() => rows.value.filter((item) => item.atual === false).length)
const totalMatches = computed(() => rows.value.reduce((total, item) => total + item.quantidadePartidas, 0))

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function sumoRoute(item?: BracketHistoryRow) {
  return {
    path: '/sumo',
    query: {
      competitionId: String(item?.competitionId || competition.selectedId || ''),
      ...(item?.categoryId ? { categoryId: String(item.categoryId) } : {}),
      ...(item?.id ? { bracketId: String(item.id) } : {})
    }
  }
}

function scopedRoute(path: '/partidas' | '/resultados', item: BracketHistoryRow) {
  return {
    path,
    query: {
      bracketId: String(item.id),
      competitionId: String(item.competitionId)
    }
  }
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
    rows.value = await Promise.all(
      brackets.map(async (bracket) => {
        const matches = await adminApi.matches(bracket.id)
        return { ...bracket, quantidadePartidas: matches.length }
      })
    )
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar o histórico de chaves.')
  } finally {
    loading.value = false
  }
}

watch(() => competition.selectedId, () => {
  categoryFilter.value = undefined
  statusFilter.value = ''
  search.value = ''
  load()
})
onMounted(load)
</script>

<template>
  <div class="page-stack bracket-history-page" v-loading="loading">
    <div class="page-heading bracket-history-heading">
      <div>
        <span class="eyebrow">Histórico competitivo</span>
        <h1>Chaves</h1>
        <p class="muted">Consulte a chave vigente e todas as gerações anteriores da competição em foco.</p>
      </div>
      <div class="heading-actions">
        <router-link :to="sumoRoute()" class="link-button bracket-generate-button">Gerar nova chave</router-link>
        <el-button @click="load">Atualizar</el-button>
      </div>
    </div>

    <article class="bracket-focus-card admin-focus-strip">
      <div>
        <span class="eyebrow">Competição em foco</span>
        <h2>{{ competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2>
        <p>Uma nova geração substitui apenas a chave vigente. As versões anteriores permanecem preservadas abaixo.</p>
      </div>
      <div class="bracket-focus-metrics">
        <span><strong>{{ rows.filter((item) => item.atual !== false).length }}</strong> vigente(s)</span>
        <span><strong>{{ historicalTotal }}</strong> histórica(s)</span>
        <span><strong>{{ totalMatches }}</strong> partida(s)</span>
      </div>
    </article>

    <article class="bracket-filter-bar">
      <el-input v-model="search" clearable placeholder="Buscar chave ou categoria" class="bracket-search" />
      <el-select v-model="categoryFilter" clearable placeholder="Todas as categorias" class="bracket-filter-select">
        <el-option v-for="item in categories" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-select v-model="statusFilter" clearable placeholder="Todos os status" class="bracket-filter-select">
        <el-option v-for="item in statuses" :key="item" :label="item" :value="item" />
      </el-select>
    </article>

    <section class="bracket-current-section">
      <div class="section-mini-heading bracket-section-heading">
        <div>
          <span class="eyebrow">Em operação</span>
          <strong>Chaves vigentes</strong>
        </div>
        <span>{{ currentRows.length }} encontrada(s)</span>
      </div>

      <div v-if="currentRows.length" class="bracket-current-grid">
        <article v-for="item in currentRows" :key="item.id" class="bracket-current-card">
          <div class="bracket-card-topline">
            <span class="bracket-current-pill">Chave atual</span>
            <StatusBadge :value="item.status" />
          </div>
          <div class="bracket-card-copy">
            <small>{{ item.categoryNome || 'Categoria' }}</small>
            <h2>{{ item.nome }}</h2>
            <span>Gerada em {{ formatDateTime(item.dataCadastro) }}</span>
          </div>
          <div class="bracket-card-stats">
            <strong>{{ item.quantidadePartidas }}</strong>
            <span>partida(s) na árvore</span>
          </div>
          <div class="bracket-card-actions">
            <router-link :to="sumoRoute(item)" class="bracket-primary-action">Abrir chave</router-link>
            <router-link :to="scopedRoute('/partidas', item)" class="bracket-secondary-action">Partidas</router-link>
            <router-link :to="scopedRoute('/resultados', item)" class="bracket-secondary-action">Resultados</router-link>
          </div>
        </article>
      </div>

      <div v-else class="bracket-history-empty">
        <strong>Nenhuma chave vigente encontrada.</strong>
        <span>Gere uma chave na operação do Sumô para iniciar o chaveamento desta edição.</span>
        <router-link :to="sumoRoute()" class="text-link">Abrir Sumô →</router-link>
      </div>
    </section>

    <article class="table-card bracket-history-table-card">
      <div class="card-heading bracket-history-card-heading">
        <div>
          <span class="eyebrow">Arquivo da edição</span>
          <h2>Chaves anteriores</h2>
          <p class="muted">Versões substituídas continuam disponíveis para auditoria, partidas e resultados.</p>
        </div>
        <strong>{{ historicalRows.length }} registro(s)</strong>
      </div>

      <el-table :data="historicalRows" empty-text="Nenhuma chave histórica para os filtros selecionados">
        <el-table-column label="Chave" min-width="260">
          <template #default="{ row }">
            <div class="bracket-history-name">
              <strong>{{ row.nome }}</strong>
              <small>#{{ row.id }} · {{ formatDateTime(row.dataCadastro) }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryNome" label="Categoria" min-width="180" />
        <el-table-column label="Partidas" width="100" align="center">
          <template #default="{ row }"><strong>{{ row.quantidadePartidas }}</strong></template>
        </el-table-column>
        <el-table-column label="Status" width="150">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="Situação" width="130">
          <template #default="{ row }">
            <span class="bracket-history-state" :class="{ inactive: row.ativo === false }">
              {{ row.ativo === false ? 'Arquivada' : 'Histórica' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="235" align="right">
          <template #default="{ row }">
            <div class="bracket-table-actions">
              <router-link :to="sumoRoute(row)" class="text-link">Ver chave</router-link>
              <router-link :to="scopedRoute('/partidas', row)" class="text-link">Partidas</router-link>
              <router-link :to="scopedRoute('/resultados', row)" class="text-link">Resultados</router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>
  </div>
</template>
