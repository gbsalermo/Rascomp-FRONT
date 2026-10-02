export type { UserRole, InternalUserRole, InternalUserCreatePayload, UserAccount, AuthResponse, AuthCapability } from './types/auth'
export type {
  CompetitionStatus,
  RegistrationWindowChangeType,
  Modalidade,
  SumoPhysicalClass,
  SumoControlMode,
  Competition,
  CompetitionRegistrationWindowChange,
  Category,
  ConfigSumo,
  ConfigFollow
} from './types/competition'
export type { RankingItem, FollowAttempt, FollowTakeAbsence } from './types/follow'
export type {
  MatchCallStatus,
  RoundSumoStatus,
  RoundSumoOutcomeReason,
  SumoInspection,
  CompetitionJudge,
  MatchJudgeDecision,
  Bracket,
  Match,
  MatchResult,
  RoundSumo
} from './types/sumo'
export type {
  RegistrationStatus,
  CancellationRequestStatus,
  RegistrationStatusChangeType,
  Registration,
  RegistrationCancellationRequest,
  RegistrationStatusHistory,
  ParticipantCompetitionRegistrationStatus,
  ParticipantRobotLink,
  ParticipantCompetitionRegistration,
  RegistrationCompetitorContext,
  RegistrationCompetitorChangeType,
  RegistrationCompetitorChangeStatus,
  RegistrationCompetitorChange,
  TeamLeadershipHistory
} from './types/registration'
export type { Team, Robot, RobotImage, Competitor, CompetitionAdminCatalog } from './types/catalog'

export type {
  FollowScheduleStatus,
  FollowCallStatus,
  FollowTakeSchedule,
  FollowTakeScheduleEntry,
  AgendaActivity
} from './types/agenda'
export type { CompetitionCategoryResult } from './types/results'

export type { TeamMembershipRequestType, TeamMembershipStatus, TeamMembershipRequest, RobotResponsible } from './types/participant'
