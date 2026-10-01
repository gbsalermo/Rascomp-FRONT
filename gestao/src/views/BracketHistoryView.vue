<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { Bracket, Category, Match, MatchResult } from '../types'
import StatusBadge from '../components/StatusBadge.vue'
import TournamentBracket from '../components/TournamentBracket.vue'

interface BracketHistoryRow extends Bracket {
  quantidadePartidas: number
}

const auth = useAuthStore()
const competition = useCompetitionStore()
const competitionContextLabel = computed(() =>
  auth.isDev ? 'Competição em foco' : 'Competição vigente'
)

const loading = ref(false)
const rows = ref<BracketHistoryRow[]>([])
const categoryFilter = ref<number>()
const statusFilter = ref('')
const search = ref('')
const sumoCategories = ref<Category[]>([])
const generationDialog = ref(false)
const generationSaving = ref(false)
const generationForm = reactive({
  categoryId: undefined as number | undefined,
  justificativa: ''
})
const previewBracketId = ref<number>()
const previewMatches = ref<Match[]>([])
const previewResults = ref<MatchResult[]>([])
const correctingMatchId = ref<number>()

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
const previewBracket = computed(() => rows.value.find((item) => item.id === previewBracketId.value))
const currentCompetitionStatus = computed(() => competition.selectedCompetition?.status)
const canGenerateCommon = computed(() => currentCompetitionStatus.value === 'INSCRICOES_ENCERRADAS')
const canGenerateExceptional = computed(() => auth.isDev && currentCompetitionStatus.value === 'EM_ANDAMENTO')

async function selectPreview(item: BracketHistoryRow) {
  previewBracketId.value = item.id
  try {
    ;[previewMatches.value, previewResults.value] = await Promise.all([
      adminApi.matches(item.id),
      adminApi.results(item.id)
    ])
  } catch (error: any) {
    previewMatches.value = []
    previewResults.value = []
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar a árvore da chave.')
  }
}

function resultForMatch(matchId: number) {
  return previewResults.value.find((item) => item.matchId === matchId)
}

async function correctResult(match: Match) {
  const result = resultForMatch(match.id)
  if (!auth.isDev || !result || !match.registrationAId || !match.registrationBId) return

  const currentWinner = result.winnerRegistrationId
  const options = [
    { id: match.registrationAId, nome: match.robotANome || 'Robô A' },
    { id: match.registrationBId, nome: match.robotBNome || 'Robô B' }
  ]
  const alternative = options.find((item) => item.id !== currentWinner)
  if (!alternative) return

  try {
    await ElMessageBox.confirm(
      `Corrigir o vencedor da partida para ${alternative.nome}? Essa operação é exclusiva do DEV, ficará auditada e será bloqueada se uma dependência seguinte já tiver começado.`,
      'Correção excepcional de resultado',
      {
        type: 'warning',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }
    )

    const { value } = await ElMessageBox.prompt(
      'Informe a justificativa da correção. Os rounds originais permanecem no histórico e o resultado consolidado fica marcado como corrigido pelo DEV.',
      'Justificativa obrigatória',
      {
        inputType: 'textarea',
        inputPlaceholder: 'Motivo da correção excepcional',
        inputValidator: (value) => value?.trim() ? true : 'Informe a justificativa.',
        confirmButtonText: 'Corrigir resultado',
        cancelButtonText: 'Cancelar'
      }
    )

    correctingMatchId.value = match.id
    await adminApi.correctSumoMatchResult(match.id, {
      winnerRegistrationId: alternative.id,
      justificativa: value.trim()
    })
    ElMessage.success('Resultado corrigido e propagação atualizada com auditoria.')
    if (previewBracket.value) await selectPreview(previewBracket.value)
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível corrigir o resultado.')
  } finally {
    correctingMatchId.value = undefined
  }
}

function openGeneration() {
  generationForm.categoryId = sumoCategories.value[0]?.id
  generationForm.justificativa = ''
  generationDialog.value = true
}

