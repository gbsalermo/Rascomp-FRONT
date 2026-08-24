<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import type { Competition } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const loading = ref(false)
const dialog = ref(false)
const rows = ref<Competition[]>([])
const editingId = ref<number | null>(null)
const emptyForm = (): Competition => ({
  nome: '',
  descricao: '',
  inicioInscricoes: '',
  fimInscricoes: '',
  dataInicio: '',
  dataFim: '',
  status: 'PLANEJADA',
  ativo: true
})
const form = reactive<Competition>(emptyForm())

async function load() {
  loading.value = true
  try {
    rows.value = await adminApi.competitions()
  } finally {
    loading.value = false
  }
}
function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  dialog.value = true
}
function openEdit(row: Competition) {
  Object.assign(form, JSON.parse(JSON.stringify(row)))
  editingId.value = row.id || null
  dialog.value = true
}
async function save() {
  if (!form.nome || !form.inicioInscricoes || !form.fimInscricoes || !form.dataInicio || !form.dataFim) {
    ElMessage.warning('Preencha os campos obrigatórios.')
    return
  }
  try {
    if (editingId.value) await adminApi.updateCompetition(editingId.value, form)
    else await adminApi.createCompetition(form)
    ElMessage.success('Competição salva.')
    dialog.value = false
    load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível salvar.')
  }
}
onMounted(load)
</script>

<template>
  <div class="page-stack">
    <div class="page-heading">
      <div><span class="eyebrow">Configuração</span><h1>Competições</h1><p class="muted">Calendário, inscrições e estado oficial.</p></div>
      <el-button class="brand-button" @click="openCreate">Nova competição</el-button>
    </div>

    <article class="table-card" v-loading="loading">
      <el-table :data="rows" empty-text="Nenhuma competição cadastrada">
        <el-table-column prop="nome" label="Competição" min-width="220" />
        <el-table-column prop="dataInicio" label="Início" width="120" />
        <el-table-column prop="dataFim" label="Fim" width="120" />
        <el-table-column label="Status" width="190">
          <template #default="{ row }"><StatusBadge :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="" width="100" align="right">
          <template #default="{ row }"><el-button text @click="openEdit(row)">Editar</el-button></template>
        </el-table-column>
      </el-table>
    </article>

    <el-dialog v-model="dialog" :title="editingId ? 'Editar competição' : 'Nova competição'" width="min(620px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Nome<el-input v-model="form.nome" /></label>
        <label class="span-2">Descrição<el-input v-model="form.descricao" type="textarea" :rows="3" /></label>
        <label>Início das inscrições<el-date-picker v-model="form.inicioInscricoes" value-format="YYYY-MM-DD" type="date" /></label>
        <label>Fim das inscrições<el-date-picker v-model="form.fimInscricoes" value-format="YYYY-MM-DD" type="date" /></label>
        <label>Data inicial<el-date-picker v-model="form.dataInicio" value-format="YYYY-MM-DD" type="date" /></label>
        <label>Data final<el-date-picker v-model="form.dataFim" value-format="YYYY-MM-DD" type="date" /></label>
        <label class="span-2">Status
          <el-select v-model="form.status" style="width:100%">
            <el-option v-for="status in ['PLANEJADA','INSCRICOES_ABERTAS','INSCRICOES_ENCERRADAS','EM_ANDAMENTO','FINALIZADA','CANCELADA']" :key="status" :label="status" :value="status" />
          </el-select>
        </label>
      </div>
      <template #footer><el-button @click="dialog=false">Cancelar</el-button><el-button class="brand-button" @click="save">Salvar</el-button></template>
    </el-dialog>
  </div>
</template>
