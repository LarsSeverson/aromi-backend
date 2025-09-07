import { type ResultAsync } from 'neverthrow'
import { type ServerContext } from '.'
import { type ApiError } from '@aromi/shared/utils/error'
import { type UserRow } from '@aromi/shared/db/features/users/types'

export const getMyContext = (context: ServerContext): ResultAsync<UserRow, ApiError> => {
  const { req, services } = context

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  return services
    .auth
    .authenticateMe(token)
}
