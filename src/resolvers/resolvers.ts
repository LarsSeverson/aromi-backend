import { type QueryResolvers, type Resolvers, type UserResolvers as UserFieldResolvers, type FragranceResolvers as FragranceFieldResolvers, type FragranceNotesResolvers, type FragranceCollectionResolvers as CollectionFieldResolvers, type FragranceReviewResolvers, type MutationResolvers } from '@src/generated/gql-types'
import { GraphQLDateTime } from 'graphql-scalars'
import { FragranceResolver } from './fragranceResolver'
import { NoteResolver } from './noteResolver'
import { UserResolver } from './userResolver'
import { CollectionResolver } from './collectionResolver'
import { ReviewResolver } from './reviewResolvers'
import { AuthResolver } from './authResolver'

const authResolver = new AuthResolver()
const userResolver = new UserResolver()
const fragranceResolver = new FragranceResolver()
const noteResolver = new NoteResolver()
const collectionResolver = new CollectionResolver()
const reviewResolver = new ReviewResolver()

export class ApiResolvers implements Resolvers {
  Date = GraphQLDateTime

  Query: QueryResolvers = {
    me: userResolver.me,
    user: userResolver.user,

    fragrance: fragranceResolver.fragrance,
    fragrances: fragranceResolver.fragrances,

    collection: collectionResolver.collection
  }

  // User Field resolvers
  User: UserFieldResolvers = {
    collections: userResolver.userCollections,
    reviews: userResolver.userReviews,
    likes: userResolver.userLikes
  }

  // Collection Field resolvers
  FragranceCollection: CollectionFieldResolvers = {
    items: collectionResolver.collectionItems,
    user: collectionResolver.collectionUser
  }

  // Fragrance Field resolvers
  Fragrance: FragranceFieldResolvers = {
    traits: fragranceResolver.fragranceTraits,
    images: fragranceResolver.fragranceImages,
    accords: fragranceResolver.fragranceAccords,
    notes: fragranceResolver.fragranceNotes,
    reviews: fragranceResolver.fragranceReviews,
    reviewDistribution: fragranceResolver.fragranceReviewDistribution,
    myReview: fragranceResolver.myReview
  }

  // Fragrance Field Note resolvers
  FragranceNotes: FragranceNotesResolvers = {
    top: noteResolver.notes,
    middle: noteResolver.notes,
    base: noteResolver.notes
  }

  // Fragrance Field Review resolvers
  FragranceReview: FragranceReviewResolvers = {
    user: reviewResolver.reviewUser,
    fragrance: reviewResolver.reviewFragrance
  }

  Mutation?: MutationResolvers = {
    // Auth
    refresh: authResolver.refresh,
    logIn: authResolver.logIn,
    logOut: authResolver.logOut,
    signUp: authResolver.signUp,
    confirmSignUp: authResolver.confirmSignUp,
    forgotPassword: authResolver.forgotPassword,
    confirmForgotPassword: authResolver.confirmForgotPassword,
    resendSignUpConfirmationCode: authResolver.resendSignUpConfirmationCode,

    // Creation
    createFragranceReview: reviewResolver.createReview,
    createFragranceCollection: collectionResolver.createCollection,
    createFragranceCollectionItem: collectionResolver.createCollectionItem,

    // Voting
    voteOnFragrance: fragranceResolver.voteOnFragrance,
    voteOnTrait: fragranceResolver.voteOnTrait,
    voteOnAccord: fragranceResolver.voteOnAccord,
    voteOnNote: fragranceResolver.voteOnNote,
    voteOnReview: reviewResolver.voteOnReview
  }
}
