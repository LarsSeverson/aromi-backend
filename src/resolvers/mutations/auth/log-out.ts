import { type MutationResolvers } from '@src/generated/gql-types'

export const logOut: MutationResolvers['logOut'] = async (parent, args, context, info) => {
  const { res, services } = context
  const { auth } = services

  const result = await auth.logOut()

  return result
    .match(
      () => {
        res.clearCookie('refreshToken', {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })

        return true
      },
      error => { throw error }
    )
}
