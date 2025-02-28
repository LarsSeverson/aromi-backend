import { gql } from 'apollo-server-lambda'

export const schema = gql`#graphql

type Fragrance {
  id: Int!
  brand: String!
  name: String!
  rating: Float!
  reviewsCount: Int!

  vote: FragranceVote!

  traits: FragranceTraits!

  notes: FragranceNotes!
  accords(limit: Int, offset: Int, fill: Boolean): [FragranceAccord!]!
  images(limit: Int, offset: Int): [FragranceImage!]!

  reviews(limit: Int, offset: Int): [FragranceReview!]!
  myReview: FragranceReview
  reviewDistribution: FragranceReviewDistribution!
}

type FragranceVote {
  id: Int!
  likes: Int!
  dislikes: Int!
  myVote: Boolean
}

type FragranceTraits {
  gender: FragranceTrait!
  longevity: FragranceTrait!
  sillage: FragranceTrait!
  complexity: FragranceTrait!
  balance: FragranceTrait!
  allure: FragranceTrait!
}

type FragranceTrait {
  id: Int!
  trait: FragranceTraitType!
  value: Float!
  myVote: Float
}

type FragranceNotes {
  top(limit: Int, offset: Int, fill: Boolean): [FragranceNote!]!
  middle(limit: Int, offset: Int, fill: Boolean): [FragranceNote!]!
  base(limit: Int, offset: Int, fill: Boolean): [FragranceNote!]!
}

type FragranceNote {
  id: Int!
  noteId: Int!
  name: String!
  layer: NoteLayer!
  icon: String!
  votes: Int!
  myVote: Boolean 
}

type FragranceAccord {
  id: Int!
  accordId: Int!
  name: String!
  color: String!
  votes: Int!
  myVote: Boolean
}

type FragranceImage {
  id: Int!
  url: String!
}

type FragranceReview {
  id: Int!
  rating: Int!
  review: String!
  votes: Int!
  dCreated: Date!
  dModified: Date!
  dDeleted: Date

  author: String!
  myVote: Boolean
}

# This may be handled a better way
type FragranceReviewDistribution {
  one: Int!
  two: Int!
  three: Int!
  four: Int!
  five: Int!
}

type FragranceCollection {
  id: Int!
  name: String!
  fragrances(limit: Int, offset: Int): [Fragrance!]!
  user: User!
}

type User {
  id: Int!
  username: String!
  email: String!
  cognitoId: String!

  followers: Int!
  following: Int!

  collections(limit: Int, offset: Int): [FragranceCollection!]!
  reviews(limit: Int, offset: Int): [FragranceReview!]!
  likes(limit: Int, offset: Int): [Fragrance!]!
}

type Query {
  fragrance(id: Int!): Fragrance

  fragrances(limit: Int, offset: Int): [Fragrance!]

  me: User

  user(id: Int!): User
}

type Mutation {
  upsertUser(email: String!, cognitoId: String!): User

  # Voting
  voteOnFragrance(fragranceId: Int!, myVote: Boolean): FragranceVote
  voteOnTrait(fragranceId: Int!, trait: FragranceTraitType!, myVote: Float!): FragranceTrait
  voteOnAccord(fragranceId: Int!, accordId: Int!, myVote: Boolean!): FragranceAccord
  voteOnNote(fragranceId: Int!, noteId: Int!, layer: NoteLayer!, myVote: Boolean!): FragranceNote
  voteOnReview(reviewId: Int!, myVote: Boolean): FragranceReview

  reviewFragrance(fragranceId: Int!, myRating: Int!, myReview: String!): FragranceReview
}

enum FragranceTraitType {
  gender
  longevity
  sillage
  complexity
  balance
  allure
}
enum NoteLayer {
  top
  middle
  base
}

scalar Date
`
