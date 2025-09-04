import { AccordRequestFieldResolvers } from '@src/server/features/accordRequests/resolvers/AccordRequestFieldResolvers'
import { AccordRequestMutationResolvers } from '@src/server/features/accordRequests/resolvers/AccordRequestMutationResolvers'
import { AccordRequestQueryResolvers } from '@src/server/features/accordRequests/resolvers/AccordRequestQueryResolvers'
import { AccordQueryResolvers } from '@src/server/features/accords/resolvers/AccordQueryResolvers'
import { AuthMutationResolvers } from '@src/server/features/auth/resolvers/AuthMutationResolvers'
import { BrandRequestFieldResolvers } from '@src/server/features/brandRequests/resolvers/BrandRequestFieldResolvers'
import { BrandRequestMutationResolvers } from '@src/server/features/brandRequests/resolvers/BrandRequestMutationResolvers'
import { BrandRequestQueryResolvers } from '@src/server/features/brandRequests/resolvers/BrandRequestQueryResolvers'
import { FragranceRequestFieldResolvers } from '@src/server/features/fragranceRequests/resolvers/FragranceRequestFieldResolvers'
import { FragranceRequestMutationResolvers } from '@src/server/features/fragranceRequests/resolvers/FragranceRequestMutationResolvers'
import { FragranceRequestQueryResolvers } from '@src/server/features/fragranceRequests/resolvers/FragranceRequestQueryResolvers'
import { NoteRequestFieldResolvers } from '@src/server/features/noteRequests/resolvers/NoteRequestFieldResolvers'
import { NoteRequestMutationResolvers } from '@src/server/features/noteRequests/resolvers/NoteRequestMutationResolvers'
import { NoteRequestQueryResolvers } from '@src/server/features/noteRequests/resolvers/NoteRequestQueryResolvers'
import { NoteQueryResolvers } from '@src/server/features/notes/resolvers/NoteQueryResolvers'
import { UserFieldResolvers } from '@src/server/features/users/resolvers/UserFieldResolvers'
import { UserMutationResolvers } from '@src/server/features/users/resolvers/UserMutationResolvers'
import { UserQueryResolvers } from '@src/server/features/users/resolvers/UserQueryResolvers'
import { type Resolvers } from '@src/generated/gql-types'
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'
import { BrandQueryResolvers } from '../features/brands/resolvers/BrandQueryResolvers'

const authMutations = new AuthMutationResolvers()

const userQueries = new UserQueryResolvers()
const userFieldQueries = new UserFieldResolvers()
const userMutations = new UserMutationResolvers()

const fragranceRequestQueries = new FragranceRequestQueryResolvers()
const fragranceRequestFieldResolvers = new FragranceRequestFieldResolvers()
const fragranceRequestMutations = new FragranceRequestMutationResolvers()

const brandRequestQueries = new BrandRequestQueryResolvers()
const brandRequestFieldResolvers = new BrandRequestFieldResolvers()
const brandRequestMutations = new BrandRequestMutationResolvers()

const accordRequestQueries = new AccordRequestQueryResolvers()
const accordRequestFieldResolvers = new AccordRequestFieldResolvers()
const accordRequestMutations = new AccordRequestMutationResolvers()

const noteRequestQueries = new NoteRequestQueryResolvers()
const noteRequestFieldResolvers = new NoteRequestFieldResolvers()
const noteRequestMutations = new NoteRequestMutationResolvers()

const brandQueries = new BrandQueryResolvers()

const accordQueries = new AccordQueryResolvers()

const noteQueries = new NoteQueryResolvers()

export const ApiResolvers: Resolvers = {
  Date: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    ...userQueries.getResolvers(),

    ...brandQueries.getResolvers(),

    ...accordQueries.getResolvers(),

    ...noteQueries.getResolvers(),

    ...fragranceRequestQueries.getResolvers(),

    ...brandRequestQueries.getResolvers(),

    ...accordRequestQueries.getResolvers(),

    ...noteRequestQueries.getResolvers()
  },

  Mutation: {
    ...authMutations.getResolvers(),

    ...userMutations.getResolvers(),

    ...fragranceRequestMutations.getResolvers(),

    ...brandRequestMutations.getResolvers(),

    ...accordRequestMutations.getResolvers(),

    ...noteRequestMutations.getResolvers()
  },

  User: {
    ...userFieldQueries.getResolvers()
  },

  FragranceRequest: {
    ...fragranceRequestFieldResolvers.getResolvers()
  },

  BrandRequest: {
    ...brandRequestFieldResolvers.getResolvers()
  },

  AccordRequest: {
    ...accordRequestFieldResolvers.getResolvers()
  },

  NoteRequest: {
    ...noteRequestFieldResolvers.getResolvers()
  }
}
