import { type MutationResolvers } from '@src/generated/gql-types'

export const forgotPassword: MutationResolvers['forgotPassword'] = async (parent, args, context, info) => {
  const { email } = args
  const { services } = context
  const { auth } = services

  const result = await auth.forgotPassword({ email })

  return result
    .match(
      () => true,
      error => { throw error }
    )
}
