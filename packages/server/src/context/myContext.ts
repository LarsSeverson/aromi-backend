import type { ResultAsync } from 'neverthrow'
import type { ApiError, UserRow } from '@aromi/shared'
import type { ServerContext } from './index.js'

export const getMyContext = (context: ServerContext): ResultAsync<UserRow, ApiError> => {
  const { req, services } = context

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  return services
    .auth
    .authenticateUser(token)
}
