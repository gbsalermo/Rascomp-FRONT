<script setup lang="ts">
import { computed } from 'vue'
import type { ConfigFollow, FollowAttempt, FollowTakeAbsence } from '../types'

const props = defineProps<{
  attempts: FollowAttempt[]
  absences?: FollowTakeAbsence[]
  config?: ConfigFollow
  search?: string
}>()

interface TakeGroup {
  key: string
  registrationId: number
  robotNome: string
  teamNome: string
  tomada: number
  attempts: FollowAttempt[]
  absence?: FollowTakeAbsence
  best?: FollowAttempt
  latest?: string
  complete: boolean
}

const groups = computed<TakeGroup[]>(() => {
  const attemptMap = new Map<string, FollowAttempt[]>()
  const absenceMap = new Map<string, FollowTakeAbsence>()

  for (const attempt of props.attempts) {
    const key = `${attempt.registrationId}:${attempt.tomada}`
    const list = attemptMap.get(key) || []
    list.push(attempt)
    attemptMap.set(key, list)
  }

  for (const absence of props.absences || []) {
    absenceMap.set(`${absence.registrationId}:${absence.tomada}`, absence)
  }

  const keys = new Set([...attemptMap.keys(), ...absenceMap.keys()])
  const term = props.search?.trim().toLocaleLowerCase('pt-BR') || ''

  return [...keys]
    .map((key) => {
      const attempts = [...(attemptMap.get(key) || [])]
        .sort((a, b) => a.numeroTentativa - b.numeroTentativa)
      const absence = absenceMap.get(key)
      const first = attempts[0]
      const best = attempts
        .filter((item) => item.valida && item.concluida && item.tempoFinalSegundos != null)
        .sort((a, b) => {
          const finalDiff = Number(a.tempoFinalSegundos) - Number(b.tempoFinalSegundos)
          if (finalDiff !== 0) return finalDiff
          return Number(a.tempoSegundos || 0) - Number(b.tempoSegundos || 0)
        })[0]
      const latestAttempt = attempts
        .map((item) => item.dataCadastro)
        .filter((value): value is string => Boolean(value))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      const latest = [latestAttempt, absence?.dataCadastro]
        .filter((value): value is string => Boolean(value))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

      return {
        key,
        registrationId: first?.registrationId || absence?.registrationId || 0,
        robotNome: first?.robotNome || absence?.robotNome || `Inscrição #${absence?.registrationId || '—'}`,
        teamNome: first?.teamNome || absence?.teamNome || '—',
        tomada: first?.tomada || absence?.tomada || 0,
        attempts,
        absence,
        best,
        latest,
        complete: Boolean(absence || (props.config && attempts.length >= props.config.tentativasPorTomada))
      }
    })
    .filter((group) => {
      if (!term) return true
      return group.robotNome.toLocaleLowerCase('pt-BR').includes(term)
        || group.teamNome.toLocaleLowerCase('pt-BR').includes(term)
    })
    .sort((a, b) => {
      const dateA = a.latest ? new Date(a.latest).getTime() : 0
      const dateB = b.latest ? new Date(b.latest).getTime() : 0
      if (dateA !== dateB) return dateB - dateA
      return a.robotNome.localeCompare(b.robotNome, 'pt-BR') || a.tomada - b.tomada
    })
})

function formatSeconds(value?: number) {
  if (value == null) return '—'
  return `${Number(value).toFixed(3)} s`
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}
</script>

