import { type Resolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { Mutation } from './mutations/mutations'
import { FragranceCollectionQuery, FragranceNotesQuery, FragranceQuery, FragranceReviewQuery, FragranceTraitsQuery, Query, UserQuery } from './queries/queries'

export const resolvers: Resolvers = {
  Mutation,
  Query,

  Fragrance: FragranceQuery,
  FragranceTraits: FragranceTraitsQuery,
  FragranceNotes: FragranceNotesQuery,
  FragranceCollection: FragranceCollectionQuery,
  FragranceReview: FragranceReviewQuery,

  User: UserQuery,

  Date: GraphQLDateTime
}

export default resolvers
