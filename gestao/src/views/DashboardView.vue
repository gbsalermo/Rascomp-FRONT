<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi, participantApi } from '../api'
import { useAuthStore } from '../store'
import type {
  Competition,
  Competitor,
  Registration,
  Robot,
  Team
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const competitions = ref<Competition[]>([])
const registrations = ref<Registration[]>([])
const teams = ref<Team[]>([])
const robots = ref<Robot[]>([])
const competitors = ref<Competitor[]>([])

const activeCompetition = computed(
  () =>
    competitions.value.find((item) => item.status === 'EM_ANDAMENTO') ||
    competitions.value.find((item) => item.status === 'INSCRICOES_ABERTAS') ||
    competitions.value.find((item) => item.status === 'INSCRICOES_ENCERRADAS') ||
    competitions.value[0]
)

const focusRegistrations = computed(() => {
  const competitionId = activeCompetition.value?.id
  if (!competitionId) return registrations.value
  return registrations.value.filter((item) => item.competitionId === competitionId)
})

const pendingRegistrations = computed(() =>
  focusRegistrations.value.filter((item) => item.status === 'PENDENTE')
)

const approvedRegistrations = computed(() =>
  focusRegistrations.value.filter((item) => item.status === 'APROVADA')
)

const recentRegistrations = computed(() =>
  [...focusRegistrations.value]
    .sort((a, b) => {
      const dateA = new Date(a.reviewedAt || a.dataCadastro || 0).getTime()
      const dateB = new Date(b.reviewedAt || b.dataCadastro || 0).getTime()
      if (dateA !== dateB) return dateB - dateA
      return (b.id || 0) - (a.id || 0)
    })
    .slice(0, 6)
)

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

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

async function load() {
  loading.value = true
  error.value = ''

  try {
    if (auth.isOrganization) {
      const [allCompetitions, allRegistrations, allTeams, allRobots, allCompetitors] =
        await Promise.all([
          adminApi.competitions(),
          adminApi.registrations(),
          adminApi.teams(),
          adminApi.robots(),
          adminApi.competitors()
        ])

      competitions.value = allCompetitions
      registrations.value = allRegistrations
      teams.value = allTeams
      robots.value = allRobots
      competitors.value = allCompetitors
    } else {
      teams.value = await participantApi.teams()
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Não foi possível carregar o painel.'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-stack dashboard-page" v-loading="loading">
    <div class="page-heading dashboard-heading">
      <div>
        <span class="eyebrow">Central operacional</span>
        <h1>Olá, {{ auth.user?.nome?.split(' ')[0] }}.</h1>
        <p class="muted">
          {{
            auth.isOrganization
              ? 'Acompanhe a edição em foco e acesse rapidamente as operações do RRC.'
              : 'Gerencie sua equipe e acompanhe suas inscrições.'
          }}
        </p>
      </div>
      <div class="heading-actions">
        <el-button @click="load">Atualizar painel</el-button>
      </div>
    </div>

    <div v-if="error" class="dashboard-alert">
      <strong>Não foi possível atualizar todos os dados.</strong>
      <span>{{ error }}</span>
    </div>

    <template v-if="auth.isOrganization">
      <article v-if="activeCompetition" class="competition-focus-card">
        <div class="competition-focus-copy">
          <span class="eyebrow light">Competição em foco</span>
          <div class="competition-focus-title">
            <div>
              <h2>{{ activeCompetition.nome }}</h2>
              <p>{{ activeCompetition.descricao || 'Sem descrição cadastrada.' }}</p>
            </div>
            <StatusBadge :value="activeCompetition.status || 'PLANEJADA'" />
          </div>

          <div class="competition-focus-meta">
            <span>
              <small>Competição</small>
              <strong>{{ formatDate(activeCompetition.dataInicio) }} → {{ formatDate(activeCompetition.dataFim) }}</strong>
            </span>
            <span>
              <small>Inscrições</small>
              <strong>{{ formatDate(activeCompetition.inicioInscricoes) }} → {{ formatDate(activeCompetition.fimInscricoes) }}</strong>
            </span>
            <span>
              <small>Aprovadas</small>
              <strong>{{ approvedRegistrations.length }} de {{ focusRegistrations.length }}</strong>
            </span>
          </div>
        </div>

        <div class="competition-focus-actions">
          <router-link to="/competicoes" class="focus-secondary-action">Ver competição</router-link>
          <router-link to="/inscricoes" class="focus-primary-action">Ver inscrições</router-link>
        </div>
      </article>

      <article v-else class="empty-state-card">
        <span class="eyebrow">Competição em foco</span>
        <h2>Nenhuma competição cadastrada</h2>
        <p class="muted">Cadastre a primeira edição para começar a operação do RRC.</p>
        <router-link to="/competicoes" class="link-button">Abrir competições</router-link>
      </article>

      <div class="metric-grid dashboard-metric-grid">
        <article class="metric-card accent-purple">
          <span>Inscrições da edição</span>
          <strong>{{ focusRegistrations.length }}</strong>
          <small>{{ approvedRegistrations.length }} aprovadas</small>
        </article>
        <article class="metric-card">
          <span>Equipes cadastradas</span>
          <strong>{{ teams.length }}</strong>
          <small>base administrativa</small>
        </article>
        <article class="metric-card">
          <span>Robôs cadastrados</span>
          <strong>{{ robots.length }}</strong>
          <small>{{ competitors.length }} competidores</small>
        </article>
        <article class="metric-card accent-red">
          <span>Aguardando análise</span>
          <strong>{{ pendingRegistrations.length }}</strong>
          <small>na competição em foco</small>
        </article>
      </div>

      <div class="dashboard-main-grid">
        <article class="table-card dashboard-table-card">
          <div class="card-heading">
            <div>
              <span class="eyebrow">Movimentação recente</span>
              <h2>Últimas inscrições</h2>
            </div>
            <router-link to="/inscricoes" class="text-link">Ver todas</router-link>
          </div>

          <el-table :data="recentRegistrations" empty-text="Nenhuma inscrição registrada">
            <el-table-column prop="teamNome" label="Equipe" min-width="150" />
            <el-table-column prop="robotNome" label="Robô" min-width="140" />
            <el-table-column prop="categoryNome" label="Categoria" min-width="150" />
            <el-table-column label="Status" width="140">
              <template #default="{ row }">
                <StatusBadge :value="row.status" />
              </template>
            </el-table-column>
            <el-table-column label="Atualização" width="145">
              <template #default="{ row }">
                <span class="muted small">{{ formatDateTime(row.reviewedAt || row.dataCadastro) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </article>

        <aside class="dashboard-side-stack">
          <article class="dashboard-action-card">
            <div>
              <span class="eyebrow">Acesso rápido</span>
              <h2>Operação</h2>
            </div>

            <div class="quick-action-list">
              <router-link to="/inscricoes" class="quick-action">
                <div><strong>Analisar inscrições</strong><small>Aprovar ou rejeitar pendências</small></div>
                <span>→</span>
              </router-link>
              <router-link to="/follow-line" class="quick-action">
                <div><strong>Seguidor de Linha</strong><small>Registrar tentativa e consultar ranking</small></div>
                <span>→</span>
              </router-link>
              <router-link to="/sumo" class="quick-action">
                <div><strong>Operar Sumô</strong><small>Inspeção, chave, partidas e rounds</small></div>
                <span>→</span>
              </router-link>
              <router-link to="/competicoes" class="quick-action">
                <div><strong>Competições</strong><small>Configurar e consultar edições</small></div>
                <span>→</span>
              </router-link>
            </div>
          </article>

          <article class="dashboard-summary-card">
            <span class="eyebrow">Base do sistema</span>
            <h2>Cadastros</h2>
            <dl class="dashboard-summary-list">
              <div><dt>Competições</dt><dd>{{ competitions.length }}</dd></div>
              <div><dt>Equipes</dt><dd>{{ teams.length }}</dd></div>
              <div><dt>Competidores</dt><dd>{{ competitors.length }}</dd></div>
              <div><dt>Robôs</dt><dd>{{ robots.length }}</dd></div>
            </dl>
          </article>
        </aside>
      </div>
    </template>

    <template v-else>
      <div class="metric-grid">
        <article class="metric-card accent-purple">
          <span>Minhas equipes</span><strong>{{ teams.length }}</strong>
        </article>
        <article class="metric-card">
          <span>Perfil</span><strong class="metric-text">participante</strong>
        </article>
      </div>

      <article class="feature-card">
        <div>
          <span class="eyebrow">Portal do participante</span>
          <h2>Equipe, robôs e inscrições</h2>
          <p>Os dados exibidos respeitam o ownership definido no backend.</p>
        </div>
        <router-link to="/minha-equipe" class="link-button">Abrir minha equipe</router-link>
      </article>
    </template>
  </div>
</template>
