import { type MutationResolvers } from '@src/generated/gql-types'

export const confirmForgotPassword: MutationResolvers['confirmForgotPassword'] = async (parent, args, context, info) => {
  const { email, confirmationCode, newPassword } = args
  const { services } = context
  const { auth } = services

  const result = await auth.confirmForgotPassword({ email, confirmationCode, newPassword })

  return result
    .match(
      () => true,
      error => { throw error }
    )
}
