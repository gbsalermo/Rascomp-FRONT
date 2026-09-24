<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { adminApi } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { Competitor, Registration, Team } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

type Scope = 'COMPETITION' | 'ALL'

const auth = useAuthStore()
const competition = useCompetitionStore()
const route = useRoute()

const loading = ref(false)
const changingId = ref<number>()
const search = ref('')
const teamId = ref<number>()
const scope = ref<Scope>('COMPETITION')
const competitors = ref<Competitor[]>([])
const teams = ref<Team[]>([])
const registrations = ref<Registration[]>([])
const detailsOpen = ref(false)
const selectedCompetitor = ref<Competitor>()

const effectiveScope = computed<Scope>(() => auth.isDev ? scope.value : 'COMPETITION')
const competitionLabel = computed(() =>
  auth.isDev ? 'Competição em foco' : 'Competição vigente'
)

const visibleCompetitors = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  return competitors.value.filter((item) => {
    if (teamId.value && item.teamId !== teamId.value) return false
    if (!term) return true
    return [
      item.nome,
      item.email || '',
      item.telefone || '',
      item.teamNome || '',
      item.institutionNome || '',
      item.institutionSigla || ''
    ].some((value) => value.toLocaleLowerCase('pt-BR').includes(term))
  })
})

const selectedRegistrations = computed(() => {
  const id = selectedCompetitor.value?.id
  if (!id) return []
  return registrations.value.filter((item) => item.competitorIds?.includes(id))
})

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function applyTeamFromRoute() {
  const raw = Number(route.query.teamId)
  teamId.value = Number.isFinite(raw) && raw > 0 ? raw : undefined
}

async function load() {
  loading.value = true
  competitors.value = []
  teams.value = []
  registrations.value = []
  try {
    await competition.load()

    if (effectiveScope.value === 'ALL' && auth.isDev) {
      const [competitorRows, teamRows, registrationRows] = await Promise.all([
        adminApi.competitors(),
        adminApi.teams(),
        adminApi.registrations()
      ])
      competitors.value = competitorRows
      teams.value = teamRows
      registrations.value = registrationRows
    } else if (competition.selectedId) {
      const [catalog, registrationRows] = await Promise.all([
        adminApi.competitionAdminCatalog(competition.selectedId),
        adminApi.registrations({ competitionId: competition.selectedId })
      ])
      competitors.value = catalog.competitors
      teams.value = catalog.teams
      registrations.value = registrationRows
    } else {
      competitors.value = []
      teams.value = []
      registrations.value = []
    }

    applyTeamFromRoute()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os competidores.')
  } finally {
    loading.value = false
  }
}

function openDetails(row: Competitor) {
  selectedCompetitor.value = row
  detailsOpen.value = true
}

async function toggleCompetitor(row: Competitor) {
  if (!auth.isDev) return
  const activate = row.ativo === false

  if (!activate) {
    try {
      await ElMessageBox.confirm(
        `Desativar ${row.nome}? O histórico competitivo será preservado, mas o competidor sai dos fluxos ativos.`,
        'Desativar competidor',
        { type: 'warning', confirmButtonText: 'Desativar', cancelButtonText: 'Cancelar' }
      )
    } catch {
      return
    }
  }

  changingId.value = row.id
  try {
    await adminApi.setCompetitorActive(row.id, activate)
    row.ativo = activate
    ElMessage.success(activate ? 'Competidor reativado.' : 'Competidor desativado.')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível alterar a situação do competidor.')
  } finally {
    changingId.value = undefined
  }
}

watch(() => competition.selectedId, () => {
  if (effectiveScope.value === 'COMPETITION') load()
})
watch(scope, load)
watch(() => route.query.teamId, applyTeamFromRoute)
onMounted(load)
</script>

