<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { http, participantApi } from '../api'
import type { Competitor, Registration, Robot, Team } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

interface PublicTeamOption {
  id: number
  nome: string
  institutionId: number
  institutionNome: string
  institutionSigla?: string
}

const loading = ref(false)
const creatingTeam = ref(false)
const loadingAvailableTeams = ref(false)
const teamDialog = ref(false)
const joinDialog = ref(false)
const teams = ref<Team[]>([])
const teamId = ref<number>()
const competitors = ref<Competitor[]>([])
const robots = ref<Robot[]>([])
const registrations = ref<Registration[]>([])
const institutions = ref<Array<{ id: number; nome: string; sigla?: string }>>([])
const availableTeams = ref<PublicTeamOption[]>([])
const teamSearch = ref('')
const selectedJoinTeamId = ref<number>()
const teamForm = reactive({ nome: '', institutionId: undefined as number | undefined })

const filteredAvailableTeams = computed(() => {
  const query = teamSearch.value.trim().toLocaleLowerCase('pt-BR')
  if (!query) return availableTeams.value
  return availableTeams.value.filter((team) => {
    const haystack = `${team.nome} ${team.institutionNome} ${team.institutionSigla || ''}`.toLocaleLowerCase('pt-BR')
    return haystack.includes(query)
  })
})

async function loadTeams() {
  loading.value = true
  try {
    const [teamRows, institutionRows] = await Promise.all([
      participantApi.teams(),
      participantApi.institutions()
    ])
    teams.value = teamRows
    institutions.value = institutionRows
    teamId.value = teams.value[0]?.id
    await loadTeam()
  } finally {
    loading.value = false
  }
}

async function loadTeam() {
  competitors.value = []
  robots.value = []
  registrations.value = []
  if (!teamId.value) return
  ;[competitors.value, robots.value, registrations.value] = await Promise.all([
    participantApi.competitors(teamId.value),
    participantApi.robots(teamId.value),
    participantApi.registrations(teamId.value)
  ])
}

async function createTeam() {
  if (!teamForm.nome.trim() || !teamForm.institutionId) {
    ElMessage.warning('Informe o nome da equipe e a instituição.')
    return
  }

  creatingTeam.value = true
  try {
    await participantApi.createTeam({
      nome: teamForm.nome.trim(),
      institutionId: teamForm.institutionId
    })
    ElMessage.success('Equipe criada. Você é o responsável por ela.')
    teamDialog.value = false
    teamForm.nome = ''
    teamForm.institutionId = undefined
    await loadTeams()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível criar a equipe.')
  } finally {
    creatingTeam.value = false
  }
}

async function openJoinDialog() {
  joinDialog.value = true
  teamSearch.value = ''
  selectedJoinTeamId.value = undefined

  if (availableTeams.value.length) return

  loadingAvailableTeams.value = true
  try {
    availableTeams.value = await http
      .get<PublicTeamOption[]>('/api/v1/public/equipes')
      .then((response) => response.data)
  } catch {
    ElMessage.error('Não foi possível carregar as equipes disponíveis.')
  } finally {
    loadingAvailableTeams.value = false
  }
}

function requestJoin() {
  const selectedTeam = availableTeams.value.find((team) => team.id === selectedJoinTeamId.value)
  if (!selectedTeam) {
    ElMessage.warning('Selecione uma equipe para solicitar entrada.')
    return
  }

  ElMessage.info(
    `A solicitação para ${selectedTeam.nome} ficará funcional após a etapa pós-Swagger do backend.`
  )
}

