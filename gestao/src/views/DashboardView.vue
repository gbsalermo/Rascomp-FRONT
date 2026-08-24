<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { adminApi, participantApi } from '../api'
import { useAuthStore } from '../store'
import type { Competition, Registration, Team } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const auth = useAuthStore()
const loading = ref(true)
const competitions = ref<Competition[]>([])
const pending = ref<Registration[]>([])
const teams = ref<Team[]>([])

const activeCompetition = computed(
  () =>
    competitions.value.find((item) => item.status === 'EM_ANDAMENTO') ||
    competitions.value.find((item) => item.status === 'INSCRICOES_ABERTAS') ||
    competitions.value[0]
)

async function load() {
  loading.value = true
  try {
    if (auth.isOrganization) {
      const [all, pendingRegistrations] = await Promise.all([
        adminApi.competitions(),
        adminApi.registrations({ status: 'PENDENTE' })
      ])
      competitions.value = all
      pending.value = pendingRegistrations
    } else {
      teams.value = await participantApi.teams()
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-stack" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Central operacional</span>
        <h1>Olá, {{ auth.user?.nome?.split(' ')[0] }}.</h1>
        <p class="muted">
          {{ auth.isOrganization ? 'Acompanhe o estado real da competição.' : 'Gerencie sua equipe e acompanhe as inscrições.' }}
        </p>
      </div>
    </div>

    <template v-if="auth.isOrganization">
      <div class="metric-grid">
        <article class="metric-card accent-purple">
          <span>Competições cadastradas</span><strong>{{ competitions.length }}</strong>
        </article>
        <article class="metric-card accent-red">
          <span>Inscrições pendentes</span><strong>{{ pending.length }}</strong>
        </article>
        <article class="metric-card">
          <span>Camunda</span><strong class="metric-text">preparado</strong>
          <small>feature flag desligada</small>
        </article>
      </div>

      <article v-if="activeCompetition" class="feature-card">
        <div>
          <span class="eyebrow">Competição em foco</span>
          <h2>{{ activeCompetition.nome }}</h2>
          <p>{{ activeCompetition.descricao || 'Sem descrição.' }}</p>
          <div class="inline-meta">
            <StatusBadge :value="activeCompetition.status" />
            <span>{{ activeCompetition.dataInicio }} → {{ activeCompetition.dataFim }}</span>
          </div>
        </div>
        <router-link to="/competicoes" class="link-button">Abrir competição</router-link>
      </article>

      <article class="table-card">
        <div class="card-heading">
          <div><span class="eyebrow">Fila de análise</span><h2>Inscrições pendentes</h2></div>
          <router-link to="/inscricoes" class="text-link">Ver todas</router-link>
        </div>
        <el-table :data="pending.slice(0, 6)" empty-text="Nenhuma inscrição pendente">
          <el-table-column prop="teamNome" label="Equipe" />
          <el-table-column prop="robotNome" label="Robô" />
          <el-table-column prop="categoryNome" label="Categoria" />
          <el-table-column label="Status" width="150">
            <template #default="{ row }"><StatusBadge :value="row.status" /></template>
          </el-table-column>
        </el-table>
      </article>
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
          <p>O portal usa apenas os endpoints com ownership em <code>/api/v1/participante/**</code>.</p>
        </div>
        <router-link to="/minha-equipe" class="link-button">Abrir minha equipe</router-link>
      </article>
    </template>
  </div>
</template>
