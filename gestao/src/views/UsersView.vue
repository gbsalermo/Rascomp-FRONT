<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { adminApi } from '../api'
import { useAuthStore } from '../store'
import type { InternalUserRole, UserAccount, UserRole } from '../types'

type UserSection = 'ORGANIZACAO' | 'PARTICIPANTES'
type InternalFilter = 'TODOS' | InternalUserRole

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const changingIds = ref<number[]>([])
const section = ref<UserSection>('ORGANIZACAO')
const internalFilter = ref<InternalFilter>('TODOS')
const search = ref('')

const createDialogOpen = ref(false)
const creating = ref(false)
const roleDialogOpen = ref(false)
const roleSaving = ref(false)
const dataDialogOpen = ref(false)
const dataSaving = ref(false)
const editingUser = ref<UserAccount | null>(null)
const editingRole = ref<InternalUserRole>('GESTAO')

const editData = reactive({
  nome: '',
  email: '',
  telefone: ''
})

const newInternalUser = reactive({
  nome: '',
  email: '',
  senha: '',
  telefone: '',
  role: 'GESTAO' as InternalUserRole
})

const internalRoleOptions: Array<{ label: string; value: InternalUserRole }> = [
  { label: 'Gestão', value: 'GESTAO' },
  { label: 'Mídia', value: 'MIDIA' },
  { label: 'DEV', value: 'DEV' }
]

const internalFilterOptions: Array<{ label: string; value: InternalFilter }> = [
  { label: 'Todos', value: 'TODOS' },
  ...internalRoleOptions
]

const sectionOptions = [
  { label: 'Organização / Diretoria', value: 'ORGANIZACAO' },
  { label: 'Participantes', value: 'PARTICIPANTES' }
]

const usersByRole = ref<Record<UserRole, UserAccount[]>>({
  DEV: [],
  GESTAO: [],
  MIDIA: [],
  PARTICIPANTE: []
})

const participants = computed(() => usersByRole.value.PARTICIPANTE)
const internalUsers = computed(() => [
  ...usersByRole.value.DEV,
  ...usersByRole.value.GESTAO,
  ...usersByRole.value.MIDIA
].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))

const visibleRows = computed(() => {
  const source = section.value === 'PARTICIPANTES'
    ? participants.value
    : internalUsers.value.filter((user) => internalFilter.value === 'TODOS' || user.role === internalFilter.value)

  const term = search.value.trim().toLowerCase()
  if (!term) return source

  return source.filter((user) =>
    [user.nome, user.email, user.telefone || '', roleLabel(user.role)]
      .some((value) => value.toLowerCase().includes(term))
  )
})

const activeParticipants = computed(() => participants.value.filter((item) => item.ativo).length)
const activeInternal = computed(() => internalUsers.value.filter((item) => item.ativo).length)

function roleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    DEV: 'DEV',
    GESTAO: 'Gestão',
    MIDIA: 'Mídia',
    PARTICIPANTE: 'Participante'
  }
  return labels[role]
}

function isChanging(id: number) {
  return changingIds.value.includes(id)
}

function isCurrentUser(user: UserAccount) {
  return auth.user?.id === user.id
}