watch(teamId, loadTeam)
onMounted(loadTeams)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Portal do participante</span>
        <h1>Minha equipe</h1>
        <p class="muted">Crie sua equipe ou solicite entrada em uma equipe existente.</p>
      </div>
      <div class="heading-actions">
        <el-select v-if="teams.length > 1" v-model="teamId" style="width:260px">
          <el-option v-for="team in teams" :key="team.id" :label="team.nome" :value="team.id" />
        </el-select>
        <template v-if="!teams.length">
          <el-button @click="openJoinDialog">Já tenho equipe</el-button>
          <el-button type="primary" class="brand-button" @click="teamDialog = true">
            Criar equipe
          </el-button>
        </template>
      </div>
    </div>

    <article v-if="!teams.length && !loading" class="participant-first-access-card">
      <span class="eyebrow">Primeiro acesso</span>
      <h2>Como você participa?</h2>
      <p>
        Sua conta é independente. Você pode criar uma nova equipe e se tornar líder, ou procurar uma equipe existente e solicitar entrada.
      </p>

      <div class="participant-onboarding-choices">
        <section class="participant-choice-card featured">
          <span class="participant-choice-kicker">Ainda não tenho equipe</span>
          <h3>Criar uma equipe</h3>
          <p>Cadastre nome e instituição. Você será o líder/responsável pela equipe.</p>
          <el-button type="primary" class="brand-button" @click="teamDialog = true">
            Criar minha equipe
          </el-button>
        </section>

        <section class="participant-choice-card">
          <span class="participant-choice-kicker">Já faço parte de uma</span>
          <h3>Encontrar minha equipe</h3>
          <p>Pesquise pelo nome, escolha a equipe e solicite sua adesão ao líder.</p>
          <el-button @click="openJoinDialog">Já tenho equipe</el-button>
        </section>
      </div>

      <div class="participant-first-access-flow">
        <span><strong>1</strong> Conta criada</span>
        <span><strong>2</strong> Criar ou localizar equipe</span>
        <span><strong>3</strong> Líder aprova membros</span>
        <span><strong>4</strong> Fazer inscrição</span>
      </div>

      <small>
        A busca de equipes já usa os dados públicos do sistema. A solicitação e a aprovação pelo líder serão habilitadas na evolução pós-Swagger do backend.
      </small>
    </article>

    <template v-else>
      <div class="metric-grid">
        <article class="metric-card accent-purple"><span>Competidores</span><strong>{{ competitors.length }}</strong></article>
        <article class="metric-card accent-red"><span>Robôs</span><strong>{{ robots.length }}</strong></article>
        <article class="metric-card"><span>Inscrições</span><strong>{{ registrations.length }}</strong></article>
      </div>

      <article class="table-card">
        <div class="card-heading"><div><span class="eyebrow">Inscrições</span><h2>Acompanhamento</h2></div></div>
        <el-table :data="registrations" empty-text="Nenhuma inscrição">
          <el-table-column prop="competitionNome" label="Competição" min-width="180" />
          <el-table-column prop="categoryNome" label="Categoria" />
          <el-table-column prop="robotNome" label="Robô" />
          <el-table-column label="Status" width="150"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
        </el-table>
      </article>

      <div class="two-column">
        <article class="table-card">
          <div class="card-heading"><div><span class="eyebrow">Equipe</span><h2>Competidores</h2></div></div>
          <el-table :data="competitors" empty-text="Nenhum competidor"><el-table-column prop="nome" label="Nome" /><el-table-column prop="email" label="E-mail" /></el-table>
        </article>
        <article class="table-card">
          <div class="card-heading"><div><span class="eyebrow">Equipe</span><h2>Robôs</h2></div></div>
          <el-table :data="robots" empty-text="Nenhum robô"><el-table-column prop="nome" label="Nome" /><el-table-column prop="descricao" label="Descrição" /></el-table>
        </article>
      </div>

      <div class="callout">
        <strong>Fluxo competitivo planejado</strong>
        <p>
          Na inscrição de cada robô, a equipe escolherá um competidor responsável e poderá adicionar competidores de suporte. Esses papéis pertencem à inscrição do robô, não ao usuário permanentemente.
        </p>
      </div>
    </template>

    <el-dialog v-model="teamDialog" title="Criar equipe" width="min(520px, 92vw)">
      <div class="form-grid">
        <label class="span-2">
          Nome da equipe
          <el-input v-model="teamForm.nome" maxlength="120" placeholder="Ex.: Team Vespa" />
        </label>
        <label class="span-2">
          Instituição
          <el-select v-model="teamForm.institutionId" filterable placeholder="Selecione a instituição" style="width:100%">
            <el-option
              v-for="institution in institutions"
              :key="institution.id"
              :label="institution.sigla ? `${institution.sigla} — ${institution.nome}` : institution.nome"
              :value="institution.id"
            />
          </el-select>
        </label>
      </div>
      <template #footer>
        <el-button @click="teamDialog = false">Cancelar</el-button>
        <el-button type="primary" class="brand-button" :loading="creatingTeam" @click="createTeam">
          Criar equipe
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="joinDialog" title="Encontrar minha equipe" width="min(620px, 94vw)">
      <div class="join-team-dialog" v-loading="loadingAvailableTeams">
        <p class="muted">
          Procure pelo nome da equipe ou instituição. Depois de solicitar, o líder deverá aprovar sua entrada.
        </p>

        <el-input
          v-model="teamSearch"
          clearable
          placeholder="Digite o nome da equipe..."
        />

        <div class="join-team-results">
          <button
            v-for="team in filteredAvailableTeams"
            :key="team.id"
            type="button"
            class="join-team-option"
            :class="{ selected: selectedJoinTeamId === team.id }"
            @click="selectedJoinTeamId = team.id"
          >
            <span>
              <strong>{{ team.nome }}</strong>
              <small>
                {{ team.institutionSigla ? `${team.institutionSigla} — ` : '' }}{{ team.institutionNome }}
              </small>
            </span>
            <b>{{ selectedJoinTeamId === team.id ? 'Selecionada' : 'Escolher' }}</b>
          </button>

          <el-empty
            v-if="!loadingAvailableTeams && !filteredAvailableTeams.length"
            description="Nenhuma equipe encontrada"
            :image-size="72"
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="joinDialog = false">Cancelar</el-button>
        <el-button type="primary" class="brand-button" @click="requestJoin">
          Solicitar entrada
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>