<template>
  <div v-if="groups.length" class="take-history-list">
    <el-collapse>
      <el-collapse-item v-for="group in groups" :key="group.key" :name="group.key">
        <template #title>
          <div class="take-history-title">
            <div class="take-identity">
              <strong>{{ group.robotNome }}</strong>
              <small>{{ group.teamNome }}</small>
            </div>

            <div class="take-number">
              <span>Tomada</span>
              <strong>{{ group.tomada }}</strong>
            </div>

            <div class="take-progress">
              <span>{{ group.absence ? 'Situação' : 'Tentativas' }}</span>
              <strong v-if="group.absence">Ausência</strong>
              <strong v-else>{{ group.attempts.length }} / {{ config?.tentativasPorTomada ?? '—' }}</strong>
            </div>

            <div class="take-best">
              <span>{{ group.absence ? 'Resultado da tomada' : 'Melhor tentativa da tomada' }}</span>
              <strong v-if="group.absence">Perdida por ausência</strong>
              <strong v-else-if="group.best">
                #{{ group.best.numeroTentativa }} · {{ formatSeconds(group.best.tempoFinalSegundos) }}
              </strong>
              <strong v-else>Sem tentativa classificável</strong>
            </div>

            <el-tag v-if="group.absence" type="danger" effect="light" size="small">Ausência</el-tag>
            <el-tag v-else :type="group.complete ? 'success' : 'warning'" effect="light" size="small">
              {{ group.complete ? 'Completa' : 'Em andamento' }}
            </el-tag>
          </div>
        </template>

        <div v-if="group.absence" class="take-absence-detail">
          <div>
            <span class="eyebrow">Tomada {{ group.tomada }}</span>
            <h3>Perdida por ausência</h3>
            <p>{{ group.absence.observacao || 'Participante não compareceu dentro do tempo de apresentação.' }}</p>
          </div>
          <div class="take-absence-audit">
            <span>Registrado por</span>
            <strong>{{ group.absence.registradoPorNome || 'Organização' }}</strong>
            <small>{{ formatDate(group.absence.dataCadastro) }}</small>
          </div>
        </div>

        <div v-else class="take-attempts">
          <div class="take-attempts-heading">
            <div>
              <span class="eyebrow">Detalhes da tomada {{ group.tomada }}</span>
              <h3>Tentativas</h3>
            </div>
            <small v-if="group.latest">Último registro: {{ formatDate(group.latest) }}</small>
          </div>

          <el-table :data="group.attempts" size="small" empty-text="Nenhuma tentativa">
            <el-table-column prop="numeroTentativa" label="#" width="60" />
            <el-table-column label="Tempo" width="110">
              <template #default="{ row }">{{ formatSeconds(row.tempoSegundos) }}</template>
            </el-table-column>
            <el-table-column label="Penalidade" width="105">
              <template #default="{ row }">+{{ row.penalidadeSegundos || 0 }} s</template>
            </el-table-column>
            <el-table-column label="Tempo final" width="120">
              <template #default="{ row }">
                <strong :class="{ 'best-attempt': group.best?.id === row.id }">
                  {{ formatSeconds(row.tempoFinalSegundos) }}
                </strong>
              </template>
            </el-table-column>
            <el-table-column label="Checkpoints" width="110">
              <template #default="{ row }">{{ row.checkpointsAlcancados }} / {{ config?.numeroCheckpoints ?? '—' }}</template>
            </el-table-column>
            <el-table-column label="Concluída" width="100">
              <template #default="{ row }">
                <el-tag :type="row.concluida ? 'success' : 'warning'" effect="light" size="small">
                  {{ row.concluida ? 'Sim' : 'Não' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Válida" width="90">
              <template #default="{ row }">
                <el-tag :type="row.valida ? 'success' : 'danger'" effect="light" size="small">
                  {{ row.valida ? 'Sim' : 'Não' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Registrada em" min-width="135">
              <template #default="{ row }">{{ formatDate(row.dataCadastro) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <div v-else class="take-history-empty">
    Nenhuma tomada registrada neste contexto.
  </div>
</template>

<style scoped>
.take-history-list :deep(.el-collapse) { border: 0; }
.take-history-list :deep(.el-collapse-item) { margin-bottom: 10px; overflow: hidden; border: 1px solid #eadfe5; border-radius: 14px; background: #fff; }
.take-history-list :deep(.el-collapse-item__header) { min-height: 72px; height: auto; padding: 10px 14px; border: 0; }
.take-history-list :deep(.el-collapse-item__wrap) { border: 0; }
.take-history-list :deep(.el-collapse-item__content) { padding: 0; }
.take-history-title { display: grid; width: 100%; grid-template-columns: minmax(150px, 1.2fr) 78px 105px minmax(190px, 1fr) auto; align-items: center; gap: 14px; padding-right: 10px; }
.take-identity,.take-number,.take-progress,.take-best { display: grid; gap: 2px; }
.take-identity small,.take-number span,.take-progress span,.take-best span { color: #8a7c84; font-size: 10px; }
.take-number strong,.take-progress strong { color: #9f0f3b; font-size: 17px; }
.take-best strong { color: #4f3d46; font-size: 11px; }
.take-attempts { padding: 14px; border-top: 1px solid #f0e7eb; background: #fcfafb; }
.take-attempts-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; margin-bottom: 12px; }
.take-attempts-heading h3,.take-absence-detail h3 { margin: 2px 0 0; }
.take-attempts-heading > small { color: #8a7c84; font-size: 10px; }
.take-absence-detail { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:18px; padding:16px; border-top:1px solid #f0e7eb; background:#fff8f8; }
.take-absence-detail p { margin:6px 0 0; color:#715e64; font-size:11px; }
.take-absence-audit { display:grid; align-content:center; gap:2px; min-width:150px; }
.take-absence-audit span,.take-absence-audit small { color:#8f7777; font-size:10px; }
.take-absence-audit strong { color:#8d2929; font-size:12px; }
.best-attempt { color: #9f0f3b; }
.take-history-empty { padding: 34px 18px; text-align: center; color: #84757d; }
@media (max-width: 900px) { .take-history-title { grid-template-columns: minmax(150px, 1fr) 70px 95px; } .take-best { grid-column: 1 / 3; } .take-absence-detail { grid-template-columns:1fr; } }
</style>
