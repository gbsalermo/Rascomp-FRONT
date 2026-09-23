export interface Team {
  id: number
  nome: string
  institutionId?: number
  institutionNome?: string
  responsibleUserId?: number
  responsibleUserNome?: string
  responsibleUserEmail?: string
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
  teamNome?: string
  institutionId?: number
  institutionNome?: string
  institutionSigla?: string
  userAccountId?: number
  userAccountNome?: string
  ativo?: boolean
  dataCadastro?: string
  [key: string]: unknown
}

export interface CompetitionAdminCatalog {
  competitionId: number
  teams: Team[]
  competitors: Competitor[]
  robots: Robot[]
}
