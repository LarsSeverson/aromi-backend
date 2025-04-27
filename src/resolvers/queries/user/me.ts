import { type QueryResolvers } from '@src/generated/gql-types'

export const me: QueryResolvers['me'] = (parent, args, context, info) => {
  return context.me ?? null
}
