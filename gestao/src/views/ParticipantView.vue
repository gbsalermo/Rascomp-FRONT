<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { assetUrl, http, participantApi, publicApi } from '../api'
import type {
  Competitor,
  ConfigFollow,
  FollowAttempt,
  Match,
  MatchResult,
  RankingItem,
  Registration,
  Robot,
  RobotImage,
  Team
} from '../types'
import StatusBadge from '../components/StatusBadge.vue'

interface PublicTeamOption {
  id: number
  nome: string
  institutionId: number
  institutionNome: string
  institutionSigla?: string
}

interface FollowOverview {
  attempts: FollowAttempt[]
  config?: ConfigFollow
  ranking?: RankingItem
}

interface SumoOverview {
  wins: number
  losses: number
  lastMatch?: Match
  lastResult?: MatchResult
  nextMatch?: Match
  bracketName?: string
}

const loading = ref(false)
const creatingTeam = ref(false)
const uploadRobotId = ref<number>()
const loadingAvailableTeams = ref(false)
const teamDialog = ref(false)
const joinDialog = ref(false)
const teams = ref<Team[]>([])
const teamId = ref<number>()
const competitors = ref<Competitor[]>([])
const robots = ref<Robot[]>([])
const registrations = ref<Registration[]>([])
const institutions = ref<Array<{ id: number; nome: string; sigla?: string }>>([])
const availableTeams = ref<PublicTeamOption[]>([])
const teamSearch = ref('')
const selectedJoinTeamId = ref<number>()
const teamForm = reactive({ nome: '', institutionId: undefined as number | undefined })
const photoMap = ref<Record<number, RobotImage[]>>({})
const followMap = ref<Record<number, FollowOverview>>({})
const sumoMap = ref<Record<number, SumoOverview>>({})

const activeTeam = computed(() => teams.value.find((item) => item.id === teamId.value))
const approvedRegistrations = computed(() => registrations.value.filter((item) => item.status === 'APROVADA'))
const pendingRegistrations = computed(() => registrations.value.filter((item) => item.status === 'PENDENTE'))
const filteredAvailableTeams = computed(() => {
  const query = teamSearch.value.trim().toLocaleLowerCase('pt-BR')
  if (!query) return availableTeams.value
  return availableTeams.value.filter((team) =>
    `${team.nome} ${team.institutionNome} ${team.institutionSigla || ''}`.toLocaleLowerCase('pt-BR').includes(query)
  )
})

function principalPhoto(robotId: number) {
  const photos = photoMap.value[robotId] || []
  return photos.find((item) => item.principal) || photos[0]
}

function robotInitials(name?: string) {
  return (name || 'RB').split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase()
}

function formatSeconds(value?: number) {
  return value == null ? '—' : `${Number(value).toFixed(3)} s`
}

function followTakeGroups(registrationId: number) {
  const overview = followMap.value[registrationId]
  if (!overview?.config) return []
  return Array.from({ length: overview.config.numeroTomadas }, (_, index) => {
    const tomada = index + 1
    const attempts = overview.attempts.filter((item) => item.tomada === tomada)
    const valid = attempts.filter((item) => item.valida && item.concluida && item.tempoFinalSegundos != null)
    const best = [...valid].sort((a, b) => Number(a.tempoFinalSegundos) - Number(b.tempoFinalSegundos))[0]
    return {
      tomada,
      attempts,
      best,
      filled: attempts.length >= overview.config!.tentativasPorTomada
    }
  })
}

function completedTakes(registrationId: number) {
  return followTakeGroups(registrationId).filter((item) => item.filled).length
}

async function loadTeams() {
  loading.value = true
  try {
    const [teamRows, institutionRows] = await Promise.all([participantApi.teams(), participantApi.institutions()])
    teams.value = teamRows
    institutions.value = institutionRows
    if (!teamId.value || !teams.value.some((item) => item.id === teamId.value)) teamId.value = teams.value[0]?.id
    await loadTeam()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar o portal do participante.')
  } finally {
    loading.value = false
  }
}

