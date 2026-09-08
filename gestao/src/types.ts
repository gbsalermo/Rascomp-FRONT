export type UserRole = 'PARTICIPANTE' | 'ORGANIZACAO'
export type CompetitionStatus =
  | 'PLANEJADA'
  | 'INSCRICOES_ABERTAS'
  | 'INSCRICOES_ENCERRADAS'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA'
export type RegistrationStatus =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REJEITADA'
  | 'CANCELADA'
  | 'DESISTENTE'
  | 'DESCLASSIFICADA'
export type CancellationRequestStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'
export type RegistrationWindowChangeType = 'PRORROGACAO' | 'REABERTURA'
export type Modalidade = 'SUMO' | 'FOLLOW_LINE'
export type SumoPhysicalClass = 'MINI_500G' | 'SUMO_3KG'
export type SumoControlMode = 'AUTONOMO' | 'RC'
export type RoundSumoStatus = 'FINALIZADO' | 'EMPATADO' | 'ANULADO' | 'CANCELADO'
export type RoundSumoOutcomeReason =
  | 'DISPUTA'
  | 'SUICIDIO_WO'
  | 'PENALIDADES'
  | 'FALHA_INICIALIZACAO'
  | 'DECISAO_JUIZ'

export interface UserAccount {
  id: number
  nome: string
  email: string
  telefone?: string
  role: UserRole
  ativo: boolean
  ultimoLogin?: string
  dataCadastro?: string
}

export interface AuthResponse {
  token: string
  tipo: 'Bearer' | string
  usuario: UserAccount
}

export interface Competition {
  id?: number
  nome: string
  descricao?: string
  inicioInscricoes: string
  fimInscricoes: string
  dataInicio: string
  dataFim: string
  status?: CompetitionStatus
  ativo?: boolean
  dataCadastro?: string
}

export interface CompetitionRegistrationWindowChange {
  id?: number
  competitionId: number
  competitionNome?: string
  tipo: RegistrationWindowChangeType
  dataFimAnterior: string
  novaDataFim: string
  motivo: string
  realizadoPorId?: number
  realizadoPorNome?: string
  dataCadastro?: string
}

export interface Category {
  id: number
  nome: string
  modalidade: Modalidade
  sumoPhysicalClass?: SumoPhysicalClass
  sumoControlMode?: SumoControlMode
  competitionId?: number
  ativo?: boolean
  [key: string]: unknown
}

export interface ConfigSumo {
  id?: number
  categoryId: number
  pesoMax: number
  exigeInspecao: boolean
  maxTentativasInspecao: number
  numeroRounds: number
  roundsParaVencer: number
  permiteRoundDesempate: boolean
  maxRoundsExtras: number
}

export interface ConfigFollow {
  id?: number
  competitionCategoryId: number
  numeroTomadas: number
  tentativasPorTomada: number
  maxTempoSegundos: number
  numeroCheckpoints: number
  penalidadePadraoSegundos: number
  tempoApresentacaoSegundos: number
}

export interface Registration {
  id: number
  competitionId: number
  competitionNome: string
  categoryId: number
  categoryNome: string
  teamId: number
  teamNome: string
  robotId: number
  robotNome: string
  competitorIds?: number[]
  competitorNomes?: string[]
  requestedByUserNome?: string
  reviewedByUserNome?: string
  reviewedAt?: string
  status: RegistrationStatus
  observacao?: string
  ativo?: boolean
  dataCadastro?: string
}

export interface RegistrationCancellationRequest {
  id: number
  registrationId: number
  competitionId: number
  competitionNome?: string
  teamNome?: string
  robotNome?: string
  requestedByUserId?: number
  requestedByUserNome?: string
  status: CancellationRequestStatus
  motivo: string
  reviewedByUserId?: number
  reviewedByUserNome?: string
  reviewedAt?: string
  resposta?: string
  dataCadastro?: string
}

export interface RankingItem {
  posicao?: number
  registrationId: number
  robotId?: number
  teamNome?: string
  robotNome?: string
  tempoBrutoSegundos?: number
  penalidadeSegundos?: number
  tempoFinalSegundos?: number
  tomada?: number
  numeroTentativa?: number
  [key: string]: unknown
}

export interface FollowAttempt {
  id: number
  registrationId: number
  competitionId?: number
  categoryId?: number
  teamNome?: string
  robotNome?: string
  tomada: number
  numeroTentativa: number
  tempoSegundos?: number
  checkpointsAlcancados: number
  penalidadeSegundos: number
  tempoFinalSegundos?: number
  concluida: boolean
  valida: boolean
  observacao?: string
  dataCadastro?: string
}

export interface FollowTakeAbsence {
  id: number
  registrationId: number
  competitionId?: number
  categoryId?: number
  teamNome?: string
  robotNome?: string
  tomada: number
  observacao?: string
  registradoPorId?: number
  registradoPorNome?: string
  dataCadastro?: string
}

export interface SumoInspection {
  id: number
  registrationId: number
  numeroTentativa?: number
  pesoMedido?: number
  aprovada: boolean
  observacao?: string
  registradoPorId?: number
  registradoPorNome?: string
  dataCadastro?: string
}

export interface CompetitionJudge {
  id: number
  competitionId: number
  nome: string
  userAccountId?: number
  ativo?: boolean
  dataCadastro?: string
}

export interface MatchJudgeDecision {
  id: number
  matchId: number
  winnerRegistrationId: number
  winnerRobotNome?: string
  judgeId: number
  judgeNome?: string
  justificativa: string
  dataCadastro?: string
}

export interface Bracket {
  id: number
  competitionId: number
  competitionNome?: string
  categoryId: number
  categoryNome?: string
  nome: string
  status?: string
  ativo?: boolean
  atual?: boolean
  dataCadastro?: string
}

export interface Match {
  id: number
  bracketId: number
  bracketNome?: string
  bracketAtual?: boolean
  bracketAtivo?: boolean
  competitionId?: number
  competitionNome?: string
  categoryId?: number
  categoryNome?: string
  rodada: number
  ordem: number
  registrationAId?: number
  robotAId?: number
  robotANome?: string
  teamANome?: string
  registrationBId?: number
  robotBId?: number
  robotBNome?: string
  teamBNome?: string
  dataHora?: string
  status?: string
  ativo?: boolean
  dataCadastro?: string
}

export interface MatchResult {
  id: number
  matchId: number
  winnerRegistrationId?: number
  winnerRobotNome?: string
  pontosA?: number
  pontosB?: number
  [key: string]: unknown
}

export interface RoundSumo {
  id: number
  matchId: number
  numeroRound: number
  winnerRegistrationId?: number
  winnerRobotNome?: string
  status: RoundSumoStatus
  motivoResultado?: RoundSumoOutcomeReason
  penalidadesA?: number
  penalidadesB?: number
  observacao?: string
  justificativa?: string
  dataCadastro?: string
}

export interface Team {
  id: number
  nome: string
  institutionId?: number
  institutionNome?: string
  ativo?: boolean
  [key: string]: unknown
}

export interface Robot {
  id: number
  nome: string
  descricao?: string
  teamId: number
  teamNome?: string
  ativo?: boolean
  [key: string]: unknown
}

export interface RobotImage {
  id: number
  robotId: number
  originalFilename: string
  contentType: string
  principal: boolean
  ordem: number
  url: string
  dataCadastro?: string
}

export interface Competitor {
  id: number
  nome: string
  email?: string
  telefone?: string
  teamId?: number
  [key: string]: unknown
}
