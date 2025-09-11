import type { ResultAsync } from 'neverthrow'
import { IS_APP_PRODUCTION, type BackendError, type UserRow } from '@aromi/shared'
import type { ServerContext } from './index.js'

export const getMyContext = (context: ServerContext): ResultAsync<UserRow, BackendError> => {
  const { req, services } = context

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')
  const devToken = IS_APP_PRODUCTION ? undefined : process.env.SERVER_DEV_AUTH_TOKEN

  if (devToken != null && token === devToken) {
    return services
      .users
      .findOne(
        eb => eb('id', '=', '5a10574b-908e-44f6-944e-9a292c9d1aeb')
      )
  }

  return services
    .auth
    .authenticateUser(token)
}
