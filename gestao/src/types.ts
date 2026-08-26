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
  | 'DESCLASSIFICADA'
export type Modalidade = 'SUMO' | 'FOLLOW_LINE'
export type RoundSumoStatus = 'FINALIZADO' | 'EMPATADO' | 'ANULADO' | 'CANCELADO'
export type RoundSumoOutcomeReason = 'DISPUTA' | 'SUICIDIO_WO'

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

export interface Category {
  id: number
  nome: string
  modalidade: Modalidade
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
}

export interface ConfigFollow {
  id?: number
  competitionCategoryId: number
  numeroTomadas: number
  tentativasPorTomada: number
  maxTempoSegundos: number
  numeroCheckpoints: number
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

export interface Competitor {
  id: number
  nome: string
  email?: string
  telefone?: string
  teamId?: number
  [key: string]: unknown
}
