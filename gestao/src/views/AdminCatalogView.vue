<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi, assetUrl } from '../api'
import { useAuthStore, useCompetitionStore } from '../store'
import type { Category, Registration, Robot, RobotImage, Team } from '../types'

type CatalogScope = 'COMPETITION' | 'ALL'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const competition = useCompetitionStore()

const loading = ref(false)
const changingIds = ref<number[]>([])
const scope = ref<CatalogScope>('COMPETITION')
const search = ref('')
const teams = ref<Team[]>([])
const robots = ref<Robot[]>([])
const categories = ref<Category[]>([])
const registrations = ref<Registration[]>([])

const photoDrawerOpen = ref(false)
const photosLoading = ref(false)
const selectedRobot = ref<Robot>()
const robotPhotos = ref<RobotImage[]>([])

const mode = computed(() => {
  if (route.path === '/equipes') return 'teams'
  if (route.path === '/robos') return 'robots'
  return 'categories'
})

const effectiveScope = computed<CatalogScope>(() => auth.isDev ? scope.value : 'COMPETITION')
const contextLabel = computed(() => auth.isDev ? 'Competição em foco' : 'Competição vigente')
const title = computed(() => ({ teams: 'Equipes', robots: 'Robôs', categories: 'Modalidades' })[mode.value])
const subtitle = computed(() => ({
  teams: 'Equipes relacionadas à edição selecionada e seus responsáveis.',
  robots: 'Robôs relacionados à edição selecionada, equipes e fotos cadastradas.',
  categories: 'Categorias em uso na edição selecionada ou catálogo global para DEV.'
})[mode.value])

const usedCategoryIds = computed(() => new Set(registrations.value.map((item) => item.categoryId)))
const filteredCategories = computed(() =>
  effectiveScope.value === 'ALL'
    ? categories.value
    : categories.value.filter((item) => usedCategoryIds.value.has(item.id))
)

const visibleTeams = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  if (!term) return teams.value
  return teams.value.filter((item) =>
    [item.nome, item.institutionNome || '', item.responsibleUserNome || '', item.responsibleUserEmail || '']
      .some((value) => value.toLocaleLowerCase('pt-BR').includes(term))
  )
})

const visibleRobots = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  if (!term) return robots.value
  return robots.value.filter((item) =>
    [item.nome, item.teamNome || '', item.descricao || '']
      .some((value) => value.toLocaleLowerCase('pt-BR').includes(term))
  )
})

const visibleCategories = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  if (!term) return filteredCategories.value
  return filteredCategories.value.filter((item) =>
    [item.nome, item.modalidade, item.sumoPhysicalClass || '', item.sumoControlMode || '']
      .some((value) => value.toLocaleLowerCase('pt-BR').includes(term))
  )
})

function isChanging(id: number) {
  return changingIds.value.includes(id)
}

function markChanging(id: number, changing: boolean) {
  if (changing) {
    if (!changingIds.value.includes(id)) changingIds.value.push(id)
    return
  }
  changingIds.value = changingIds.value.filter((item) => item !== id)
}

function physicalClassLabel(row: Category) {
  if (row.modalidade !== 'SUMO') return '—'
  if (row.sumoPhysicalClass === 'MINI_500G') return 'Mini 500 g'
  if (row.sumoPhysicalClass === 'SUMO_3KG') return 'Sumô 3 kg'
  return 'Não configurada'
}

function controlModeLabel(row: Category) {
  if (row.modalidade !== 'SUMO') return '—'
  if (row.sumoControlMode === 'AUTONOMO') return 'Autônomo'
  if (row.sumoControlMode === 'RC') return 'R/C'
  return 'Não configurado'
}

function teamRegistrationCount(teamId: number) {
  return registrations.value.filter((item) => item.teamId === teamId).length
}

function robotRegistrationCount(robotId: number) {
  return registrations.value.filter((item) => item.robotId === robotId).length
}

function categoryRegistrationCount(categoryId: number) {
  return registrations.value.filter((item) => item.categoryId === categoryId).length
}

async function load() {
  loading.value = true
  try {
    await competition.load()

    const competitionId = competition.selectedId
    const competitionRows = competitionId
      ? await adminApi.registrations({ competitionId })
      : []
    registrations.value = competitionRows

    if (mode.value === 'categories') {
      categories.value = await adminApi.categories()
      teams.value = []
      robots.value = []
      return
    }

    if (effectiveScope.value === 'ALL' && auth.isDev) {
      if (mode.value === 'teams') teams.value = await adminApi.teams()
      if (mode.value === 'robots') robots.value = await adminApi.robots()
      return
    }

    if (!competitionId) {
      teams.value = []
      robots.value = []
      return
    }

    const catalog = await adminApi.competitionAdminCatalog(competitionId)
    teams.value = catalog.teams
    robots.value = catalog.robots
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os dados.')
  } finally {
    loading.value = false
  }
}

