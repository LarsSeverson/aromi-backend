import type { Resolvers } from '@src/graphql/gql-types.js'
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'
import { AuthMutationResolvers } from '@src/features/auth/index.js'
import { UserFieldResolvers, UserFollowFieldResolvers, UserMutationResolvers, UserQueryResolvers } from '@src/features/users/index.js'
import { BrandEditFieldResolvers, BrandFieldResolvers, BrandMutationResolvers, BrandQueryResolvers, BrandRequestFieldResolvers } from '@src/features/brands/index.js'
import { AccordEditFieldResolvers, AccordMutationResolvers, AccordQueryResolvers, AccordRequestFieldResolvers } from '@src/features/accords/index.js'
import { NoteEditFieldResolvers, NoteFieldResolvers, NoteMutationResolvers, NoteQueryResolvers, NoteRequestFieldResolvers } from '@src/features/notes/index.js'
import { FragranceQueryResolvers, FragranceFieldResolvers, FragranceMutationResolvers, FragranceEditFieldResolvers, FragranceRequestFieldResolvers, FragranceCollectionFieldResolvers, FragranceCollectionItemFieldResolvers, FragranceReviewFieldResolvers, FragranceImageFieldResolvers, FragranceVoteFieldResolvers, FragranceTraitFieldResolvers, FragranceTraitOptionFieldResolvers } from '@src/features/fragrances/index.js'
import { AssetFieldResolvers, AssetMutationResolvers } from '@src/features/assets/index.js'
import { HealthQueryResolvers } from '@src/features/health/index.js'
import { PostAssetFieldResolvers, PostCommentAssetFieldResolvers, PostCommentFieldResolvers, PostFieldResolvers, PostMutationResolvers, PostQueryResolvers } from '@src/features/posts/index.js'

const healthQueries = new HealthQueryResolvers()

const authMutations = new AuthMutationResolvers()
const assetMutations = new AssetMutationResolvers()
const assetFieldResolvers = new AssetFieldResolvers()

const userQueries = new UserQueryResolvers()
const userFieldQueries = new UserFieldResolvers()
const userFollowFieldResolvers = new UserFollowFieldResolvers()
const userMutations = new UserMutationResolvers()

const fragranceQueries = new FragranceQueryResolvers()
const fragranceFieldResolvers = new FragranceFieldResolvers()
const fragranceImageFieldResolvers = new FragranceImageFieldResolvers()
const fragranceCollectionFieldResolvers = new FragranceCollectionFieldResolvers()
const fragranceCollectionItemFieldResolvers = new FragranceCollectionItemFieldResolvers()
const fragranceReviewFieldResolvers = new FragranceReviewFieldResolvers()
const fragranceMutations = new FragranceMutationResolvers()
const fragranceEditFieldResolvers = new FragranceEditFieldResolvers()
const fragranceRequestFieldResolvers = new FragranceRequestFieldResolvers()
const fragranceVoteFieldResolvers = new FragranceVoteFieldResolvers()
const fragranceTraitFieldResolvers = new FragranceTraitFieldResolvers()
const fragranceTraitOptionFieldResolvers = new FragranceTraitOptionFieldResolvers()

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

const postQueries = new PostQueryResolvers()
const postMutations = new PostMutationResolvers()
const postFieldResolvers = new PostFieldResolvers()
const postAssetFieldResolvers = new PostAssetFieldResolvers()

const postCommentFieldResolvers = new PostCommentFieldResolvers()
const postCommentAssetFieldResolvers = new PostCommentAssetFieldResolvers()

export const ApiResolvers: Resolvers = {
  Date: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    ...healthQueries.getResolvers(),

    ...userQueries.getResolvers(),

    ...fragranceQueries.getResolvers(),

    ...brandQueries.getResolvers(),

    ...accordQueries.getResolvers(),

    ...noteQueries.getResolvers(),

    ...postQueries.getResolvers()
  },

  Mutation: {
    ...authMutations.getResolvers(),
    ...assetMutations.getResolvers(),

    ...userMutations.getResolvers(),

    ...fragranceMutations.getResolvers(),

    ...brandMutations.getResolvers(),

    ...accordMutations.getResolvers(),

    ...noteMutations.getResolvers(),

    ...postMutations.getResolvers()
  },

  Asset: assetFieldResolvers.getResolvers(),

  User: userFieldQueries.getResolvers(),

  UserFollow: userFollowFieldResolvers.getResolvers(),

  Fragrance: fragranceFieldResolvers.getResolvers(),

  FragranceImage: fragranceImageFieldResolvers.getResolvers(),

  FragranceVote: fragranceVoteFieldResolvers.getResolvers(),

  FragranceCollection: fragranceCollectionFieldResolvers.getResolvers(),

  FragranceCollectionItem: fragranceCollectionItemFieldResolvers.getResolvers(),

  FragranceReview: fragranceReviewFieldResolvers.getResolvers(),

  FragranceEdit: fragranceEditFieldResolvers.getResolvers(),

  FragranceRequest: fragranceRequestFieldResolvers.getResolvers(),

  FragranceTrait: fragranceTraitFieldResolvers.getResolvers(),

  FragranceTraitOption: fragranceTraitOptionFieldResolvers.getResolvers(),

  Brand: brandFieldResolvers.getResolvers(),

  BrandEdit: brandEditFieldResolvers.getResolvers(),

  BrandRequest: brandRequestFieldResolvers.getResolvers(),

  AccordEdit: accordEditFieldResolvers.getResolvers(),

  AccordRequest: accordRequestFieldResolvers.getResolvers(),

  Note: noteFieldResolvers.getResolvers(),

  NoteEdit: noteEditFieldResolvers.getResolvers(),

  NoteRequest: noteRequestFieldResolvers.getResolvers(),

  Post: postFieldResolvers.getResolvers(),

  PostAsset: postAssetFieldResolvers.getResolvers(),

  PostComment: postCommentFieldResolvers.getResolvers(),

  PostCommentAsset: postCommentAssetFieldResolvers.getResolvers()
}
