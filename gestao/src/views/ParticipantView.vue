<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { participantApi } from '../api'
import type { Competitor, Registration, Robot, Team } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const loading = ref(false)
const teams = ref<Team[]>([])
const teamId = ref<number>()
const competitors = ref<Competitor[]>([])
const robots = ref<Robot[]>([])
const registrations = ref<Registration[]>([])

async function loadTeams() {
  loading.value = true
  try {
    teams.value = await participantApi.teams()
    teamId.value = teams.value[0]?.id
    await loadTeam()
  } finally {
    loading.value = false
  }
}
async function loadTeam() {
  if (!teamId.value) return
  ;[competitors.value, robots.value, registrations.value] = await Promise.all([
    participantApi.competitors(teamId.value),
    participantApi.robots(teamId.value),
    participantApi.registrations(teamId.value)
  ])
}
watch(teamId, loadTeam)
onMounted(loadTeams)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div><span class="eyebrow">Portal do participante</span><h1>Minha equipe</h1><p class="muted">Tudo abaixo respeita ownership do usuário autenticado.</p></div>
      <el-select v-if="teams.length > 1" v-model="teamId" style="width:260px"><el-option v-for="team in teams" :key="team.id" :label="team.nome" :value="team.id" /></el-select>
    </div>

    <el-empty v-if="!teams.length && !loading" description="Você ainda não possui equipe cadastrada." />

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
        <strong>Próximo incremento do portal</strong>
        <p>Os endpoints já suportam criar/editar equipe, competidores, robôs, fotos e inscrições; o MVP visual começa pela leitura segura e será expandido sem mudar a arquitetura.</p>
      </div>
    </template>
  </div>
</template>