async function loadTeam() {
  competitors.value = []
  robots.value = []
  registrations.value = []
  photoMap.value = {}
  followMap.value = {}
  sumoMap.value = {}
  if (!teamId.value) return

  loading.value = true
  try {
    ;[competitors.value, robots.value, registrations.value] = await Promise.all([
      participantApi.competitors(teamId.value),
      participantApi.robots(teamId.value),
      participantApi.registrations(teamId.value)
    ])

    const photoEntries = await Promise.all(
      robots.value.map(async (robot) => [robot.id, await participantApi.robotPhotos(robot.id).catch(() => [])] as const)
    )
    photoMap.value = Object.fromEntries(photoEntries)

    await Promise.all(approvedRegistrations.value.map(loadRegistrationOverview))
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível carregar os dados da equipe.')
  } finally {
    loading.value = false
  }
}

async function loadRegistrationOverview(registration: Registration) {
  if (registration.categoryNome.toLocaleLowerCase('pt-BR').includes('seguidor') || registration.categoryNome.toLocaleLowerCase('pt-BR').includes('follow')) {
    const [attempts, config, ranking] = await Promise.all([
      participantApi.followAttempts(registration.id).catch(() => []),
      participantApi.followConfig(registration.id).catch(() => undefined),
      publicApi.rankingFollow(registration.competitionId, registration.categoryId).catch(() => [])
    ])
    followMap.value = {
      ...followMap.value,
      [registration.id]: {
        attempts,
        config,
        ranking: ranking.find((item) => item.registrationId === registration.id)
      }
    }
    return
  }

  const brackets = await publicApi.brackets(registration.competitionId).catch(() => [])
  const bracket = brackets.find((item) => item.categoryId === registration.categoryId)
  if (!bracket) {
    sumoMap.value = { ...sumoMap.value, [registration.id]: { wins: 0, losses: 0 } }
    return
  }

  const [matches, results] = await Promise.all([
    publicApi.matches(bracket.id).catch(() => []),
    publicApi.results(bracket.id).catch(() => [])
  ])
  const ownMatches = matches.filter((match) =>
    match.registrationAId === registration.id || match.registrationBId === registration.id
  )
  const ownResults = results.filter((result) => ownMatches.some((match) => match.id === result.matchId))
  const wins = ownResults.filter((result) => result.winnerRegistrationId === registration.id).length
  const losses = ownResults.filter((result) => result.winnerRegistrationId && result.winnerRegistrationId !== registration.id).length
  const ordered = [...ownMatches].sort((a, b) => a.rodada - b.rodada || a.ordem - b.ordem)
  const nextMatch = ordered.find((match) =>
    !['FINALIZADA', 'CANCELADA', 'BYE'].includes(match.status || '')
      && Boolean(match.registrationAId)
      && Boolean(match.registrationBId)
  )
  const completed = ordered.filter((match) => match.status === 'FINALIZADA')
  const lastMatch = completed.at(-1)
  const lastResult = lastMatch ? ownResults.find((result) => result.matchId === lastMatch.id) : undefined

  sumoMap.value = {
    ...sumoMap.value,
    [registration.id]: { wins, losses, nextMatch, lastMatch, lastResult, bracketName: bracket.nome }
  }
}

async function createTeam() {
  if (!teamForm.nome.trim() || !teamForm.institutionId) {
    ElMessage.warning('Informe o nome da equipe e a instituição.')
    return
  }
  creatingTeam.value = true
  try {
    await participantApi.createTeam({ nome: teamForm.nome.trim(), institutionId: teamForm.institutionId })
    ElMessage.success('Equipe criada. Você é o responsável por ela.')
    teamDialog.value = false
    teamForm.nome = ''
    teamForm.institutionId = undefined
    await loadTeams()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível criar a equipe.')
  } finally {
    creatingTeam.value = false
  }
}

async function onPhotoSelected(robot: Robot, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploadRobotId.value = robot.id
  try {
    await participantApi.uploadRobotPhoto(robot.id, file)
    photoMap.value = { ...photoMap.value, [robot.id]: await participantApi.robotPhotos(robot.id) }
    ElMessage.success(`Foto de ${robot.nome} atualizada.`)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível enviar a foto do robô.')
  } finally {
    uploadRobotId.value = undefined
  }
}

