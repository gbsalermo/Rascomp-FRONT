<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi, http } from '../api'
import { useCompetitionStore } from '../store'
import type { Bracket, Match, MatchCallStatus } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

interface MatchRow extends Match {
  categoryNome?: string
  bracketNome?: string
  historical?: boolean
}

const route = useRoute()
const competition = useCompetitionStore()
const loading = ref(false)
const savingAgenda = ref(false)
const rows = ref<MatchRow[]>([])
const scopedBracket = ref<Bracket>()
const agendaDialog = ref(false)
const editingMatch = ref<MatchRow>()
const agenda = reactive({
  dataHora: '',
  pista: '',
  ordemExecucao: undefined as number | undefined,
  statusConvocacao: 'NAO_CONVOCADA' as MatchCallStatus
})

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

function callStatusLabel(value?: MatchCallStatus) {
  return ({
    NAO_CONVOCADA: 'Não convocada',
    CONVOCADA: 'Convocada',
    EM_CHAMADA: 'Em chamada',
    PRONTA: 'Pronta',
    ADIADA: 'Adiada'
  } as Record<MatchCallStatus, string>)[value || 'NAO_CONVOCADA']
}

function canOpenArena(row: MatchRow) {
  return Boolean(row.id)
    && Boolean(row.registrationAId)
    && Boolean(row.registrationBId)
    && row.status !== 'BYE'
    && row.status !== 'AGUARDANDO_PARTICIPANTES'
}

