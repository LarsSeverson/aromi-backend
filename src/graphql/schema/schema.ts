import { gql } from 'apollo-server-lambda'

export const schema = gql`#graphql

type Fragrance {
  id: Int!
  brand: String!
  name: String!
  rating: Float!
  reviewsCount: Int!

  # Vote
  vote: FragranceVote!

  # Traits
  traits: FragranceTraits!

  # Characteristics
  notes: FragranceNotes!
  accords(limit: Int, offset: Int, fill: Boolean): [FragranceAccord!]!
  images(limit: Int, offset: Int): [FragranceImage!]!

  # Reviews
  reviews(limit: Int, offset: Int): [FragranceReview!]!
  myReview: FragranceReview
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
  myVote: Float # Current user's vote
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
  votes: Int!
  myVote: Boolean # Whether current user voted
}

type FragranceAccord {
  id: Int!
  accordId: Int!
  name: String!
  color: String!
  votes: Int!
  myVote: Boolean # Whether current user voted
}

type FragranceImage {
  id: Int!
  url: String! # Derived from s3Key
}

type FragranceReview {
  id: Int!
  rating: Float!
  review: String!
  votes: Int!
  dCreated: Date!
  dModified: Date!
  dDeleted: Date

  user: PublicUser!
  myVote: Boolean
}

type User {
  id: Int!
  username: String!
  email: String!

  cognitoId: String!
}

type PublicUser {
  id: Int!
  username: String!
}

type Query {
  # Get a single fragrance by its id
  fragrance(id: Int!): Fragrance

  # Get a list of fragrances (with pagination)
  fragrances(limit: Int, offset: Int): [Fragrance!]!

  # Get the current user
  me: User
}

type Mutation {
  # Get or create a user
  upsertUser(email: String!, cognitoId: String!): User

  # Voting
  voteOnFragrance(fragranceId: Int!, myVote: Boolean): FragranceVote
  voteOnTrait(fragranceId: Int!, trait: FragranceTraitType!, myVote: Float!): FragranceTrait
  voteOnAccord(fragranceId: Int!, accordId: Int!, myVote: Boolean!): FragranceAccord
  voteOnNote(fragranceId: Int!, noteId: Int!, layer: NoteLayer!, myVote: Boolean!): FragranceNote
  voteOnReview(reviewId: Int!, myVote: Boolean): FragranceReview

  # Reviews
  reviewFragrance(fragranceId: Int!, myRating: Float!, myReview: String!): FragranceReview
}

# Enums
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

# Scalars
scalar Date
`
