import { adminFollowApi } from './api/admin/follow'
import { adminSumoApi } from './api/admin/sumo'
import { adminCompetitionApi } from './api/admin/competition'
import { adminRegistrationApi } from './api/admin/registration'
import { adminCatalogApi } from './api/admin/catalog'
import { adminAgendaApi } from './api/admin/agenda'
import { adminResultsApi } from './api/admin/results'

export { API_URL, assetUrl, AUTH_UNAUTHORIZED_EVENT, http } from './api/http'
export { authApi } from './api/auth'

export { publicApi } from './api/public'
export { participantApi } from './api/participant'

export const adminApi = {
  ...adminCompetitionApi,
  ...adminRegistrationApi,
  ...adminCatalogApi,
  ...adminAgendaApi,
  ...adminResultsApi,
  ...adminFollowApi,
  ...adminSumoApi
}
