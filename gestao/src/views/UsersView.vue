<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore } from '../store'
import type { InternalUserRole, UserAccount, UserRole } from '../types'

const auth = useAuthStore()
const loading = ref(false)
const changingIds = ref<number[]>([])
const selectedRole = ref<UserRole>('PARTICIPANTE')
const createDialogOpen = ref(false)
const creating = ref(false)
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

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: 'Participantes', value: 'PARTICIPANTE' },
  { label: 'Gestão', value: 'GESTAO' },
  { label: 'Mídia', value: 'MIDIA' },
  { label: 'DEV', value: 'DEV' }
]

const usersByRole = ref<Record<UserRole, UserAccount[]>>({
  DEV: [],
  GESTAO: [],
  MIDIA: [],
  PARTICIPANTE: []
})

const rows = computed(() => usersByRole.value[selectedRole.value])
const participants = computed(() => usersByRole.value.PARTICIPANTE)
const internalUsers = computed(() => [
  ...usersByRole.value.DEV,
  ...usersByRole.value.GESTAO,
  ...usersByRole.value.MIDIA
])

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
    selectedRole.value = newInternalUser.role
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
  if (!activate && isCurrentUser(user)) {
    ElMessage.warning('A conta atualmente logada não pode ser desativada por esta tela.')
    return
  }

  if (!activate) {
    try {
      await ElMessageBox.confirm(
        `Desativar a conta de ${user.nome}? O usuário deixará de poder utilizar o sistema enquanto permanecer inativo.`,
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
        <span class="eyebrow">Sistema e acesso</span>
        <h1>Usuários</h1>
        <p class="muted">Consulte contas e controle quem permanece ativo no RasComp.</p>
      </div>
      <div class="action-row">
        <el-button type="primary" @click="createDialogOpen = true">Nova conta interna</el-button>
        <el-button @click="load">Atualizar</el-button>
      </div>
    </div>

    <section class="metric-grid">
      <article class="metric-card accent-purple">
        <span>Participantes</span>
        <strong>{{ participants.length }}</strong>
        <small>{{ participants.filter((item) => item.ativo).length }} ativos</small>
      </article>
      <article class="metric-card accent-red">
        <span>Equipe interna</span>
        <strong>{{ internalUsers.length }}</strong>
        <small>{{ internalUsers.filter((item) => item.ativo).length }} ativos entre DEV, Gestão e Mídia</small>
      </article>
    </section>

    <article class="table-card">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Contas cadastradas</span>
          <h2>Controle de acesso</h2>
        </div>
        <el-segmented
          v-model="selectedRole"
          :options="roleOptions"
        />
      </div>

      <el-table :data="rows" empty-text="Nenhum usuário cadastrado">
        <el-table-column prop="nome" label="Nome" min-width="190" />
        <el-table-column prop="email" label="E-mail" min-width="230" />
        <el-table-column label="Perfil" width="140">
          <template #default="{ row }">
            {{ roleLabel(row.role) }}
          </template>
        </el-table-column>
        <el-table-column label="Último acesso" min-width="170">
          <template #default="{ row }">{{ formatDateTime(row.ultimoLogin) }}</template>
        </el-table-column>
        <el-table-column label="Situação" width="130">
          <template #default="{ row }">
            <el-tag :type="row.ativo ? 'success' : 'info'" effect="light">
              {{ row.ativo ? 'Ativo' : 'Inativo' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ação" width="160" align="right">
          <template #default="{ row }">
            <el-button
              size="small"
              :type="row.ativo ? 'danger' : 'success'"
              plain
              :disabled="row.ativo && isCurrentUser(row)"
              :loading="isChanging(row.id)"
              :title="row.ativo && isCurrentUser(row) ? 'Conta atualmente logada' : undefined"
              @click="toggleUser(row)"
            >
              {{ row.ativo ? (isCurrentUser(row) ? 'Conta atual' : 'Desativar') : 'Reativar' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </article>

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
          <strong>Conta interna separada.</strong>
          <p>O cadastro público sempre cria PARTICIPANTE. Uma mesma pessoa pode ter uma conta pessoal de participante e outra conta institucional, usando e-mails de acesso diferentes.</p>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="createDialogOpen = false">Cancelar</el-button>
        <el-button type="primary" :loading="creating" @click="createInternalUser">Criar conta</el-button>
      </template>
    </el-dialog>

    <div class="callout">
      <strong>Desativação não remove histórico.</strong>
      <p>Conta, equipe ou robô permanecem registrados para preservar inscrições, resultados e histórico competitivo. A ação apenas retira o registro dos fluxos ativos.</p>
    </div>
  </div>
</template>