async function toggleTeam(row: Team) {
  if (!auth.isDev) return
  const activate = row.ativo === false
  if (!activate) {
    try {
      await ElMessageBox.confirm(
        `Desativar a equipe ${row.nome}? Ela deixa de aparecer nos fluxos ativos, mas o histórico é preservado.`,
        'Desativar equipe',
        { confirmButtonText: 'Desativar', cancelButtonText: 'Cancelar', type: 'warning' }
      )
    } catch {
      return
    }
  }

  markChanging(row.id, true)
  try {
    await adminApi.setTeamActive(row.id, activate)
    row.ativo = activate
    ElMessage.success(activate ? 'Equipe reativada.' : 'Equipe desativada.')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível alterar a situação da equipe.')
  } finally {
    markChanging(row.id, false)
  }
}

async function toggleRobot(row: Robot) {
  if (!auth.isDev) return
  const activate = row.ativo === false
  if (!activate) {
    try {
      await ElMessageBox.confirm(
        `Desativar o robô ${row.nome}? O histórico competitivo será preservado.`,
        'Desativar robô',
        { confirmButtonText: 'Desativar', cancelButtonText: 'Cancelar', type: 'warning' }
      )
    } catch {
      return
    }
  }

  markChanging(row.id, true)
  try {
    await adminApi.setRobotActive(row.id, activate)
    row.ativo = activate
    ElMessage.success(activate ? 'Robô reativado.' : 'Robô desativado.')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível alterar a situação do robô.')
  } finally {
    markChanging(row.id, false)
  }
}

function openCompetitors(row: Team) {
  router.push({ path: '/competidores', query: { teamId: row.id } })
}

async function openPhotos(row: Robot) {
  selectedRobot.value = row
  robotPhotos.value = []
  photoDrawerOpen.value = true
  photosLoading.value = true
  try {
    robotPhotos.value = await adminApi.robotPhotos(row.id)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar as fotos do robô.')
  } finally {
    photosLoading.value = false
  }
}

watch(() => route.path, () => {
  scope.value = 'COMPETITION'
  search.value = ''
  load()
})
watch(() => competition.selectedId, () => {
  if (effectiveScope.value === 'COMPETITION' || mode.value === 'categories') load()
})
watch(scope, load)
onMounted(load)
</script>

