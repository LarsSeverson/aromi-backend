import { ApiError } from '@src/common/error'
import { type MutationResolvers } from '@src/generated/gql-types'

export const refresh: MutationResolvers['refresh'] = async (parent, args, context, info) => {
  const { req, res, services } = context
  const { auth } = services

  const old = req.cookies.refreshToken as (string | undefined)

  if (old == null) {
    throw new ApiError('NOT_AUTHORIZED', 'No refresh token provided', 401)
  }

  const result = await auth.refresh({ old })

  return result.match(
    (tokens) => {
      const { idToken, accessToken, refreshToken, expiresIn } = tokens
      const now = Math.floor(Date.now() / 1000)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 90 * 24 * 60 * 60 // 90 days
      })

      return { idToken, accessToken, expiresAt: now + expiresIn }
    },
    error => { throw error }
  )
}