async function openJoinDialog() {
  joinDialog.value = true
  teamSearch.value = ''
  selectedJoinTeamId.value = undefined
  if (availableTeams.value.length) return
  loadingAvailableTeams.value = true
  try {
    availableTeams.value = await http.get<PublicTeamOption[]>('/api/v1/public/equipes').then((response) => response.data)
  } catch {
    ElMessage.error('Não foi possível carregar as equipes disponíveis.')
  } finally {
    loadingAvailableTeams.value = false
  }
}

function requestJoin() {
  const selected = availableTeams.value.find((item) => item.id === selectedJoinTeamId.value)
  if (!selected) return ElMessage.warning('Selecione uma equipe para solicitar entrada.')
  ElMessage.info(`Solicitação para ${selected.nome}: fluxo de convite/adesão permanece no backlog do portal.`)
}

watch(teamId, loadTeam)
onMounted(loadTeams)
</script>

<template>
  <div class="page-stack participant-dashboard" v-loading="loading">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Portal do participante</span>
        <h1>{{ activeTeam?.nome || 'Minha equipe' }}</h1>
        <p class="muted">Robôs, inscrições e desempenho competitivo em um só lugar.</p>
      </div>
      <div class="heading-actions">
        <el-select v-if="teams.length > 1" v-model="teamId" style="width:260px">
          <el-option v-for="team in teams" :key="team.id" :label="team.nome" :value="team.id" />
        </el-select>
        <template v-if="!teams.length">
          <el-button @click="openJoinDialog">Já tenho equipe</el-button>
          <el-button class="brand-button" @click="teamDialog = true">Criar equipe</el-button>
        </template>
      </div>
    </div>

    <article v-if="!teams.length && !loading" class="participant-empty-onboarding">
      <span class="eyebrow">Primeiro acesso</span>
      <h2>Comece pela sua equipe</h2>
      <p>Crie uma equipe para se tornar responsável ou procure uma equipe existente.</p>
      <div class="participant-onboarding-actions">
        <el-button class="brand-button" @click="teamDialog = true">Criar minha equipe</el-button>
        <el-button @click="openJoinDialog">Encontrar equipe</el-button>
      </div>
    </article>

    <template v-else-if="activeTeam">
      <section class="participant-summary-grid">
        <article><span>Competidores</span><strong>{{ competitors.length }}</strong><small>na equipe</small></article>
        <article><span>Robôs</span><strong>{{ robots.length }}</strong><small>cadastrados</small></article>
        <article><span>Inscrições aprovadas</span><strong>{{ approvedRegistrations.length }}</strong><small>em competição</small></article>
        <article class="attention"><span>Pendentes</span><strong>{{ pendingRegistrations.length }}</strong><small>aguardando organização</small></article>
      </section>

      <section class="participant-section">
        <div class="participant-section-heading">
          <div><span class="eyebrow">Competição</span><h2>Minha participação</h2></div>
          <span class="muted">Acompanhe o que já aconteceu e o que ainda falta.</span>
        </div>

        <div v-if="approvedRegistrations.length" class="participation-grid">
          <article v-for="registration in approvedRegistrations" :key="registration.id" class="participation-card">
            <header>
              <div class="participation-photo">
                <img
                  v-if="principalPhoto(registration.robotId)"
                  :src="assetUrl(principalPhoto(registration.robotId)?.url)"
                  :alt="`Foto de ${registration.robotNome}`"
                />
                <span v-else>{{ robotInitials(registration.robotNome) }}</span>
              </div>
              <div class="participation-title">
                <span>{{ registration.categoryNome }}</span>
                <strong>{{ registration.robotNome }}</strong>
                <small>{{ registration.competitionNome }}</small>
              </div>
              <StatusBadge :value="registration.status" />
            </header>

            <template v-if="followMap[registration.id]">
              <div class="participant-performance">
                <div><span>Ranking</span><strong>{{ followMap[registration.id].ranking?.posicao ? `#${followMap[registration.id].ranking?.posicao}` : '—' }}</strong></div>
                <div><span>Melhor tomada</span><strong>{{ followMap[registration.id].ranking?.tomada ? `T${followMap[registration.id].ranking?.tomada}` : '—' }}</strong></div>
                <div class="highlight"><span>Melhor tempo</span><strong>{{ formatSeconds(followMap[registration.id].ranking?.tempoFinalSegundos) }}</strong></div>
              </div>
              <div v-if="followMap[registration.id].config" class="take-progress">
                <div class="take-progress-copy">
                  <strong>{{ completedTakes(registration.id) }} / {{ followMap[registration.id].config?.numeroTomadas }} tomadas preenchidas</strong>
                  <span>Próxima operação: tomada {{ Math.min(completedTakes(registration.id) + 1, followMap[registration.id].config?.numeroTomadas || 1) }}</span>
                </div>
                <el-progress
                  :percentage="Math.round((completedTakes(registration.id) / (followMap[registration.id].config?.numeroTomadas || 1)) * 100)"
                  :stroke-width="9"
                  :show-text="false"
                />
              </div>
              <div class="participant-take-history">
                <div v-for="take in followTakeGroups(registration.id)" :key="take.tomada" class="participant-take-row">
                  <span>Tomada {{ take.tomada }}</span>
                  <b>{{ take.attempts.length }} tentativa(s)</b>
                  <strong>{{ formatSeconds(take.best?.tempoFinalSegundos) }}</strong>
                  <el-tag :type="take.filled ? 'success' : 'info'" size="small" effect="light">{{ take.filled ? 'Preenchida' : 'Disponível' }}</el-tag>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="participant-performance sumo">
                <div><span>Vitórias</span><strong>{{ sumoMap[registration.id]?.wins ?? 0 }}</strong></div>
                <div><span>Derrotas</span><strong>{{ sumoMap[registration.id]?.losses ?? 0 }}</strong></div>
                <div class="highlight"><span>Situação</span><strong>{{ sumoMap[registration.id]?.nextMatch ? 'Na chave' : (sumoMap[registration.id]?.wins ? 'Aguardando chave' : 'Inscrito') }}</strong></div>
              </div>
              <div v-if="sumoMap[registration.id]?.lastMatch" class="participant-last-match">
                <span>Última partida</span>
                <strong>
                  {{ sumoMap[registration.id]?.lastMatch?.robotANome }} × {{ sumoMap[registration.id]?.lastMatch?.robotBNome }}
                </strong>
                <el-tag :type="sumoMap[registration.id]?.lastResult?.winnerRegistrationId === registration.id ? 'success' : 'danger'" effect="light">
                  {{ sumoMap[registration.id]?.lastResult?.winnerRegistrationId === registration.id ? 'Vitória' : 'Derrota' }}
                </el-tag>
              </div>
              <div v-if="sumoMap[registration.id]?.nextMatch" class="participant-next-match">
                <span>Próxima partida</span>
                <strong>{{ sumoMap[registration.id]?.nextMatch?.robotANome }} × {{ sumoMap[registration.id]?.nextMatch?.robotBNome }}</strong>
                <small>{{ sumoMap[registration.id]?.bracketName }}</small>
              </div>
            </template>
          </article>
        </div>
        <el-empty v-else description="Ainda não há inscrições aprovadas para esta equipe." :image-size="82" />
      </section>

      <section class="participant-section">
        <div class="participant-section-heading">
          <div><span class="eyebrow">Equipe</span><h2>Meus robôs</h2></div>
          <span class="muted">A foto principal acompanha o robô no portal e nas telas operacionais.</span>
        </div>
        <div class="robot-gallery">
          <article v-for="robot in robots" :key="robot.id" class="robot-gallery-card">
            <div class="robot-gallery-image">
              <img v-if="principalPhoto(robot.id)" :src="assetUrl(principalPhoto(robot.id)?.url)" :alt="`Foto de ${robot.nome}`" />
              <span v-else>{{ robotInitials(robot.nome) }}</span>
            </div>
            <div class="robot-gallery-copy">
              <strong>{{ robot.nome }}</strong>
              <span>{{ robot.descricao || 'Sem descrição' }}</span>
              <small>{{ (photoMap[robot.id] || []).length }} foto(s) cadastrada(s)</small>
            </div>
            <label class="robot-photo-upload" :class="{ disabled: uploadRobotId === robot.id }">
              {{ uploadRobotId === robot.id ? 'Enviando...' : 'Trocar / adicionar foto' }}
              <input type="file" accept="image/png,image/jpeg,image/webp" :disabled="uploadRobotId === robot.id" @change="onPhotoSelected(robot, $event)" />
            </label>
          </article>
        </div>
      </section>

      <section class="participant-lower-grid">
        <article class="table-card">
          <div class="card-heading"><div><span class="eyebrow">Inscrições</span><h2>Acompanhamento</h2></div></div>
          <el-table :data="registrations" empty-text="Nenhuma inscrição">
            <el-table-column prop="competitionNome" label="Competição" min-width="170" />
            <el-table-column prop="categoryNome" label="Categoria" min-width="160" />
            <el-table-column prop="robotNome" label="Robô" min-width="120" />
            <el-table-column label="Status" width="130"><template #default="{ row }"><StatusBadge :value="row.status" /></template></el-table-column>
          </el-table>
        </article>
        <article class="table-card">
          <div class="card-heading"><div><span class="eyebrow">Equipe</span><h2>Competidores</h2></div></div>
          <el-table :data="competitors" empty-text="Nenhum competidor">
            <el-table-column prop="nome" label="Nome" />
            <el-table-column prop="email" label="E-mail" min-width="180" />
          </el-table>
        </article>
      </section>
    </template>

    <el-dialog v-model="teamDialog" title="Criar equipe" width="min(520px, 92vw)">
      <div class="form-grid">
        <label class="span-2">Nome da equipe<el-input v-model="teamForm.nome" maxlength="120" placeholder="Ex.: Team Vespa" /></label>
        <label class="span-2">Instituição
          <el-select v-model="teamForm.institutionId" filterable placeholder="Selecione" style="width:100%">
            <el-option v-for="institution in institutions" :key="institution.id" :label="institution.sigla ? `${institution.sigla} — ${institution.nome}` : institution.nome" :value="institution.id" />
          </el-select>
        </label>
      </div>
      <template #footer><el-button @click="teamDialog=false">Cancelar</el-button><el-button class="brand-button" :loading="creatingTeam" @click="createTeam">Criar equipe</el-button></template>
    </el-dialog>

    <el-dialog v-model="joinDialog" title="Encontrar minha equipe" width="min(620px, 94vw)">
      <div class="join-team-dialog" v-loading="loadingAvailableTeams">
        <p class="muted">Pesquise por equipe ou instituição.</p>
        <el-input v-model="teamSearch" clearable placeholder="Digite o nome da equipe..." />
        <div class="join-team-results">
          <button v-for="team in filteredAvailableTeams" :key="team.id" type="button" class="join-team-option" :class="{ selected: selectedJoinTeamId === team.id }" @click="selectedJoinTeamId=team.id">
            <span><strong>{{ team.nome }}</strong><small>{{ team.institutionSigla ? `${team.institutionSigla} — ` : '' }}{{ team.institutionNome }}</small></span>
            <b>{{ selectedJoinTeamId === team.id ? 'Selecionada' : 'Escolher' }}</b>
          </button>
        </div>
      </div>
      <template #footer><el-button @click="joinDialog=false">Cancelar</el-button><el-button class="brand-button" @click="requestJoin">Solicitar entrada</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>
