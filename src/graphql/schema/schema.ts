import { gql } from 'apollo-server-lambda'

export const schema = gql`#graphql
  
type Fragrance {
  id: Int!
  brand: String!
  name: String!

  # Reactions
  reactions: FragranceReactions!

  # Traits
  traits: FragranceTraits!

  # Characteristics
  notes: FragranceNotes!
  accords(limit: Int, offset: Int, fill: Boolean): [FragranceAccord!]!
  images(limit: Int, offset: Int): [FragranceImage!]!

  # User-specific
  myReactions: MyFragranceReactions!
}

type FragranceReactions {
  likes: Int!
  dislikes: Int!
  reviews: Int!
}

type FragranceReaction {
  reaction: FragranceReactionType!
  myReaction: Boolean!
}

type MyFragranceReactions {
  like: Boolean!
  dislike: Boolean!
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
  trait: FragranceTraitType!
  value: Float!
  myVote: Float! # Current user's vote
}

type FragranceNotes {
  top(limit: Int, offset: Int, fill: Boolean): [FragranceNote!]!
  middle(limit: Int, offset: Int, fill: Boolean): [FragranceNote!]!
  base(limit: Int, offset: Int, fill: Boolean): [FragranceNote!]!
}

type FragranceNote {
  id: Int!
  name: String!
  layer: NoteLayer!
  votes: Int!
  myVote: Boolean! # Whether current user voted
}

type FragranceAccord {
  id: Int!
  name: String!
  color: String!
  votes: Int!
  myVote: Boolean! # Whether current user voted
}

type FragranceImage {
  id: Int!
  url: String! # Derived from s3Key
}

type User {
  id: Int!
  username: String!
  email: String!

  cognitoId: String!
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

  # Reactions
  reactToFragrance(fragranceId: Int!, reaction: FragranceReactionType!, myReaction: Boolean!): FragranceReaction

  # Voting
  voteOnTrait(fragranceId: Int!, trait: FragranceTraitType!, myVote: Float!): FragranceTrait
  voteOnAccord(fragranceId: Int!, accordId: Int!, myVote: Boolean!): FragranceAccord
  voteOnNote(fragranceId: Int!, noteId: Int!, layer: NoteLayer!, myVote: Boolean!): FragranceNote
}

# Enums
enum FragranceReactionType {
  like
  dislike
  review
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
`
