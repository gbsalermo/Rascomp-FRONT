<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { participantApi } from '../api'
import type { Competitor, Registration, Robot, Team } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const loading = ref(false)
const creatingTeam = ref(false)
const teamDialog = ref(false)
const teams = ref<Team[]>([])
const teamId = ref<number>()
const competitors = ref<Competitor[]>([])
const robots = ref<Robot[]>([])
const registrations = ref<Registration[]>([])
const institutions = ref<Array<{ id: number; nome: string; sigla?: string }>>([])
const teamForm = reactive({ nome: '', institutionId: undefined as number | undefined })

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

watch(teamId, loadTeam)
onMounted(loadTeams)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Portal do participante</span>
        <h1>Minha equipe</h1>
        <p class="muted">Crie sua equipe e acompanhe as inscrições vinculadas ao seu usuário.</p>
      </div>
      <div class="heading-actions">
        <el-select v-if="teams.length > 1" v-model="teamId" style="width:260px">
          <el-option v-for="team in teams" :key="team.id" :label="team.nome" :value="team.id" />
        </el-select>
        <el-button v-if="!teams.length" type="primary" class="brand-button" @click="teamDialog = true">
          Criar equipe
        </el-button>
      </div>
    </div>

    <article v-if="!teams.length && !loading" class="participant-first-access-card">
      <span class="eyebrow">Primeiro acesso</span>
      <h2>Comece criando sua equipe</h2>
      <p>
        Sua conta já existe de forma independente. Ao criar uma equipe, você passa a ser o líder/responsável por ela.
      </p>
      <div class="participant-first-access-flow">
        <span><strong>1</strong> Conta criada</span>
        <span><strong>2</strong> Criar equipe</span>
        <span><strong>3</strong> Adicionar membros</span>
        <span><strong>4</strong> Fazer inscrição</span>
      </div>
      <el-button type="primary" class="brand-button" @click="teamDialog = true">
        Criar minha equipe
      </el-button>
      <small>
        O vínculo de outros usuários à equipe será habilitado após a evolução pós-Swagger do backend.
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
        <strong>Fluxo que será evoluído</strong>
        <p>
          A conta continuará independente. O líder poderá anexar outros usuários à equipe e, na inscrição, escolher o robô e quais membros efetivamente competirão com ele.
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
  </div>
</template>
