import { type MutationResolvers } from '@src/generated/gql-types'

export const refresh: MutationResolvers['refresh'] = async (parent, args, context, info) => {
  const { req, services } = context
  const { auth } = services

  const old = req.cookies.refreshToken as (string | undefined)

  if (old == null) {
    return null
  }

  const result = await auth.refresh({ old })

  return result.match(
    (tokens) => {
      const { idToken, accessToken, expiresIn } = tokens
      const now = Math.floor(Date.now() / 1000)
      return { idToken, accessToken, expiresAt: now + expiresIn }
    },
    _ => null
  )
}
