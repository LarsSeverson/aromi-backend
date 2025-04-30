import { type MutationResolvers } from '@src/generated/gql-types'

export const logOut: MutationResolvers['logOut'] = (parent, args, context, info) => {
  const { res } = context

  res.clearCookie('refreshToken', {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  return true
}