function markChanging(id: number, changing: boolean) {
  if (changing) {
    if (!changingIds.value.includes(id)) changingIds.value.push(id)
    return
  }
  changingIds.value = changingIds.value.filter((item) => item !== id)
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function openRoleDialog(user: UserAccount) {
  if (user.role === 'PARTICIPANTE') return
  if (isCurrentUser(user)) {
    ElMessage.warning('A conta atualmente logada não pode alterar a própria permissão.')
    return
  }
  editingUser.value = user
  editingRole.value = user.role
  roleDialogOpen.value = true
}

function resetRoleDialog() {
  editingUser.value = null
  editingRole.value = 'GESTAO'
}

async function saveRole() {
  if (!editingUser.value) return
  roleSaving.value = true
  try {
    const updated = await adminApi.setUserRole(editingUser.value.id, editingRole.value)
    roleDialogOpen.value = false
    if (updated.role !== 'PARTICIPANTE') internalFilter.value = updated.role
    ElMessage.success(`Permissão alterada para ${roleLabel(updated.role)}.`)
    resetRoleDialog()
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível alterar a permissão do usuário.')
  } finally {
    roleSaving.value = false
  }
}

function openDataDialog(user: UserAccount) {
  editingUser.value = user
  editData.nome = user.nome
  editData.email = user.email
  editData.telefone = user.telefone || ''
  dataDialogOpen.value = true
}

function resetDataDialog() {
  editingUser.value = null
  editData.nome = ''
  editData.email = ''
  editData.telefone = ''
}

async function saveData() {
  if (!editingUser.value) return
  if (!editData.nome.trim() || !editData.email.trim()) {
    ElMessage.warning('Informe nome e e-mail.')
    return
  }

  const originalEmail = editingUser.value.email
  const currentUser = isCurrentUser(editingUser.value)
  dataSaving.value = true

  try {
    const updated = await adminApi.updateUser(editingUser.value.id, {
      nome: editData.nome.trim(),
      email: editData.email.trim(),
      telefone: editData.telefone.trim() || undefined
    })

    dataDialogOpen.value = false

    if (currentUser && originalEmail.toLowerCase() !== updated.email.toLowerCase()) {
      ElMessage.success('Dados atualizados. Como seu e-mail de acesso mudou, entre novamente.')
      await auth.logout()
      await router.replace('/login')
      return
    }

    if (currentUser) await auth.hydrate(true)
    ElMessage.success('Dados cadastrais atualizados.')
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível atualizar os dados cadastrais.')
  } finally {
    dataSaving.value = false
  }
}

function resetInternalUserForm() {
  newInternalUser.nome = ''
  newInternalUser.email = ''
  newInternalUser.senha = ''
  newInternalUser.telefone = ''
  newInternalUser.role = 'GESTAO'
}

async function createInternalUser() {
  if (!newInternalUser.nome.trim() || !newInternalUser.email.trim() || newInternalUser.senha.length < 8) {
    ElMessage.warning('Informe nome, e-mail e uma senha com pelo menos 8 caracteres.')
    return
  }

  creating.value = true
  try {
    await adminApi.createInternalUser(
      {
        nome: newInternalUser.nome.trim(),
        email: newInternalUser.email.trim(),
        senha: newInternalUser.senha,
        telefone: newInternalUser.telefone.trim() || undefined
      },
      newInternalUser.role
    )
    section.value = 'ORGANIZACAO'
    internalFilter.value = newInternalUser.role
    createDialogOpen.value = false
    ElMessage.success(`Conta ${roleLabel(newInternalUser.role)} criada.`)
    resetInternalUserForm()
    await load()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível criar a conta interna.')
  } finally {
    creating.value = false
  }
}

async function load() {
  loading.value = true
  try {
    const roles: UserRole[] = ['PARTICIPANTE', 'GESTAO', 'MIDIA', 'DEV']
    const results = await Promise.all(roles.map((role) => adminApi.users(role)))
    roles.forEach((role, index) => {
      usersByRole.value[role] = results[index]
    })
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os usuários.')
  } finally {
    loading.value = false
  }
}

async function toggleUser(user: UserAccount) {
  const activate = !user.ativo

  if (!activate) {
    try {
      await ElMessageBox.confirm(
        `Desativar a conta de ${user.nome}? O acesso será bloqueado, mas histórico e vínculos serão preservados.`,
        'Desativar usuário',
        { confirmButtonText: 'Desativar', cancelButtonText: 'Cancelar', type: 'warning' }
      )
    } catch {
      return
    }
  }

  markChanging(user.id, true)
  try {
    const updated = await adminApi.setUserActive(user.id, activate)
    user.ativo = updated.ativo
    ElMessage.success(activate ? 'Usuário reativado.' : 'Usuário desativado.')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível alterar a situação do usuário.')
  } finally {
    markChanging(user.id, false)
  }
}

onMounted(load)
</script>

<template>
  <div class="page-stack users-admin-page" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Administração de identidades</span>
        <h1>Usuários</h1>
        <p class="muted">Contas institucionais e participantes são identidades separadas, com regras próprias.</p>
      </div>
      <div class="action-row">
        <el-button v-if="section === 'ORGANIZACAO'" type="primary" @click="createDialogOpen = true">
          Nova conta interna
        </el-button>
        <el-button @click="load">Atualizar</el-button>
      </div>
    </div>

    <section class="metric-grid">
      <article class="metric-card accent-red">
        <span>Organização / Diretoria</span>
        <strong>{{ internalUsers.length }}</strong>
        <small>{{ activeInternal }} ativos entre DEV, Gestão e Mídia</small>
      </article>
      <article class="metric-card accent-purple">
        <span>Participantes</span>
        <strong>{{ participants.length }}</strong>
        <small>{{ activeParticipants }} ativos</small>
      </article>
    </section>

    <article class="table-card">
      <div class="card-heading users-admin-heading">
        <div>
          <span class="eyebrow">Contas cadastradas</span>
          <h2>{{ section === 'ORGANIZACAO' ? 'Organização / Diretoria' : 'Participantes da competição' }}</h2>
        </div>
        <el-segmented v-model="section" :options="sectionOptions" />
      </div>

      <div class="filter-bar users-filter-bar">
        <el-input v-model="search" clearable placeholder="Buscar por nome, e-mail, telefone ou perfil" />
        <el-select v-if="section === 'ORGANIZACAO'" v-model="internalFilter" style="width: 180px">
          <el-option
            v-for="option in internalFilterOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <el-table :data="visibleRows" empty-text="Nenhum usuário encontrado">
        <el-table-column prop="nome" label="Nome" min-width="180" />
        <el-table-column prop="email" label="E-mail" min-width="220" />
        <el-table-column prop="telefone" label="Telefone" min-width="145">
          <template #default="{ row }">{{ row.telefone || '—' }}</template>
        </el-table-column>
        <el-table-column label="Perfil" width="130">
          <template #default="{ row }">{{ roleLabel(row.role) }}</template>
        </el-table-column>
        <el-table-column label="Último acesso" min-width="160">
          <template #default="{ row }">{{ formatDateTime(row.ultimoLogin) }}</template>
        </el-table-column>
        <el-table-column label="Situação" width="110">
          <template #default="{ row }">
            <el-tag :type="row.ativo ? 'success' : 'info'" effect="light">
              {{ row.ativo ? 'Ativo' : 'Inativo' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="300" align="right">
          <template #default="{ row }">
            <div class="action-row">
              <el-button size="small" plain @click="openDataDialog(row)">Editar dados</el-button>
              <el-button
                v-if="row.role !== 'PARTICIPANTE'"
                size="small"
                plain
                :disabled="isCurrentUser(row)"
                :title="isCurrentUser(row) ? 'A conta atual não pode alterar a própria permissão' : undefined"
                @click="openRoleDialog(row)"
              >
                Permissão
              </el-button>
              <el-button
                size="small"
                :type="row.ativo ? 'danger' : 'success'"
                plain
                :disabled="row.ativo && isCurrentUser(row)"
                :loading="isChanging(row.id)"
                :title="row.ativo && isCurrentUser(row) ? 'A conta atual não pode ser desativada' : undefined"
                @click="toggleUser(row)"
              >
                {{ row.ativo ? (isCurrentUser(row) ? 'Conta atual' : 'Desativar') : 'Reativar' }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </article>

    <div class="callout">
      <strong>Identidades não são convertidas.</strong>
      <p>
        PARTICIPANTE continua PARTICIPANTE. DEV, Gestão e Mídia continuam contas internas.
        A edição cadastral altera nome, e-mail e telefone, nunca a natureza da conta.
      </p>
    </div>

    <el-dialog v-model="dataDialogOpen" title="Editar dados cadastrais" width="520px" @closed="resetDataDialog">
      <template v-if="editingUser">
        <el-form label-position="top">
          <el-form-item label="Nome">
            <el-input v-model="editData.nome" maxlength="150" />
          </el-form-item>
          <el-form-item label="E-mail de acesso">
            <el-input v-model="editData.email" type="email" maxlength="150" />
          </el-form-item>
          <el-form-item label="Telefone">
            <el-input v-model="editData.telefone" maxlength="20" />
          </el-form-item>
          <div class="callout">
            <strong>{{ editingUser.role === 'PARTICIPANTE' ? 'Conta participante' : 'Conta interna' }}</strong>
            <p>
              Alterar o e-mail invalida a sessão anterior dessa conta. Permissão e tipo de identidade não são alterados aqui.
            </p>
          </div>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="dataDialogOpen = false">Cancelar</el-button>
        <el-button type="primary" :loading="dataSaving" @click="saveData">Salvar dados</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="roleDialogOpen" title="Editar permissão interna" width="460px" @closed="resetRoleDialog">
      <template v-if="editingUser">
        <p class="muted">{{ editingUser.nome }} · {{ editingUser.email }}</p>
        <el-form label-position="top">
          <el-form-item label="Perfil interno">
            <el-select v-model="editingRole" style="width: 100%">
              <el-option
                v-for="option in internalRoleOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <div class="callout">
            <strong>Somente perfis internos.</strong>
            <p>Esta ação alterna apenas entre DEV, Gestão e Mídia. PARTICIPANTE não participa dessa conversão.</p>
          </div>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="roleDialogOpen = false">Cancelar</el-button>
        <el-button type="primary" :loading="roleSaving" @click="saveRole">Salvar permissão</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="createDialogOpen" title="Nova conta interna" width="520px" @closed="resetInternalUserForm">
      <el-form label-position="top">
        <el-form-item label="Perfil">
          <el-select v-model="newInternalUser.role" style="width: 100%">
            <el-option
              v-for="option in internalRoleOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Nome">
          <el-input v-model="newInternalUser.nome" maxlength="150" />
        </el-form-item>
        <el-form-item label="E-mail de acesso">
          <el-input v-model="newInternalUser.email" type="email" maxlength="150" />
        </el-form-item>
        <el-form-item label="Telefone (opcional)">
          <el-input v-model="newInternalUser.telefone" maxlength="20" />
        </el-form-item>
        <el-form-item label="Senha inicial">
          <el-input v-model="newInternalUser.senha" type="password" show-password maxlength="72" />
        </el-form-item>
        <div class="callout">
          <strong>Conta institucional.</strong>
          <p>O cadastro público continua exclusivo para PARTICIPANTE. Uma mesma pessoa pode possuir as duas identidades, com e-mails diferentes.</p>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="createDialogOpen = false">Cancelar</el-button>
        <el-button type="primary" :loading="creating" @click="createInternalUser">Criar conta</el-button>
      </template>
    </el-dialog>
  </div>
</template>
