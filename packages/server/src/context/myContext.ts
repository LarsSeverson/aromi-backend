import { type ResultAsync } from 'neverthrow'
import { type ServerContext } from '.'
import { type ApiError, type UserRow } from '@aromi/shared'

export const getMyContext = (context: ServerContext): ResultAsync<UserRow, ApiError> => {
  const { req, services } = context

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  return services
    .auth
    .authenticateUser(token)
}