function canEditAgenda(row: MatchRow) {
  return !row.historical
    && row.bracketAtual !== false
    && row.bracketAtivo !== false
    && row.ativo !== false
    && !['EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA', 'BYE'].includes(row.status || '')
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

function openAgenda(row: MatchRow) {
  if (!canEditAgenda(row)) return
  editingMatch.value = row
  agenda.dataHora = row.dataHora || ''
  agenda.pista = row.pista || ''
  agenda.ordemExecucao = row.ordemExecucao
  agenda.statusConvocacao = row.statusConvocacao || 'NAO_CONVOCADA'
  agendaDialog.value = true
}

async function saveAgenda() {
  if (!editingMatch.value) return
  savingAgenda.value = true
  try {
    const updated = await http.patch<Match>(`/api/v1/partidas/${editingMatch.value.id}/agenda`, {
      dataHora: agenda.dataHora || null,
      pista: agenda.pista.trim() || null,
      ordemExecucao: agenda.ordemExecucao || null,
      statusConvocacao: agenda.statusConvocacao
    }).then((response) => response.data)

    const row = rows.value.find((item) => item.id === updated.id)
    if (row) Object.assign(row, updated)
    agendaDialog.value = false
    ElMessage.success('Agenda da partida atualizada sem alterar a estrutura da chave.')
    sortRows()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a agenda da partida.')
  } finally {
    savingAgenda.value = false
  }
}

function sortRows() {
  rows.value.sort((a, b) => {
    const orderA = a.ordemExecucao ?? Number.MAX_SAFE_INTEGER
    const orderB = b.ordemExecucao ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB

    const dateA = a.dataHora ? new Date(a.dataHora).getTime() : Number.MAX_SAFE_INTEGER
    const dateB = b.dataHora ? new Date(b.dataHora).getTime() : Number.MAX_SAFE_INTEGER
    if (dateA !== dateB) return dateA - dateB
    if (a.rodada !== b.rodada) return a.rodada - b.rodada
    return a.ordem - b.ordem
  })
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

    rows.value = groups.flat()
    sortRows()
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
        <p class="muted">{{ scopedBracket ? `Partidas de ${scopedBracket.nome}.` : 'Agenda operacional das chaves vigentes da competição em foco.' }}</p>
      </div>
      <div class="heading-actions"><router-link :to="sumoLink" class="link-button">Abrir no Sumô</router-link><el-button @click="load">Atualizar</el-button></div>
    </div>

    <article class="feature-card compact admin-focus-strip" :class="{ 'historical-bracket-banner': scopedBracket?.atual === false }">
      <div>
        <span class="eyebrow">{{ scopedBracket ? (scopedBracket.atual === false ? 'Chave histórica · somente leitura' : 'Chave vigente') : 'Competição em foco' }}</span>
        <h2>{{ scopedBracket?.nome || competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</h2>
        <p class="muted">Horário, pista, ordem de execução e convocação podem ser organizados sem alterar rodada, posição ou participantes da árvore.</p>
      </div>
      <strong>{{ rows.length }} partida(s)</strong>
    </article>

    <article class="table-card">
      <el-table :data="rows" empty-text="Nenhuma partida encontrada">
        <el-table-column prop="categoryNome" label="Categoria" min-width="150" />
        <el-table-column v-if="!scopedBracket" prop="bracketNome" label="Chave" min-width="190" />
        <el-table-column label="Confronto" min-width="240">
          <template #default="{ row }"><strong>{{ row.robotANome || 'A definir' }}</strong><span class="versus">×</span><strong>{{ row.robotBNome || 'A definir' }}</strong></template>
        </el-table-column>
        <el-table-column prop="rodada" label="Rodada" width="85" />
        <el-table-column label="Execução" width="90"><template #default="{ row }">{{ row.ordemExecucao || '—' }}</template></el-table-column>
        <el-table-column label="Pista" width="120"><template #default="{ row }">{{ row.pista || '—' }}</template></el-table-column>
        <el-table-column label="Horário" width="155"><template #default="{ row }">{{ formatDateTime(row.dataHora) }}</template></el-table-column>
        <el-table-column label="Convocação" width="135"><template #default="{ row }">{{ callStatusLabel(row.statusConvocacao) }}</template></el-table-column>
        <el-table-column label="Status" width="155"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
        <el-table-column label="Ações" width="190" align="right">
          <template #default="{ row }">
            <div class="match-actions">
              <el-button v-if="canEditAgenda(row)" link type="primary" @click="openAgenda(row)">Agenda</el-button>
              <router-link v-if="canOpenArena(row)" :to="arenaRoute(row)" class="text-link">
                {{ row.status === 'FINALIZADA' || row.status === 'CANCELADA' || row.historical ? 'Ver partida' : 'Abrir partida' }}
              </router-link>
              <span v-else-if="!canEditAgenda(row)" class="muted">Aguardando</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <el-dialog v-model="agendaDialog" title="Agenda operacional da partida" width="min(560px, 92vw)">
      <div v-if="editingMatch" class="form-grid">
        <div class="span-2 agenda-context">
          <span class="eyebrow">Estrutura protegida</span>
          <strong>Rodada {{ editingMatch.rodada }} · posição {{ editingMatch.ordem }}</strong>
          <small>{{ editingMatch.robotANome || 'A definir' }} × {{ editingMatch.robotBNome || 'A definir' }}</small>
        </div>
        <label class="span-2">Horário previsto
          <el-date-picker
            v-model="agenda.dataHora"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            format="DD/MM/YYYY HH:mm"
            placeholder="Sem horário definido"
            style="width:100%"
          />
        </label>
        <label>Pista
          <el-input v-model="agenda.pista" maxlength="80" placeholder="Ex.: Arena A" />
        </label>
        <label>Ordem de execução
          <el-input-number v-model="agenda.ordemExecucao" :min="1" controls-position="right" style="width:100%" />
        </label>
        <label class="span-2">Convocação
          <el-select v-model="agenda.statusConvocacao" style="width:100%">
            <el-option label="Não convocada" value="NAO_CONVOCADA" />
            <el-option label="Convocada" value="CONVOCADA" />
            <el-option label="Em chamada" value="EM_CHAMADA" />
            <el-option label="Pronta" value="PRONTA" />
            <el-option label="Adiada" value="ADIADA" />
          </el-select>
        </label>
        <p class="span-2 muted agenda-hint">Esta edição não altera a posição da partida na chave nem os participantes propagados pela progressão.</p>
      </div>
      <template #footer>
        <el-button @click="agendaDialog = false">Cancelar</el-button>
        <el-button class="brand-button" :loading="savingAgenda" @click="saveAgenda">Salvar agenda</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.match-actions { display:flex; align-items:center; justify-content:flex-end; gap:10px; }
.agenda-context { display:grid; gap:3px; padding:12px; border:1px solid #eee3e8; border-radius:12px; background:#fcfafb; }
.agenda-context strong { color:#3e3037; }
.agenda-context small { color:#7e7077; }
.agenda-hint { margin:0; font-size:11px; line-height:1.5; }
</style>
