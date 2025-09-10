import type { ResultAsync } from 'neverthrow'
import type { BackendError, UserRow } from '@aromi/shared'
import type { ServerContext } from './index.js'

export const getMyContext = (context: ServerContext): ResultAsync<UserRow, BackendError> => {
  const { req, services } = context

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  return services
    .auth
    .authenticateUser(token)
}
