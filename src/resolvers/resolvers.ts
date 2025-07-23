import { type QueryResolvers, type Resolvers, type UserResolvers as UserFieldResolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceNotesResolvers, type FragranceCollectionResolvers as CollectionFieldResolvers, type FragranceReviewResolvers, type MutationResolvers, type FragranceVoteResolvers as FragranceVoteFieldResolvers, type FragranceCollectionItemResolvers as FragranceCollectionItemFieldResolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { AuthResolver } from './authResolver'
import { UserResolver } from './userResolver'
import { FragranceResolver } from './fragranceResolver'
import { ReviewResolver } from './reviewResolvers'
import { CollectionResolver } from './collectionResolver'
import { FragranceVoteResolver } from './fragranceVoteResolver'
import { FragranceReportResolver } from './fragranceReportResolver'
import { ReviewReportResolver } from './reviewReportResolver'

const authResolver = new AuthResolver()
const userResolver = new UserResolver()
const fragranceResolver = new FragranceResolver()
const collectionResolver = new CollectionResolver()
const reviewResolver = new ReviewResolver()
const fragranceVoteResolver = new FragranceVoteResolver()
const reportResolver = new FragranceReportResolver()
const reviewReportResolver = new ReviewReportResolver()

export class ApiResolvers implements Resolvers {
  Date = GraphQLDateTime

  Query: QueryResolvers = {
    me: userResolver.me,
    user: userResolver.user,

    fragrance: fragranceResolver.fragrance,
    fragrances: fragranceResolver.fragrances,
    searchFragrances: fragranceResolver.searchFragrances,

    collection: collectionResolver.collection
  }

  // Fragrance Field resolvers
  Fragrance: FragranceFieldResolvers = {
    images: fragranceResolver.fragranceImages,

    traits: fragranceResolver.fragranceTraits,

    accords: fragranceResolver.fragranceAccords,
    fillerAccords: fragranceResolver.fillerFragranceAccords,

    notes: fragranceResolver.fragranceNotesParent,

    reviews: fragranceResolver.fragranceReviews,
    reviewDistribution: fragranceResolver.fragranceReviewDistribution,
    myReview: fragranceResolver.myReview
  }

  // Fragrance Field Note resolvers
  FragranceNotes: FragranceNotesResolvers = {
    top: fragranceResolver.fragranceNotes,
    fillerTop: fragranceResolver.fillerFragranceNotes,

    middle: fragranceResolver.fragranceNotes,
    fillerMiddle: fragranceResolver.fillerFragranceNotes,

    base: fragranceResolver.fragranceNotes,
    fillerBase: fragranceResolver.fillerFragranceNotes
  }

  // Fragrance Review Field resolvers
  FragranceReview: FragranceReviewResolvers = {
    user: reviewResolver.reviewUser,
    fragrance: reviewResolver.reviewFragrance
  }

  // User Field resolvers
  User: UserFieldResolvers = {
    collections: userResolver.userCollections,
    reviews: userResolver.userReviews,
    likes: userResolver.userLikes
  }

  // Collection Field resolvers
  FragranceCollection: CollectionFieldResolvers = {
    user: collectionResolver.collectionUser,
    items: collectionResolver.collectionItems,
    hasFragrance: collectionResolver.collectionHasFragrance
  }

  FragranceCollectionItem?: FragranceCollectionItemFieldResolvers = {
    fragrance: collectionResolver.itemFragrance
  }

  FragranceVote: FragranceVoteFieldResolvers = {
    user: fragranceVoteResolver.voteUser,
    fragrance: fragranceVoteResolver.voteFragrance
  }

  Mutation: MutationResolvers = {
    // Auth
    refresh: authResolver.refresh,
    logIn: authResolver.logIn,
    logOut: authResolver.logOut,
    signUp: authResolver.signUp,
    confirmSignUp: authResolver.confirmSignUp,
    forgotPassword: authResolver.forgotPassword,
    confirmForgotPassword: authResolver.confirmForgotPassword,
    resendSignUpConfirmationCode: authResolver.resendSignUpConfirmationCode,

    //   createFragranceReview: reviewResolver.createReview,

    createFragranceCollection: collectionResolver.createCollection,
    createFragranceCollectionItem: collectionResolver.createCollectionItem,
    moveFragranceCollectionItem: collectionResolver.moveCollectionItem,
    deleteFragranceCollectionItem: collectionResolver.deleteCollectionItem,

    createFragranceReport: reportResolver.createReport,
    createReviewReport: reviewReportResolver.createReport,
    //   createFragranceImage: fragranceResolver.createFragranceImage,
    //   confirmFragranceImage: fragranceResolver.confirmFragranceImage,

    //   // Voting
    voteOnFragrance: fragranceResolver.voteOnFragrance,
    voteOnTrait: fragranceResolver.voteOnTrait,
    //   voteOnAccord: fragranceResolver.voteOnAccord,
    //   voteOnNote: fragranceResolver.voteOnNote,
    voteOnReview: reviewResolver.voteOnReview

  //   logFragranceView: fragranceResolver.logFragranceView
  }
}
