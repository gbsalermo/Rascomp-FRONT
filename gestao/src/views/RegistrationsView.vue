<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import type { Competition, Registration, RegistrationStatus } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const loading = ref(false)
const reviewingId = ref<number>()
const competitions = ref<Competition[]>([])
const rows = ref<Registration[]>([])
const competitionId = ref<number>()
const status = ref<string>('PENDENTE')
const search = ref('')
const detailsOpen = ref(false)
const selected = ref<Registration>()

const statusOptions: RegistrationStatus[] = [
  'PENDENTE',
  'APROVADA',
  'REJEITADA',
  'CANCELADA',
  'DESCLASSIFICADA'
]

const activeCompetition = computed(() =>
  competitions.value.find((item) => item.id === competitionId.value)
)

const filtered = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('pt-BR')

  return rows.value.filter((item) => {
    const matchesStatus = !status.value || item.status === status.value
    if (!matchesStatus) return false
    if (!query) return true

    const haystack = [
      item.teamNome,
      item.robotNome,
      item.categoryNome,
      item.requestedByUserNome,
      ...(item.competitorNomes || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('pt-BR')

    return haystack.includes(query)
  })
})

const counts = computed(() => ({
  total: rows.value.length,
  pendente: rows.value.filter((item) => item.status === 'PENDENTE').length,
  aprovada: rows.value.filter((item) => item.status === 'APROVADA').length,
  rejeitada: rows.value.filter((item) => item.status === 'REJEITADA').length
}))

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

async function loadBase() {
  loading.value = true
  try {
    competitions.value = await adminApi.competitions()
    const focus =
      competitions.value.find((c) => c.status === 'EM_ANDAMENTO') ||
      competitions.value.find((c) => c.status === 'INSCRICOES_ABERTAS') ||
      competitions.value.find((c) => c.status === 'INSCRICOES_ENCERRADAS') ||
      competitions.value[0]
    competitionId.value = focus?.id
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar as inscrições.')
  } finally {
    loading.value = false
  }
}

async function load() {
  loading.value = true
  try {
    rows.value = competitionId.value
      ? await adminApi.registrations({ competitionId: competitionId.value })
      : await adminApi.registrations()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar as inscrições.')
  } finally {
    loading.value = false
  }
}

function openDetails(row: Registration) {
  selected.value = row
  detailsOpen.value = true
}

function selectStatus(next: string) {
  status.value = status.value === next ? '' : next
}

async function review(row: Registration, next: RegistrationStatus) {
  const approving = next === 'APROVADA'
  const action = approving ? 'aprovar' : 'rejeitar'

  try {
    await ElMessageBox.confirm(
      `Deseja ${action} a inscrição do robô ${row.robotNome}, da equipe ${row.teamNome}?`,
      approving ? 'Aprovar inscrição' : 'Rejeitar inscrição',
      {
        type: approving ? 'success' : 'warning',
        confirmButtonText: approving ? 'Aprovar' : 'Rejeitar',
        cancelButtonText: 'Cancelar'
      }
    )

    reviewingId.value = row.id
    await adminApi.updateRegistration(row.id, { ...row, status: next })
    ElMessage.success(approving ? 'Inscrição aprovada.' : 'Inscrição rejeitada.')
    detailsOpen.value = false
    await load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a inscrição.')
  } finally {
    reviewingId.value = undefined
  }
}

onMounted(loadBase)
</script>

