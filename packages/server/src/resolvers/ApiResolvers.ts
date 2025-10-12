import type { Resolvers } from '@src/graphql/gql-types.js'
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'
import { AuthMutationResolvers } from '@src/features/auth/index.js'
import { UserFieldResolvers, UserMutationResolvers, UserQueryResolvers } from '@src/features/users/index.js'
import { BrandEditFieldResolvers, BrandFieldResolvers, BrandMutationResolvers, BrandQueryResolvers, BrandRequestFieldResolvers } from '@src/features/brands/index.js'
import { AccordEditFieldResolvers, AccordMutationResolvers, AccordQueryResolvers, AccordRequestFieldResolvers } from '@src/features/accords/index.js'
import { NoteEditFieldResolvers, NoteFieldResolvers, NoteMutationResolvers, NoteQueryResolvers, NoteRequestFieldResolvers } from '@src/features/notes/index.js'
import { FragranceQueryResolvers, FragranceFieldResolvers, FragranceMutationResolvers, FragranceEditFieldResolvers, FragranceRequestFieldResolvers, FragranceCollectionFieldResolvers, FragranceCollectionItemFieldResolvers, FragranceReviewFieldResolvers } from '@src/features/fragrances/index.js'
import { AssetFieldResolvers, AssetMutationResolvers } from '@src/features/assets/index.js'

const authMutations = new AuthMutationResolvers()
const assetMutations = new AssetMutationResolvers()
const assetFieldResolvers = new AssetFieldResolvers()

const userQueries = new UserQueryResolvers()
const userFieldQueries = new UserFieldResolvers()
const userMutations = new UserMutationResolvers()

const fragranceQueries = new FragranceQueryResolvers()
const fragranceFieldResolvers = new FragranceFieldResolvers()
const fragranceCollectionFieldResolvers = new FragranceCollectionFieldResolvers()
const fragranceCollectionItemFieldResolvers = new FragranceCollectionItemFieldResolvers()
const fragranceReviewFieldResolvers = new FragranceReviewFieldResolvers()
const fragranceMutations = new FragranceMutationResolvers()
const fragranceEditFieldResolvers = new FragranceEditFieldResolvers()
const fragranceRequestFieldResolvers = new FragranceRequestFieldResolvers()

const brandQueries = new BrandQueryResolvers()
const brandMutations = new BrandMutationResolvers()
const brandFieldResolvers = new BrandFieldResolvers()
const brandEditFieldResolvers = new BrandEditFieldResolvers()
const brandRequestFieldResolvers = new BrandRequestFieldResolvers()

const accordQueries = new AccordQueryResolvers()
const accordMutations = new AccordMutationResolvers()
const accordEditFieldResolvers = new AccordEditFieldResolvers()
const accordRequestFieldResolvers = new AccordRequestFieldResolvers()

const noteQueries = new NoteQueryResolvers()
const noteMutations = new NoteMutationResolvers()
const noteFieldResolvers = new NoteFieldResolvers()
const noteEditFieldResolvers = new NoteEditFieldResolvers()
const noteRequestFieldResolvers = new NoteRequestFieldResolvers()

export const ApiResolvers: Resolvers = {
  Date: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    ...userQueries.getResolvers(),

    ...fragranceQueries.getResolvers(),

    ...brandQueries.getResolvers(),

    ...accordQueries.getResolvers(),

    ...noteQueries.getResolvers()
  },

  Mutation: {
    ...authMutations.getResolvers(),
    ...assetMutations.getResolvers(),

    ...userMutations.getResolvers(),

    ...fragranceMutations.getResolvers(),

    ...brandMutations.getResolvers(),

    ...accordMutations.getResolvers(),

    ...noteMutations.getResolvers()
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
  FragranceCollection: {
    ...fragranceCollectionFieldResolvers.getResolvers()
  },
  FragranceCollectionItem: {
    ...fragranceCollectionItemFieldResolvers.getResolvers()
  },
  FragranceReview: {
    ...fragranceReviewFieldResolvers.getResolvers()
  },
  FragranceEdit: {
    ...fragranceEditFieldResolvers.getResolvers()
  },
  FragranceRequest: {
    ...fragranceRequestFieldResolvers.getResolvers()
  },

  Brand: {
    ...brandFieldResolvers.getResolvers()
  },
  BrandEdit: {
    ...brandEditFieldResolvers.getResolvers()
  },
  BrandRequest: {
    ...brandRequestFieldResolvers.getResolvers()
  },

  AccordEdit: {
    ...accordEditFieldResolvers.getResolvers()
  },
  AccordRequest: {
    ...accordRequestFieldResolvers.getResolvers()
  },

  Note: {
    ...noteFieldResolvers.getResolvers()
  },
  NoteEdit: {
    ...noteEditFieldResolvers.getResolvers()
  },
  NoteRequest: {
    ...noteRequestFieldResolvers.getResolvers()
  }
}