async function generateFromBrackets() {
  if (!competition.selectedId || !generationForm.categoryId) {
    return ElMessage.warning('Selecione a categoria de Sumô.')
  }

  generationSaving.value = true
  try {
    const created = canGenerateExceptional.value
      ? await adminApi.regenerateBracketExceptional({
          competitionId: competition.selectedId,
          categoryId: generationForm.categoryId,
          justificativa: generationForm.justificativa.trim()
        })
      : await adminApi.generateBracket(competition.selectedId, generationForm.categoryId)

    ElMessage.success(
      canGenerateExceptional.value
        ? 'Chave anterior arquivada e nova chave gerada com segurança.'
        : 'Nova chave gerada.'
    )
    generationDialog.value = false
    await load()
    const createdRow = rows.value.find((item) => item.id === created.id)
    if (createdRow) await selectPreview(createdRow)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível gerar a nova chave.')
  } finally {
    generationSaving.value = false
  }
}

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

    const [brackets, categories] = await Promise.all([
      adminApi.brackets(competition.selectedId),
      adminApi.categories('SUMO')
    ])
    sumoCategories.value = categories.filter((item) => item.ativo !== false)
    rows.value = await Promise.all(
      brackets.map(async (bracket) => {
        const matches = await adminApi.matches(bracket.id)
        return { ...bracket, quantidadePartidas: matches.length }
      })
    )

    const preferred = rows.value.find((item) => item.id === previewBracketId.value)
      || rows.value.find((item) => item.atual !== false)
      || rows.value[0]
    if (preferred) await selectPreview(preferred)
    else {
      previewBracketId.value = undefined
      previewMatches.value = []
      previewResults.value = []
    }
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
        <p class="muted">Consulte a chave vigente e todas as gerações anteriores da edição operacional.</p>
      </div>
      <div class="heading-actions">
        <el-button
          v-if="canGenerateCommon || canGenerateExceptional"
          class="brand-button bracket-generate-button"
          @click="openGeneration"
        >Gerar nova chave</el-button>
        <el-button @click="load">Atualizar</el-button>
      </div>
    </div>

    <article class="bracket-focus-card admin-focus-strip">
      <div>
        <span class="eyebrow">{{ competitionContextLabel }}</span>
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
            <button type="button" class="bracket-primary-action" @click="selectPreview(item)">Ver árvore</button>
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

    <section v-if="previewBracket" class="bracket-preview-section">
      <div class="card-heading bracket-preview-heading">
        <div>
          <span class="eyebrow">{{ previewBracket.atual !== false ? 'Árvore vigente' : 'Árvore histórica · somente leitura' }}</span>
          <h2>{{ previewBracket.nome }}</h2>
          <p class="muted">{{ previewBracket.categoryNome }}</p>
          <p v-if="previewBracket.generationReason" class="bracket-generation-reason">
            <strong>Motivo da regeneração:</strong> {{ previewBracket.generationReason }}
            <span v-if="previewBracket.generatedByUserNome"> · {{ previewBracket.generatedByUserNome }}</span>
          </p>
        </div>
        <StatusBadge :value="previewBracket.status || 'GERADO'" />
      </div>
      <TournamentBracket
        :matches="previewMatches"
        :results="previewResults"
        :read-only="previewBracket.atual === false"
        return-to="chaves"
      />

      <div v-if="previewResults.length" class="bracket-result-audit">
        <div class="section-mini-heading">
          <div>
            <span class="eyebrow">Resultados da chave</span>
            <strong>Auditoria e correções DEV</strong>
          </div>
        </div>
        <el-table :data="previewMatches.filter((item) => resultForMatch(item.id))" size="small">
          <el-table-column label="Partida" min-width="170">
            <template #default="{ row }">
              <strong>{{ row.tipoPartida === 'TERCEIRO_LUGAR' ? 'Disputa de 3º lugar' : `Rodada ${row.rodada} · #${row.ordem}` }}</strong>
            </template>
          </el-table-column>
          <el-table-column label="Vencedor" min-width="160">
            <template #default="{ row }">{{ resultForMatch(row.id)?.winnerRobotNome }}</template>
          </el-table-column>
          <el-table-column label="Auditoria" min-width="230">
            <template #default="{ row }">
              <span v-if="resultForMatch(row.id)?.correctionReason" class="corrected-result-note">
                Corrigido por {{ resultForMatch(row.id)?.correctedByUserNome || 'DEV' }} · {{ resultForMatch(row.id)?.correctionReason }}
              </span>
              <span v-else class="muted">Resultado original</span>
            </template>
          </el-table-column>
          <el-table-column v-if="auth.isDev && previewBracket.atual !== false" label="DEV" width="150" align="right">
            <template #default="{ row }">
              <el-button
                size="small"
                type="warning"
                plain
                :loading="correctingMatchId === row.id"
                @click="correctResult(row)"
              >Corrigir vencedor</el-button>
            </template>
          </el-table-column>
        </el-table>
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
              <button type="button" class="text-link bracket-inline-button" @click="selectPreview(row)">Ver árvore</button>
              <router-link :to="scopedRoute('/partidas', row)" class="text-link">Partidas</router-link>
              <router-link :to="scopedRoute('/resultados', row)" class="text-link">Resultados</router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>
    <el-dialog v-model="generationDialog" title="Gerar nova chave de Sumô" width="min(620px, 94vw)">
      <div class="bracket-generation-form">
        <label>Categoria
          <el-select v-model="generationForm.categoryId" filterable style="width:100%">
            <el-option v-for="item in sumoCategories" :key="item.id" :label="item.nome" :value="item.id" />
          </el-select>
        </label>

        <div v-if="canGenerateExceptional" class="bracket-generation-warning">
          <strong>Regeneração excepcional DEV</strong>
          <span>
            A competição já está EM_ANDAMENTO. A chave vigente será arquivada e uma nova será criada somente se nenhuma disputa real da chave atual tiver começado.
          </span>
        </div>

        <label v-if="canGenerateExceptional">Justificativa obrigatória
          <el-input
            v-model="generationForm.justificativa"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="Ex.: inclusão excepcional de robô autorizada pela organização."
          />
        </label>
      </div>
      <template #footer>
        <el-button @click="generationDialog = false">Cancelar</el-button>
        <el-button
          class="brand-button"
          :loading="generationSaving"
          :disabled="canGenerateExceptional && !generationForm.justificativa.trim()"
          @click="generateFromBrackets"
        >Gerar nova chave</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.bracket-preview-section { display:grid; gap:14px; }
.bracket-preview-heading { align-items:flex-start; }
.bracket-generation-reason { margin:8px 0 0; font-size:12px; color:#6f6067; }
.bracket-inline-button { border:0; background:transparent; padding:0; cursor:pointer; }
.bracket-generation-form { display:grid; gap:14px; }
.bracket-generation-form label { display:grid; gap:6px; font-size:12px; font-weight:800; color:#4e3d45; }
.bracket-generation-warning { display:grid; gap:5px; padding:12px 14px; border-radius:12px; background:#fff7e8; border:1px solid #efd59a; }
.bracket-generation-warning span { color:#765f36; font-size:12px; line-height:1.45; }
.bracket-result-audit { margin-top:16px; padding:14px; border:1px solid #eee1e6; border-radius:14px; background:#fff; }
.corrected-result-note { color:#8a5b00; font-size:11px; font-weight:700; line-height:1.4; }
</style>