<template>
  <div class="page-stack registrations-page">
    <div class="page-heading registrations-heading">
      <div>
        <span class="eyebrow">Entrada da competição</span>
        <h1>Inscrições</h1>
        <p class="muted">
          Analise participantes e robôs antes de liberar a entrada nas modalidades do RRC.
        </p>
      </div>
      <div class="heading-actions">
        <el-button :loading="loading" @click="load">Atualizar</el-button>
      </div>
    </div>

    <article v-if="activeCompetition" class="registrations-focus-strip">
      <div>
        <span>Competição selecionada</span>
        <strong>{{ activeCompetition.nome }}</strong>
      </div>
      <StatusBadge :value="activeCompetition.status || 'PLANEJADA'" />
    </article>

    <div class="registrations-metrics">
      <button type="button" class="registration-metric" :class="{ active: status === '' }" @click="status = ''">
        <span>Total</span><strong>{{ counts.total }}</strong>
      </button>
      <button type="button" class="registration-metric pending" :class="{ active: status === 'PENDENTE' }" @click="selectStatus('PENDENTE')">
        <span>Pendentes</span><strong>{{ counts.pendente }}</strong>
      </button>
      <button type="button" class="registration-metric approved" :class="{ active: status === 'APROVADA' }" @click="selectStatus('APROVADA')">
        <span>Aprovadas</span><strong>{{ counts.aprovada }}</strong>
      </button>
      <button type="button" class="registration-metric rejected" :class="{ active: status === 'REJEITADA' }" @click="selectStatus('REJEITADA')">
        <span>Rejeitadas</span><strong>{{ counts.rejeitada }}</strong>
      </button>
    </div>

    <article class="registration-filters">
      <div class="registration-filter-main">
        <el-input
          v-model="search"
          clearable
          placeholder="Buscar equipe, robô, categoria ou participante"
        />
        <el-select v-model="competitionId" placeholder="Competição" @change="load">
          <el-option v-for="item in competitions" :key="item.id" :label="item.nome" :value="item.id" />
        </el-select>
        <el-select v-model="status" placeholder="Status" clearable>
          <el-option label="Todos" value="" />
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <span class="registration-result-count">{{ filtered.length }} resultado(s)</span>
    </article>

    <article class="table-card registrations-table-card" v-loading="loading">
      <el-table :data="filtered" empty-text="Nenhuma inscrição neste filtro" @row-dblclick="openDetails">
        <el-table-column label="Equipe / Robô" min-width="210">
          <template #default="{ row }">
            <div class="registration-main-cell">
              <strong>{{ row.teamNome }}</strong>
              <span>{{ row.robotNome }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
        <el-table-column label="Competidores" min-width="190">
          <template #default="{ row }">
            <span class="registration-competitors">
              {{ row.competitorNomes?.length ? row.competitorNomes.join(', ') : 'Não informado' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Solicitação" min-width="170">
          <template #default="{ row }">
            <div class="registration-request-cell">
              <strong>{{ row.requestedByUserNome || 'Organização' }}</strong>
              <span>{{ formatDateTime(row.dataCadastro) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="145">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="Ações" width="235" fixed="right">
          <template #default="{ row }">
            <div class="registration-actions">
              <el-button size="small" @click="openDetails(row)">Detalhes</el-button>
              <template v-if="row.status === 'PENDENTE'">
                <el-button
                  size="small"
                  type="success"
                  plain
                  :loading="reviewingId === row.id"
                  @click="review(row, 'APROVADA')"
                >
                  Aprovar
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  plain
                  :loading="reviewingId === row.id"
                  @click="review(row, 'REJEITADA')"
                >
                  Rejeitar
                </el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <el-drawer v-model="detailsOpen" size="min(520px, 94vw)" direction="rtl" class="registration-details-drawer">
      <template #header>
        <div v-if="selected" class="registration-drawer-heading">
          <span class="eyebrow">Detalhes da inscrição</span>
          <h2>{{ selected.teamNome }}</h2>
        </div>
      </template>

      <div v-if="selected" class="registration-details">
        <section class="registration-details-hero">
          <div>
            <small>Robô</small>
            <strong>{{ selected.robotNome }}</strong>
            <span>{{ selected.categoryNome }}</span>
          </div>
          <StatusBadge :value="selected.status" />
        </section>

        <section class="registration-details-section">
          <h3>Participação</h3>
          <dl>
            <div><dt>Competição</dt><dd>{{ selected.competitionNome }}</dd></div>
            <div><dt>Equipe</dt><dd>{{ selected.teamNome }}</dd></div>
            <div><dt>Categoria</dt><dd>{{ selected.categoryNome }}</dd></div>
            <div><dt>Robô</dt><dd>{{ selected.robotNome }}</dd></div>
          </dl>
        </section>

        <section class="registration-details-section">
          <h3>Competidores</h3>
          <div v-if="selected.competitorNomes?.length" class="registration-person-list">
            <span v-for="name in selected.competitorNomes" :key="name">{{ name }}</span>
          </div>
          <p v-else class="muted">Nenhum competidor informado.</p>
        </section>

        <section class="registration-details-section">
          <h3>Solicitação e análise</h3>
          <dl>
            <div><dt>Solicitado por</dt><dd>{{ selected.requestedByUserNome || 'Organização' }}</dd></div>
            <div><dt>Enviado em</dt><dd>{{ formatDateTime(selected.dataCadastro) }}</dd></div>
            <div><dt>Revisado por</dt><dd>{{ selected.reviewedByUserNome || '—' }}</dd></div>
            <div><dt>Revisado em</dt><dd>{{ formatDateTime(selected.reviewedAt) }}</dd></div>
          </dl>
        </section>

        <section class="registration-details-section">
          <h3>Observação</h3>
          <p class="registration-observation">
            {{ selected.observacao || 'Nenhuma observação enviada.' }}
          </p>
        </section>

        <div v-if="selected.status === 'PENDENTE'" class="registration-review-footer">
          <el-button
            type="danger"
            plain
            :loading="reviewingId === selected.id"
            @click="review(selected, 'REJEITADA')"
          >
            Rejeitar
          </el-button>
          <el-button
            type="success"
            :loading="reviewingId === selected.id"
            @click="review(selected, 'APROVADA')"
          >
            Aprovar inscrição
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
