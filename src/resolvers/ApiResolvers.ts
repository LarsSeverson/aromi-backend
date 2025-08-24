import { AccordQueryResolvers } from '@src/features/accords/resolvers/AccordQueryResolvers'
import { AuthMutationResolvers } from '@src/features/auth/resolvers/AuthMutationResolvers'
import { FragranceDraftMutationResolvers } from '@src/features/fragrances/resolvers/FragranceDraftMutationResolvers'
import { NoteQueryResolvers } from '@src/features/notes/resolvers/NoteQueryResolvers'
import { UserMutationResolvers } from '@src/features/users/resolvers/UserMutationResolvers'
import { UserQueryResolvers } from '@src/features/users/resolvers/UserQueryResolvers'
import { type Resolvers } from '@src/generated/gql-types'
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'

const authMutations = new AuthMutationResolvers()

const userQueries = new UserQueryResolvers()
const userMutations = new UserMutationResolvers()

const fragranceDraftMutations = new FragranceDraftMutationResolvers()

const accordQueries = new AccordQueryResolvers()

const noteQueries = new NoteQueryResolvers()

export const ApiResolvers: Resolvers = {
  Date: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    ...userQueries.getResolvers(),
    ...accordQueries.getResolvers(),
    ...noteQueries.getResolvers()
  },

  Mutation: {
    ...authMutations.getResolvers(),
    ...userMutations.getResolvers(),
    ...fragranceDraftMutations.getResolvers()
  }
}
