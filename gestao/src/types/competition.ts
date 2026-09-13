export type CompetitionStatus =
  | 'PLANEJADA'
  | 'INSCRICOES_ABERTAS'
  | 'INSCRICOES_ENCERRADAS'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA'

export type RegistrationWindowChangeType = 'PRORROGACAO' | 'REABERTURA'
export type Modalidade = 'SUMO' | 'FOLLOW_LINE'
export type SumoPhysicalClass = 'MINI_500G' | 'SUMO_3KG'
export type SumoControlMode = 'AUTONOMO' | 'RC'

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
