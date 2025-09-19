import type { Resolvers } from '@src/graphql/gql-types.js'
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'
import { AuthMutationResolvers } from '@src/features/auth/index.js'
import { UserFieldResolvers, UserMutationResolvers, UserQueryResolvers } from '@src/features/users/index.js'
import { BrandEditFieldResolvers, BrandFieldResolvers, BrandMutationResolvers, BrandQueryResolvers } from '@src/features/brands/index.js'
import { AccordEditFieldResolvers, AccordMutationResolvers, AccordQueryResolvers } from '@src/features/accords/index.js'
import { NoteEditFieldResolvers, NoteFieldResolvers, NoteMutationResolvers, NoteQueryResolvers } from '@src/features/notes/index.js'
import { FragranceRequestFieldResolvers, FragranceRequestMutationResolvers, FragranceRequestQueryResolvers } from '@src/features/fragranceRequests/index.js'
import { BrandRequestFieldResolvers, BrandRequestMutationResolvers, BrandRequestQueryResolvers } from '@src/features/brandRequests/index.js'
import { AccordRequestFieldResolvers, AccordRequestMutationResolvers, AccordRequestQueryResolvers } from '@src/features/accordRequests/index.js'
import { NoteRequestFieldResolvers, NoteRequestMutationResolvers, NoteRequestQueryResolvers } from '@src/features/noteRequests/index.js'
import { FragranceQueryResolvers, FragranceFieldResolvers, FragranceMutationResolvers, FragranceEditFieldResolvers } from '@src/features/fragrances/index.js'
import { AssetFieldResolvers, AssetMutationResolvers } from '@src/features/assets/index.js'

const authMutations = new AuthMutationResolvers()
const assetMutations = new AssetMutationResolvers()
const assetFieldResolvers = new AssetFieldResolvers()

const userQueries = new UserQueryResolvers()
const userFieldQueries = new UserFieldResolvers()
const userMutations = new UserMutationResolvers()

const fragranceQueries = new FragranceQueryResolvers()
const fragranceFieldResolvers = new FragranceFieldResolvers()
const fragranceMutations = new FragranceMutationResolvers()
const fragranceEditFieldResolvers = new FragranceEditFieldResolvers()

const brandQueries = new BrandQueryResolvers()
const brandMutations = new BrandMutationResolvers()
const brandFieldResolvers = new BrandFieldResolvers()
const brandEditFieldResolvers = new BrandEditFieldResolvers()

const accordQueries = new AccordQueryResolvers()
const accordMutations = new AccordMutationResolvers()
const accordEditFieldResolvers = new AccordEditFieldResolvers()

const noteQueries = new NoteQueryResolvers()
const noteMutations = new NoteMutationResolvers()
const noteFieldResolvers = new NoteFieldResolvers()
const noteEditFieldResolvers = new NoteEditFieldResolvers()

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

export const ApiResolvers: Resolvers = {
  Date: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    ...userQueries.getResolvers(),

    ...fragranceQueries.getResolvers(),

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
    ...assetMutations.getResolvers(),

    ...userMutations.getResolvers(),

    ...fragranceMutations.getResolvers(),

    ...brandMutations.getResolvers(),

    ...accordMutations.getResolvers(),

    ...noteMutations.getResolvers(),

    ...fragranceRequestMutations.getResolvers(),

    ...brandRequestMutations.getResolvers(),

    ...accordRequestMutations.getResolvers(),

    ...noteRequestMutations.getResolvers()
  },

  Asset: {
    ...assetFieldResolvers.getResolvers()
  },

  User: {
    ...userFieldQueries.getResolvers()
  },

  Fragrance: {
    ...fragranceFieldResolvers.getResolvers()
  },

  FragranceEdit: {
    ...fragranceEditFieldResolvers.getResolvers()
  },

  Brand: {
    ...brandFieldResolvers.getResolvers()
  },

  BrandEdit: {
    ...brandEditFieldResolvers.getResolvers()
  },

  AccordEdit: {
    ...accordEditFieldResolvers.getResolvers()
  },

  Note: {
    ...noteFieldResolvers.getResolvers()
  },

  NoteEdit: {
    ...noteEditFieldResolvers.getResolvers()
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