.participant-dashboard { gap: 20px; }
.participant-summary-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
.participant-summary-grid article { display:grid; gap:4px; padding:17px 18px; border:1px solid #eadfe5; border-radius:14px; background:#fff; }
.participant-summary-grid span,.participant-summary-grid small { color:#82747b; font-size:11px; }
.participant-summary-grid strong { color:#2e2228; font-size:25px; }
.participant-summary-grid .attention { background:#fff8f4; border-color:#f1d8c5; }
.participant-summary-grid .attention strong { color:#9f0f3b; }
.participant-section { display:grid; gap:14px; }
.participant-section-heading { display:flex; align-items:end; justify-content:space-between; gap:16px; }
.participant-section-heading h2 { margin:2px 0 0; }
.participation-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.participation-card { display:grid; gap:15px; padding:18px; border:1px solid #e5d9df; border-radius:18px; background:#fff; box-shadow:0 9px 28px rgba(70,20,44,.05); }
.participation-card header { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:13px; }
.participation-photo { display:grid; place-items:center; width:76px; height:76px; border-radius:18px; overflow:hidden; background:linear-gradient(145deg,#4f1967,#9f0f3b); color:#fff; font-size:20px; font-weight:900; }
.participation-photo img,.robot-gallery-image img { width:100%; height:100%; object-fit:cover; }
.participation-title { display:grid; gap:2px; min-width:0; }
.participation-title > span { color:#9f0f3b; font-size:10px; font-weight:850; text-transform:uppercase; letter-spacing:.06em; }
.participation-title strong { color:#292027; font-size:19px; }
.participation-title small { color:#83767d; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.participant-performance { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
.participant-performance > div { display:grid; gap:3px; padding:11px 12px; border-radius:12px; background:#f7f3f5; }
.participant-performance span { color:#81737a; font-size:10px; }
.participant-performance strong { color:#35272f; font-size:17px; }
.participant-performance .highlight { background:#fff0f5; }
.participant-performance .highlight strong { color:#9f0f3b; }
.take-progress { display:grid; gap:8px; padding:12px 13px; border:1px solid #eadce3; border-radius:12px; }
.take-progress-copy { display:flex; justify-content:space-between; gap:12px; font-size:11px; }
.take-progress-copy span { color:#84777e; }
.participant-take-history { display:grid; gap:6px; }
.participant-take-row { display:grid; grid-template-columns:85px minmax(0,1fr) 95px auto; align-items:center; gap:8px; min-height:36px; padding:7px 9px; border-radius:9px; background:#faf8f9; font-size:11px; }
.participant-take-row span { font-weight:750; }
.participant-take-row b { color:#81747a; font-weight:600; }
.participant-take-row strong { color:#9f0f3b; }
.participant-last-match,.participant-next-match { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:10px; padding:11px 12px; border-radius:12px; background:#faf7f8; }
.participant-last-match > span,.participant-next-match > span { color:#81747b; font-size:10px; text-transform:uppercase; font-weight:800; }
.participant-next-match small { grid-column:2; color:#8c7e85; }
.robot-gallery { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.robot-gallery-card { display:grid; grid-template-columns:108px minmax(0,1fr) auto; align-items:center; gap:14px; padding:14px; border:1px solid #e7dde2; border-radius:16px; background:#fff; }
.robot-gallery-image { display:grid; place-items:center; width:108px; height:82px; border-radius:13px; overflow:hidden; background:linear-gradient(145deg,#4f1967,#9f0f3b); color:#fff; font-size:22px; font-weight:900; }
.robot-gallery-copy { display:grid; gap:3px; }
.robot-gallery-copy span,.robot-gallery-copy small { color:#82757c; font-size:10px; }
.robot-photo-upload { padding:9px 11px; border:1px solid #cbaeb9; border-radius:10px; color:#8f1238; font-size:10px; font-weight:800; cursor:pointer; text-align:center; }
.robot-photo-upload input { display:none; }
.robot-photo-upload.disabled { opacity:.5; cursor:wait; }
.participant-lower-grid { display:grid; grid-template-columns:1.2fr .8fr; gap:14px; }
.participant-empty-onboarding { padding:28px; border:1px solid #eadde3; border-radius:18px; background:#fff; }
.participant-empty-onboarding h2 { margin:4px 0 8px; }
.participant-onboarding-actions { display:flex; gap:10px; margin-top:18px; }
.join-team-dialog,.join-team-results { display:grid; gap:10px; }
.join-team-option { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px; border:1px solid #e5d9df; border-radius:11px; background:#fff; text-align:left; cursor:pointer; }
.join-team-option span { display:grid; gap:2px; }
.join-team-option small { color:#82757c; }
.join-team-option.selected { border-color:#9f0f3b; background:#fff4f7; }
.join-team-option b { color:#9f0f3b; font-size:10px; }
@media (max-width:1050px) { .participant-summary-grid,.participation-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .robot-gallery,.participant-lower-grid { grid-template-columns:1fr; } }
@media (max-width:680px) { .participant-summary-grid,.participation-grid { grid-template-columns:1fr; } .participant-section-heading,.take-progress-copy { align-items:flex-start; flex-direction:column; } .robot-gallery-card { grid-template-columns:82px 1fr; } .robot-gallery-image { width:82px; height:70px; } .robot-photo-upload { grid-column:1 / -1; } .participant-performance { grid-template-columns:1fr; } .participant-take-row { grid-template-columns:1fr 1fr; } }
</style>
