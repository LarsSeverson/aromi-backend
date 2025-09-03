import { type ResultAsync } from 'neverthrow'
import { type ApiContext } from '.'
import { type ApiError } from '@src/common/error'
import { type UserRow } from '@src/server/features/users/types'

export const getMyContext = (context: ApiContext): ResultAsync<UserRow, ApiError> => {
  const { req, services } = context

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  return services
    .auth
    .authenticateMe(token)
}
