<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'
import { useCompetitionStore } from '../store'
import type { Category, Competition, Registration } from '../types'
import StatusBadge from '../components/StatusBadge.vue'

const competition = useCompetitionStore()
const loading = ref(false)
const focusLoading = ref(false)
const dialog = ref(false)
const editionsOpen = ref(false)
const registrations = ref<Registration[]>([])
const categoryCatalog = ref<Category[]>([])
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
const activeCompetition = computed(() => competition.selectedCompetition)
const approvedRegistrations = computed(() =>
  registrations.value.filter((item) => item.status === 'APROVADA')
)
const pendingRegistrations = computed(() =>
  registrations.value.filter((item) => item.status === 'PENDENTE')
)
const teamsCount = computed(() => new Set(registrations.value.map((item) => item.teamId)).size)
const robotsCount = computed(() => new Set(registrations.value.map((item) => item.robotId)).size)
const competitorsCount = computed(() => {
  const ids = registrations.value.flatMap((item) => item.competitorIds || [])
  return new Set(ids).size
})

const categorySummaries = computed(() => {
  const catalog = new Map(categoryCatalog.value.map((item) => [item.id, item]))
  const grouped = new Map<
    number,
    {
      id: number
      nome: string
      modalidade: string
      total: number
      aprovadas: number
      pendentes: number
    }
  >()

  for (const registration of registrations.value) {
    const category = catalog.get(registration.categoryId)
    const current = grouped.get(registration.categoryId) || {
      id: registration.categoryId,
      nome: registration.categoryNome,
      modalidade: category?.modalidade || '',
      total: 0,
      aprovadas: 0,
      pendentes: 0
    }

    current.total += 1
    if (registration.status === 'APROVADA') current.aprovadas += 1
    if (registration.status === 'PENDENTE') current.pendentes += 1
    grouped.set(registration.categoryId, current)
  }

  return [...grouped.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
})

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function modalityLabel(value: string) {
  if (value === 'FOLLOW_LINE') return 'Follow Line'
  if (value === 'SUMO') return 'Sumô'
  return 'Categoria'
}

async function loadFocus() {
  const competitionId = competition.selectedId
  if (!competitionId) {
    registrations.value = []
    return
  }

  focusLoading.value = true
  try {
    registrations.value = await adminApi.registrations({ competitionId })
  } catch (error: any) {
    registrations.value = []
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os dados da edição.')
  } finally {
    focusLoading.value = false
  }
}

async function load() {
  loading.value = true
  try {
    await competition.load(true)
    categoryCatalog.value = await adminApi.categories()
    await loadFocus()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar as competições.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  editionsOpen.value = false
  dialog.value = true
}

function openEdit(row?: Competition) {
  const target = row || activeCompetition.value
  if (!target) return
  Object.assign(form, JSON.parse(JSON.stringify(target)))
  editingId.value = target.id || null
  editionsOpen.value = false
  dialog.value = true
}

function selectEdition(row: Competition) {
  if (!row.id) return
  competition.select(row.id)
  editionsOpen.value = false
}

async function save() {
  if (!form.nome || !form.inicioInscricoes || !form.fimInscricoes || !form.dataInicio || !form.dataFim) {
    ElMessage.warning('Preencha os campos obrigatórios.')
    return
  }

  if (form.inicioInscricoes > form.fimInscricoes) {
    ElMessage.warning('O fim das inscrições deve ocorrer após o início das inscrições.')
    return
  }

  if (form.dataInicio > form.dataFim) {
    ElMessage.warning('A data final do evento deve ocorrer após a data inicial.')
    return
  }

  try {
    if (editingId.value) {
      await adminApi.updateCompetition(editingId.value, { ...form })
      ElMessage.success('Competição atualizada.')
    } else {
      const created = await adminApi.createCompetition({ ...form })
      if (created.id) competition.select(created.id)
      ElMessage.success('Nova edição criada.')
    }

    dialog.value = false
    await competition.load(true)
    await loadFocus()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível salvar.')
  }
}

watch(() => competition.selectedId, loadFocus)
onMounted(load)
</script>

<template>
  <div class="page-stack competition-hub" v-loading="loading">
    <div class="page-heading competition-hub-heading">
      <div>
        <span class="eyebrow">Gestão da edição</span>
        <h1>Competição</h1>
        <p class="muted">Centralize a operação da edição atualmente selecionada.</p>
      </div>
      <div class="heading-actions">
        <el-button @click="editionsOpen = true">Gerenciar / trocar edições</el-button>
        <el-button v-if="activeCompetition" class="brand-button" @click="openEdit()">Editar competição</el-button>
        <el-button v-else class="brand-button" @click="openCreate">Nova competição</el-button>
      </div>
    </div>

    <template v-if="activeCompetition">
      <article class="competition-hub-hero admin-focus-strip" v-loading="focusLoading">
        <div class="competition-hub-identity">
          <div>
            <span class="eyebrow">Competição em foco</span>
            <h2>{{ activeCompetition.nome }}</h2>
            <p>{{ activeCompetition.descricao || 'Sem descrição cadastrada para esta edição.' }}</p>
          </div>
          <StatusBadge :value="activeCompetition.status || 'PLANEJADA'" />
        </div>

        <div class="competition-hub-periods">
          <div>
            <small>Período do evento</small>
            <strong>{{ formatDate(activeCompetition.dataInicio) }} — {{ formatDate(activeCompetition.dataFim) }}</strong>
          </div>
          <div>
            <small>Período de inscrições</small>
            <strong>{{ formatDate(activeCompetition.inicioInscricoes) }} — {{ formatDate(activeCompetition.fimInscricoes) }}</strong>
          </div>
          <div>
            <small>Situação cadastral</small>
            <strong>{{ activeCompetition.ativo === false ? 'Inativa' : 'Ativa' }}</strong>
          </div>
        </div>
      </article>

      <section class="competition-hub-metrics" v-loading="focusLoading">
        <article>
          <small>Inscrições</small>
          <strong>{{ registrations.length }}</strong>
          <span>{{ approvedRegistrations.length }} aprovada(s)</span>
        </article>
        <article>
          <small>Pendências</small>
          <strong>{{ pendingRegistrations.length }}</strong>
          <span>aguardando análise</span>
        </article>
        <article>
          <small>Equipes</small>
          <strong>{{ teamsCount }}</strong>
          <span>{{ robotsCount }} robô(s)</span>
        </article>
        <article>
          <small>Competidores</small>
          <strong>{{ competitorsCount }}</strong>
          <span>{{ categorySummaries.length }} categoria(s) em uso</span>
        </article>
      </section>

      <section class="competition-hub-grid">
        <article class="competition-hub-card" v-loading="focusLoading">
          <div class="card-heading competition-hub-card-heading">
            <div>
              <span class="eyebrow">Categorias da edição</span>
              <h2>Participação por categoria</h2>
            </div>
            <router-link to="/modalidades" class="text-link">Gerenciar catálogo →</router-link>
          </div>

          <div v-if="categorySummaries.length" class="competition-category-list">
            <article v-for="item in categorySummaries" :key="item.id" class="competition-category-row">
              <div>
                <strong>{{ item.nome }}</strong>
                <small>{{ modalityLabel(item.modalidade) }}</small>
              </div>
              <div class="competition-category-counts">
                <span><b>{{ item.total }}</b> inscrições</span>
                <span><b>{{ item.aprovadas }}</b> aprovadas</span>
                <span v-if="item.pendentes"><b>{{ item.pendentes }}</b> pendentes</span>
              </div>
            </article>
          </div>

          <div v-else class="competition-hub-empty">
            <strong>Nenhuma categoria aparece nesta edição ainda.</strong>
            <span>As categorias entram neste resumo quando houver inscrições vinculadas à competição.</span>
          </div>
        </article>

        <article class="competition-hub-card competition-actions-card">
          <div class="card-heading competition-hub-card-heading">
            <div>
              <span class="eyebrow">Operação</span>
              <h2>Ações da edição</h2>
            </div>
          </div>

          <div class="competition-action-list">
            <router-link to="/inscricoes">
              <div><strong>Ver inscrições</strong><small>Analisar participantes e status</small></div><b>→</b>
            </router-link>
            <router-link to="/modalidades">
              <div><strong>Gerenciar categorias</strong><small>Consultar modalidades e categorias</small></div><b>→</b>
            </router-link>
            <router-link to="/chaves">
              <div><strong>Histórico de chaves</strong><small>Consultar chaveamentos da edição</small></div><b>→</b>
            </router-link>
            <router-link to="/resultados">
              <div><strong>Resultados</strong><small>Acompanhar resultados oficiais</small></div><b>→</b>
            </router-link>
          </div>
        </article>
      </section>
    </template>

    <article v-else class="empty-state-card competition-hub-no-edition">
      <span class="eyebrow">Primeira edição</span>
      <h2>Nenhuma competição cadastrada</h2>
      <p class="muted">Crie a primeira edição do RRC para iniciar inscrições e operação competitiva.</p>
      <el-button class="brand-button" @click="openCreate">Criar competição</el-button>
    </article>

    <el-drawer v-model="editionsOpen" title="Gerenciar edições" size="min(760px, 96vw)" class="competition-editions-drawer">
      <div class="competition-editions-toolbar">
        <div>
          <span class="eyebrow">Histórico e contexto</span>
          <p>Selecione qual edição será usada como competição em foco no painel.</p>
        </div>
        <el-button class="brand-button" @click="openCreate">Nova edição</el-button>
      </div>

      <el-table :data="competition.competitions" empty-text="Nenhuma competição cadastrada">
        <el-table-column prop="nome" label="Edição" min-width="190" />
        <el-table-column label="Evento" min-width="180">
          <template #default="{ row }">{{ formatDate(row.dataInicio) }}</template>
        </el-table-column>
        <el-table-column label="Status" width="165">
          <template #default="{ row }"><StatusBadge :value="row.status || 'PLANEJADA'" /></template>
        </el-table-column>
        <el-table-column label="Ações" width="180" align="right">
          <template #default="{ row }">
            <el-button v-if="row.id !== competition.selectedId" text @click="selectEdition(row)">Usar como foco</el-button>
            <span v-else class="competition-current-label">Em foco</span>
            <el-button text @click="openEdit(row)">Editar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-dialog v-model="dialog" :title="editingId ? 'Editar competição' : 'Nova competição'" width="min(620px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Nome<el-input v-model="form.nome" /></label>
        <label class="span-2">Descrição<el-input v-model="form.descricao" type="textarea" :rows="3" maxlength="500" show-word-limit /></label>
        <label>Início das inscrições<el-date-picker v-model="form.inicioInscricoes" value-format="YYYY-MM-DD" type="date" /></label>
        <label>Fim das inscrições<el-date-picker v-model="form.fimInscricoes" value-format="YYYY-MM-DD" type="date" /></label>
        <label>Data inicial<el-date-picker v-model="form.dataInicio" value-format="YYYY-MM-DD" type="date" /></label>
        <label>Data final<el-date-picker v-model="form.dataFim" value-format="YYYY-MM-DD" type="date" /></label>
        <label class="span-2">Status
          <el-select v-model="form.status" style="width:100%">
            <el-option label="Planejada" value="PLANEJADA" />
            <el-option label="Inscrições abertas" value="INSCRICOES_ABERTAS" />
            <el-option label="Inscrições encerradas" value="INSCRICOES_ENCERRADAS" />
            <el-option label="Em andamento" value="EM_ANDAMENTO" />
            <el-option label="Finalizada" value="FINALIZADA" />
            <el-option label="Cancelada" value="CANCELADA" />
          </el-select>
        </label>
      </div>
      <template #footer>
        <el-button @click="dialog = false">Cancelar</el-button>
        <el-button class="brand-button" @click="save">Salvar</el-button>
      </template>
    </el-dialog>
  </div>
</template>
