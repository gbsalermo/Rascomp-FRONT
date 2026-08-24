<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import type { Category, Competition, RankingItem, Registration } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const loading = ref(false)
const competitions = ref<Competition[]>([])
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])
const ranking = ref<RankingItem[]>([])
const competitionId = ref<number>()
const categoryId = ref<number>()
const dialog = ref(false)
const attempt = reactive({
  registrationId: undefined as number | undefined,
  tomada: 1,
  numeroTentativa: 1,
  tempoSegundos: 0,
  checkpointsAlcancados: 0,
  penalidadeSegundos: 0,
  concluida: true,
  valida: true,
  observacao: ''
})

const approved = computed(() =>
  registrations.value.filter((item) => item.status === 'APROVADA' && item.categoryId === categoryId.value)
)

async function initialize() {
  const [c, cats] = await Promise.all([adminApi.competitions(), adminApi.categories('FOLLOW_LINE')])
  competitions.value = c
  categories.value = cats
  const focus = c.find((item) => item.status === 'EM_ANDAMENTO') || c[0]
  competitionId.value = focus?.id
  categoryId.value = cats[0]?.id
  await loadContext()
}
async function loadContext() {
  if (!competitionId.value || !categoryId.value) return
  loading.value = true
  try {
    const [regs, rank] = await Promise.all([
      adminApi.registrations({ competitionId: competitionId.value }),
      adminApi.rankingFollow(competitionId.value, categoryId.value)
    ])
    registrations.value = regs
    ranking.value = rank
  } finally {
    loading.value = false
  }
}
async function saveAttempt() {
  if (!attempt.registrationId) return ElMessage.warning('Selecione a inscrição.')
  try {
    await adminApi.createFollowAttempt({ ...attempt })
    ElMessage.success('Tentativa registrada. Ranking atualizado pelo backend.')
    dialog.value = false
    await loadContext()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível registrar a tentativa.')
  }
}
watch([competitionId, categoryId], loadContext)
onMounted(initialize)
</script>

<template>
  <div class="page-stack">
    <div class="page-heading">
      <div><span class="eyebrow">Operação · Follow Line</span><h1>Seguidor de Linha</h1><p class="muted">Tentativas entram aqui; o ranking oficial continua sendo calculado no backend.</p></div>
      <el-button class="brand-button" @click="dialog=true">Registrar tentativa</el-button>
    </div>

    <article class="filter-bar">
      <el-select v-model="competitionId" placeholder="Competição" style="width:280px"><el-option v-for="item in competitions" :key="item.id" :label="item.nome" :value="item.id" /></el-select>
      <el-select v-model="categoryId" placeholder="Categoria" style="width:260px"><el-option v-for="item in categories" :key="item.id" :label="item.nome" :value="item.id" /></el-select>
      <el-button @click="loadContext">Atualizar</el-button>
    </article>

    <div class="operation-grid">
      <article class="table-card" v-loading="loading">
        <div class="card-heading"><div><span class="eyebrow">Classificação</span><h2>Ranking oficial</h2></div></div>
        <el-table :data="ranking" empty-text="Ranking ainda não disponível">
          <el-table-column type="index" label="#" width="55" />
          <el-table-column prop="robotNome" label="Robô" min-width="150" />
          <el-table-column prop="teamNome" label="Equipe" min-width="140" />
          <el-table-column prop="tempoFinal" label="Tempo final" width="130">
            <template #default="{ row }">{{ row.tempoFinal != null ? `${row.tempoFinal}s` : '—' }}</template>
          </el-table-column>
        </el-table>
      </article>
      <article class="side-note">
        <span class="eyebrow">Regra estrutural</span>
        <h3>Follow não usa chave.</h3>
        <p>O fluxo é inscrição aprovada → tentativa → melhor tempo válido → ranking.</p>
        <span class="integration-chip live">backend = fonte de verdade</span>
      </article>
    </div>

    <el-dialog v-model="dialog" title="Registrar tentativa" width="min(580px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Inscrição
          <el-select v-model="attempt.registrationId" style="width:100%" filterable>
            <el-option v-for="item in approved" :key="item.id" :label="`${item.robotNome} · ${item.teamNome}`" :value="item.id" />
          </el-select>
        </label>
        <label>Tomada<el-input-number v-model="attempt.tomada" :min="1" /></label>
        <label>Tentativa<el-input-number v-model="attempt.numeroTentativa" :min="1" /></label>
        <label>Tempo (s)<el-input-number v-model="attempt.tempoSegundos" :min="0" :precision="3" /></label>
        <label>Checkpoints<el-input-number v-model="attempt.checkpointsAlcancados" :min="0" /></label>
        <label>Penalidade (s)<el-input-number v-model="attempt.penalidadeSegundos" :min="0" /></label>
        <label><el-checkbox v-model="attempt.concluida">Concluída</el-checkbox></label>
        <label><el-checkbox v-model="attempt.valida">Válida</el-checkbox></label>
        <label class="span-2">Observação<el-input v-model="attempt.observacao" type="textarea" /></label>
      </div>
      <template #footer><el-button @click="dialog=false">Cancelar</el-button><el-button class="brand-button" @click="saveAttempt">Registrar</el-button></template>
    </el-dialog>
  </div>
</template>
