import { type MutationResolvers } from '@src/generated/gql-types'

export const resendSignUpConfirmationCode: MutationResolvers['resendSignUpConfirmationCode'] = async (parent, args, context, info) => {
  const { email } = args
  const { services } = context
  const { auth } = services

  const result = await auth.resendSignUpConfirmationCode({ email })

  return result
    .match(
      _ => true,
      error => { throw error }
    )
}
