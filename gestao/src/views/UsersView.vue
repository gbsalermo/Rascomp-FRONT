<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '../api'
import { useAuthStore } from '../store'
import type { UserAccount, UserRole } from '../types'

const auth = useAuthStore()
const loading = ref(false)
const changingIds = ref<number[]>([])
const selectedRole = ref<UserRole>('PARTICIPANTE')
const participants = ref<UserAccount[]>([])
const organization = ref<UserAccount[]>([])

const rows = computed(() => selectedRole.value === 'PARTICIPANTE' ? participants.value : organization.value)

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

async function load() {
  loading.value = true
  try {
    const [participantRows, organizationRows] = await Promise.all([
      adminApi.users('PARTICIPANTE'),
      adminApi.users('ORGANIZACAO')
    ])
    participants.value = participantRows
    organization.value = organizationRows
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
      <el-button @click="load">Atualizar</el-button>
    </div>

    <section class="metric-grid">
      <article class="metric-card accent-purple">
        <span>Participantes</span>
        <strong>{{ participants.length }}</strong>
        <small>{{ participants.filter((item) => item.ativo).length }} ativos</small>
      </article>
      <article class="metric-card accent-red">
        <span>Organização</span>
        <strong>{{ organization.length }}</strong>
        <small>{{ organization.filter((item) => item.ativo).length }} ativos</small>
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
          :options="[
            { label: 'Participantes', value: 'PARTICIPANTE' },
            { label: 'Organização', value: 'ORGANIZACAO' }
          ]"
        />
      </div>

      <el-table :data="rows" empty-text="Nenhum usuário cadastrado">
        <el-table-column prop="nome" label="Nome" min-width="190" />
        <el-table-column prop="email" label="E-mail" min-width="230" />
        <el-table-column label="Perfil" width="140">
          <template #default="{ row }">
            {{ row.role === 'ORGANIZACAO' ? 'Organização' : 'Participante' }}
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

    <div class="callout">
      <strong>Desativação não remove histórico.</strong>
      <p>Conta, equipe ou robô permanecem registrados para preservar inscrições, resultados e histórico competitivo. A ação apenas retira o registro dos fluxos ativos.</p>
    </div>
  </div>
</template>
