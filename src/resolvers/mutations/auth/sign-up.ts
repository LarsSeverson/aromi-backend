import { type MutationResolvers } from '@src/generated/gql-types'

export const signUp: MutationResolvers['signUp'] = async (parent, args, context, info) => {
  const { email, password } = args
  const { services } = context
  const { auth } = services

  const result = await auth.signUp({ email, password })

  return result
    .match(
      cogOutput => {
        const { UserConfirmed, CodeDeliveryDetails } = cogOutput
        const complete = UserConfirmed ?? false
        const delivery = CodeDeliveryDetails != null
          ? {
              attribute: CodeDeliveryDetails.AttributeName,
              destination: CodeDeliveryDetails.Destination,
              method: CodeDeliveryDetails.DeliveryMedium
            }
          : undefined

        return {
          complete,
          delivery
        }
      },
      error => { throw error }
    )
}
