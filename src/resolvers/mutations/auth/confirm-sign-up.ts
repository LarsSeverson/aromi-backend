import { type MutationResolvers } from '@src/generated/gql-types'

export const confirmSignUp: MutationResolvers['confirmSignUp'] = async (parent, args, context, info) => {
  const { email, confirmationCode } = args
  const { services } = context
  const { auth } = services

  const result = await auth.confirmSignUp({ email, confirmationCode })

  return result
    .match(
      _ => true,
      error => { throw error }
    )
}
