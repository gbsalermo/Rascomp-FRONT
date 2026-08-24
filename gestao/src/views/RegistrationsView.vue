<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi, camundaApi } from '../api'
import type { Competition, Registration, RegistrationStatus } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const loading = ref(false)
const competitions = ref<Competition[]>([])
const rows = ref<Registration[]>([])
const competitionId = ref<number>()
const status = ref<string>('PENDENTE')

const filtered = computed(() => rows.value.filter((item) => !status.value || item.status === status.value))

async function loadBase() {
  competitions.value = await adminApi.competitions()
  const focus =
    competitions.value.find((c) => c.status === 'EM_ANDAMENTO') ||
    competitions.value.find((c) => c.status === 'INSCRICOES_ABERTAS') ||
    competitions.value[0]
  competitionId.value = focus?.id
  await load()
}
async function load() {
  loading.value = true
  try {
    rows.value = competitionId.value
      ? await adminApi.registrations({ competitionId: competitionId.value })
      : await adminApi.registrations()
  } finally {
    loading.value = false
  }
}
async function review(row: Registration, next: RegistrationStatus) {
  if (camundaApi.enabled) {
    ElMessage.info('Com Camunda ativo, a decisão será feita pela tarefa do processo.')
    return
  }
  const label = next === 'APROVADA' ? 'aprovar' : 'rejeitar'
  try {
    await ElMessageBox.confirm(`Deseja ${label} a inscrição de ${row.teamNome}?`, 'Confirmar análise', {
      type: next === 'APROVADA' ? 'success' : 'warning'
    })
    await adminApi.updateRegistration(row.id, { ...row, status: next })
    ElMessage.success(`Inscrição ${next.toLowerCase()}.`)
    load()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar a inscrição.')
  }
}
onMounted(loadBase)
</script>

<template>
  <div class="page-stack">
    <div class="page-heading">
      <div><span class="eyebrow">Entrada da competição</span><h1>Inscrições</h1><p class="muted">Aprovação manual enquanto o BPMN do Camunda não estiver ativo.</p></div>
      <span class="integration-chip" :class="{ live: camundaApi.enabled }">{{ camundaApi.enabled ? 'Camunda ativo' : 'Camunda aguardando' }}</span>
    </div>

    <article class="filter-bar">
      <el-select v-model="competitionId" placeholder="Competição" style="width:280px" @change="load">
        <el-option v-for="item in competitions" :key="item.id" :label="item.nome" :value="item.id" />
      </el-select>
      <el-select v-model="status" placeholder="Status" clearable style="width:220px">
        <el-option v-for="item in ['PENDENTE','APROVADA','REJEITADA','CANCELADA','DESCLASSIFICADA']" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button @click="load">Atualizar</el-button>
    </article>

    <article class="table-card" v-loading="loading">
      <el-table :data="filtered" empty-text="Nenhuma inscrição neste filtro">
        <el-table-column prop="teamNome" label="Equipe" min-width="150" />
        <el-table-column prop="robotNome" label="Robô" min-width="150" />
        <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
        <el-table-column prop="requestedByUserNome" label="Solicitado por" min-width="160" />
        <el-table-column label="Status" width="150"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
        <el-table-column label="Ações" width="210" fixed="right">
          <template #default="{ row }">
            <div v-if="row.status === 'PENDENTE'" class="table-actions">
              <el-button size="small" type="success" plain @click="review(row,'APROVADA')">Aprovar</el-button>
              <el-button size="small" type="danger" plain @click="review(row,'REJEITADA')">Rejeitar</el-button>
            </div>
            <span v-else class="muted small">analisada</span>
          </template>
        </el-table-column>
      </el-table>
    </article>
  </div>
</template>