<template>
  <div class="page-stack competitors-admin-page" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Pessoas da competição</span>
        <h1>Competidores</h1>
        <p class="muted">
          Consulte equipe, instituição, conta vinculada e participações competitivas.
        </p>
      </div>
      <div class="heading-actions">
        <el-segmented
          v-if="auth.isDev"
          v-model="scope"
          :options="[
            { label: 'Competição em foco', value: 'COMPETITION' },
            { label: 'Todos cadastrados', value: 'ALL' }
          ]"
        />
        <el-button @click="load">Atualizar</el-button>
      </div>
    </div>

    <div v-if="effectiveScope === 'COMPETITION'" class="admin-focus-strip">
      <div>
        <span class="eyebrow">{{ competitionLabel }}</span>
        <strong>{{ competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</strong>
      </div>
      <small>{{ competitors.length }} competidor(es) com participação registrada nesta edição</small>
    </div>

    <article class="table-card">
      <div class="filter-bar">
        <el-input v-model="search" clearable placeholder="Buscar competidor, equipe ou instituição" />
        <el-select v-model="teamId" clearable placeholder="Todas as equipes" style="width: 230px">
          <el-option v-for="team in teams" :key="team.id" :label="team.nome" :value="team.id" />
        </el-select>
      </div>

      <el-table :data="visibleCompetitors" empty-text="Nenhum competidor encontrado">
        <el-table-column prop="nome" label="Competidor" min-width="190" />
        <el-table-column prop="teamNome" label="Equipe" min-width="180" />
        <el-table-column label="Instituição" min-width="180">
          <template #default="{ row }">
            {{ row.institutionSigla || row.institutionNome || '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="E-mail" min-width="220" />
        <el-table-column label="Conta RasComp" min-width="160">
          <template #default="{ row }">
            <el-tag :type="row.userAccountId ? 'success' : 'info'" effect="light">
              {{ row.userAccountId ? 'Vinculada' : 'Não vinculada' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Situação" width="110">
          <template #default="{ row }">
            <el-tag :type="row.ativo === false ? 'info' : 'success'" effect="light">
              {{ row.ativo === false ? 'Inativo' : 'Ativo' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="225" align="right">
          <template #default="{ row }">
            <el-button size="small" plain @click="openDetails(row)">Detalhes</el-button>
            <el-button
              v-if="auth.isDev"
              size="small"
              :type="row.ativo === false ? 'success' : 'danger'"
              plain
              :loading="changingId === row.id"
              @click="toggleCompetitor(row)"
            >
              {{ row.ativo === false ? 'Reativar' : 'Desativar' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <div class="callout">
      <strong>Competidor e robô não possuem vínculo de propriedade direto.</strong>
      <p>
        Os robôs abaixo são exibidos a partir das inscrições em que o competidor participa.
        Transferências entre equipes continuam reservadas ao fluxo administrativo auditável da ETAPA 5.
      </p>
    </div>

    <el-drawer v-model="detailsOpen" title="Detalhes do competidor" size="min(680px, 96vw)">
      <template v-if="selectedCompetitor">
        <div class="competitor-detail">
          <section>
            <span class="eyebrow">Cadastro</span>
            <h2>{{ selectedCompetitor.nome }}</h2>
            <div class="competitor-detail-grid">
              <div><small>Equipe</small><strong>{{ selectedCompetitor.teamNome || '—' }}</strong></div>
              <div><small>Instituição</small><strong>{{ selectedCompetitor.institutionSigla || selectedCompetitor.institutionNome || '—' }}</strong></div>
              <div><small>E-mail</small><strong>{{ selectedCompetitor.email || '—' }}</strong></div>
              <div><small>Telefone</small><strong>{{ selectedCompetitor.telefone || '—' }}</strong></div>
              <div><small>Conta participante</small><strong>{{ selectedCompetitor.userAccountNome || 'Não vinculada' }}</strong></div>
              <div><small>Cadastro</small><strong>{{ formatDate(selectedCompetitor.dataCadastro) }}</strong></div>
            </div>
          </section>

          <section class="competitor-participations">
            <div class="card-heading">
              <div>
                <span class="eyebrow">Participações</span>
                <h3>Inscrições do competidor</h3>
              </div>
            </div>
            <el-table :data="selectedRegistrations" empty-text="Nenhuma participação no escopo atual">
              <el-table-column prop="competitionNome" label="Competição" min-width="150" />
              <el-table-column prop="categoryNome" label="Categoria" min-width="150" />
              <el-table-column prop="robotNome" label="Robô utilizado" min-width="135" />
              <el-table-column label="Status" width="125">
                <template #default="{ row }"><StatusBadge :value="row.status" /></template>
              </el-table-column>
            </el-table>
          </section>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.competitor-detail { display:grid; gap:22px; }
.competitor-detail h2 { margin:4px 0 14px; }
.competitor-detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.competitor-detail-grid > div { display:grid; gap:4px; padding:12px; border:1px solid #eadfe4; border-radius:12px; background:#fff; }
.competitor-detail-grid small { color:#85777e; font-size:10px; text-transform:uppercase; font-weight:800; }
.competitor-detail-grid strong { color:#372a31; overflow-wrap:anywhere; }
.competitor-participations { display:grid; gap:8px; }
@media (max-width:680px) {
  .competitor-detail-grid { grid-template-columns:1fr; }
}
</style>
