import { IS_APP_PRODUCTION } from '@aromi/shared'
import type { ServerContext } from './index.js'

export const getMyContext = (context: ServerContext) => {
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
      .map(user => ({ user, accessToken: token }))
  }

  return services
    .auth
    .authenticateUser(token)
    .map(user => ({ user, accessToken: token }))
}
