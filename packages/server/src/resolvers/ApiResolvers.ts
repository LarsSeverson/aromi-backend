import { AccordRequestFieldResolvers } from '@src/features/accordRequests/resolvers/AccordRequestFieldResolvers'
import { AccordRequestMutationResolvers } from '@src/features/accordRequests/resolvers/AccordRequestMutationResolvers'
import { AccordRequestQueryResolvers } from '@src/features/accordRequests/resolvers/AccordRequestQueryResolvers'
import { AccordQueryResolvers } from '@src/features/accords/resolvers/AccordQueryResolvers'
import { AuthMutationResolvers } from '@src/features/auth/resolvers/AuthMutationResolvers'
import { BrandRequestFieldResolvers } from '@src/features/brandRequests/resolvers/BrandRequestFieldResolvers'
import { BrandRequestMutationResolvers } from '@src/features/brandRequests/resolvers/BrandRequestMutationResolvers'
import { BrandRequestQueryResolvers } from '@src/features/brandRequests/resolvers/BrandRequestQueryResolvers'
import { FragranceRequestFieldResolvers } from '@src/features/fragranceRequests/resolvers/FragranceRequestFieldResolvers'
import { FragranceRequestMutationResolvers } from '@src/features/fragranceRequests/resolvers/FragranceRequestMutationResolvers'
import { FragranceRequestQueryResolvers } from '@src/features/fragranceRequests/resolvers/FragranceRequestQueryResolvers'
import { NoteRequestFieldResolvers } from '@src/features/noteRequests/resolvers/NoteRequestFieldResolvers'
import { NoteRequestMutationResolvers } from '@src/features/noteRequests/resolvers/NoteRequestMutationResolvers'
import { NoteRequestQueryResolvers } from '@src/features/noteRequests/resolvers/NoteRequestQueryResolvers'
import { NoteQueryResolvers } from '@src/features/notes/resolvers/NoteQueryResolvers'
import { UserFieldResolvers } from '@src/features/users/resolvers/UserFieldResolvers'
import { UserMutationResolvers } from '@src/features/users/resolvers/UserMutationResolvers'
import { UserQueryResolvers } from '@src/features/users/resolvers/UserQueryResolvers'
import { type Resolvers } from '@src/graphql/gql-types'
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