<template>
  <div class="page-stack admin-catalog-page" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Cadastros administrativos</span>
        <h1>{{ title }}</h1>
        <p class="muted">{{ subtitle }}</p>
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
        <span class="eyebrow">{{ contextLabel }}</span>
        <strong>{{ competition.selectedCompetition?.nome || 'Nenhuma competição selecionada' }}</strong>
      </div>
      <small>Os registros abaixo são derivados das inscrições desta edição.</small>
    </div>

    <article v-if="mode === 'teams'" class="table-card">
      <div class="card-heading">
        <div><span class="eyebrow">{{ effectiveScope === 'ALL' ? 'Catálogo global' : 'Participação da edição' }}</span><h2>Equipes</h2></div>
        <el-input v-model="search" clearable placeholder="Buscar equipe, instituição ou responsável" style="max-width:360px" />
      </div>
      <el-table :data="visibleTeams" empty-text="Nenhuma equipe encontrada">
        <el-table-column prop="nome" label="Equipe" min-width="190" />
        <el-table-column prop="institutionNome" label="Instituição" min-width="190" />
        <el-table-column label="Responsável" min-width="180">
          <template #default="{ row }">{{ row.responsibleUserNome || 'Não definido' }}</template>
        </el-table-column>
        <el-table-column v-if="effectiveScope === 'COMPETITION'" label="Inscrições" width="105" align="center">
          <template #default="{ row }">{{ teamRegistrationCount(row.id) }}</template>
        </el-table-column>
        <el-table-column label="Situação" width="110">
          <template #default="{ row }">
            <el-tag :type="row.ativo === false ? 'info' : 'success'" effect="light">
              {{ row.ativo === false ? 'Inativa' : 'Ativa' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="235" align="right">
          <template #default="{ row }">
            <el-button size="small" plain @click="openCompetitors(row)">Competidores</el-button>
            <el-button
              v-if="auth.isDev"
              size="small"
              :type="row.ativo === false ? 'success' : 'danger'"
              plain
              :loading="isChanging(row.id)"
              @click="toggleTeam(row)"
            >
              {{ row.ativo === false ? 'Reativar' : 'Desativar' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <article v-else-if="mode === 'robots'" class="table-card">
      <div class="card-heading">
        <div><span class="eyebrow">{{ effectiveScope === 'ALL' ? 'Catálogo global' : 'Participação da edição' }}</span><h2>Robôs</h2></div>
        <el-input v-model="search" clearable placeholder="Buscar robô ou equipe" style="max-width:320px" />
      </div>
      <el-table :data="visibleRobots" empty-text="Nenhum robô encontrado">
        <el-table-column prop="nome" label="Robô" min-width="175" />
        <el-table-column prop="teamNome" label="Equipe" min-width="175" />
        <el-table-column prop="descricao" label="Descrição" min-width="220">
          <template #default="{ row }">{{ row.descricao || '—' }}</template>
        </el-table-column>
        <el-table-column v-if="effectiveScope === 'COMPETITION'" label="Inscrições" width="105" align="center">
          <template #default="{ row }">{{ robotRegistrationCount(row.id) }}</template>
        </el-table-column>
        <el-table-column label="Situação" width="110">
          <template #default="{ row }">
            <el-tag :type="row.ativo === false ? 'info' : 'success'" effect="light">
              {{ row.ativo === false ? 'Inativo' : 'Ativo' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="210" align="right">
          <template #default="{ row }">
            <el-button size="small" plain @click="openPhotos(row)">Fotos</el-button>
            <el-button
              v-if="auth.isDev"
              size="small"
              :type="row.ativo === false ? 'success' : 'danger'"
              plain
              :loading="isChanging(row.id)"
              @click="toggleRobot(row)"
            >
              {{ row.ativo === false ? 'Reativar' : 'Desativar' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <article v-else class="table-card">
      <div class="card-heading">
        <div>
          <span class="eyebrow">{{ effectiveScope === 'ALL' ? 'Catálogo global' : 'Categorias em uso' }}</span>
          <h2>{{ effectiveScope === 'ALL' ? 'Modalidades cadastradas' : (competition.selectedCompetition?.nome || 'Modalidades') }}</h2>
        </div>
        <el-input v-model="search" clearable placeholder="Buscar categoria ou modalidade" style="max-width:320px" />
      </div>
      <el-table :data="visibleCategories" empty-text="Nenhuma categoria em uso neste escopo">
        <el-table-column prop="nome" label="Categoria" min-width="200" />
        <el-table-column label="Modalidade" width="150">
          <template #default="{ row }">{{ row.modalidade === 'FOLLOW_LINE' ? 'Follow Line' : 'Sumô' }}</template>
        </el-table-column>
        <el-table-column label="Classe física" width="145">
          <template #default="{ row }">{{ physicalClassLabel(row) }}</template>
        </el-table-column>
        <el-table-column label="Controle" width="130">
          <template #default="{ row }">{{ controlModeLabel(row) }}</template>
        </el-table-column>
        <el-table-column v-if="effectiveScope === 'COMPETITION'" label="Inscrições" width="105" align="center">
          <template #default="{ row }">{{ categoryRegistrationCount(row.id) }}</template>
        </el-table-column>
        <el-table-column label="Situação" width="110">
          <template #default="{ row }">{{ row.ativo === false ? 'Inativa' : 'Ativa' }}</template>
        </el-table-column>
      </el-table>
    </article>

    <div v-if="mode === 'categories' && effectiveScope === 'COMPETITION'" class="callout">
      <strong>Como o RasComp identifica categorias desta edição hoje?</strong>
      <p>
        A categoria é um cadastro global. Nesta visão aparecem as categorias efetivamente usadas nas inscrições da competição.
        A associação explícita Categoria ↔ Competição permanece como decisão de modelagem pendente do fechamento deste bloco.
      </p>
    </div>

    <el-drawer v-model="photoDrawerOpen" :title="`Fotos · ${selectedRobot?.nome || 'Robô'}`" size="min(720px, 96vw)">
      <div v-loading="photosLoading">
        <div v-if="robotPhotos.length" class="admin-robot-photo-grid">
          <article v-for="photo in robotPhotos" :key="photo.id" class="admin-robot-photo-card">
            <img :src="assetUrl(photo.url)" :alt="`Foto de ${selectedRobot?.nome || 'robô'}`" />
            <div>
              <strong>{{ photo.originalFilename }}</strong>
              <el-tag v-if="photo.principal" type="success" size="small">Principal</el-tag>
            </div>
          </article>
        </div>
        <el-empty v-else description="Nenhuma foto cadastrada para este robô." />
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.admin-robot-photo-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.admin-robot-photo-card { overflow:hidden; border:1px solid #e7dce2; border-radius:14px; background:#fff; }
.admin-robot-photo-card img { width:100%; height:190px; object-fit:cover; display:block; background:#f5f1f3; }
.admin-robot-photo-card > div { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; }
.admin-robot-photo-card strong { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; }
@media (max-width:680px) {
  .admin-robot-photo-grid { grid-template-columns:1fr; }
}
</style>
