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
  accords(limit: Int, offset: Int): [FragranceAccord]!
  images(limit: Int, offset: Int): [FragranceImage!]!

  # User-specific
  myReactions: FragranceReactions!
}

type FragranceReactions {
  likes: Int!
  dislikes: Int!
  reviews: Int!
}

type FragranceTraits {
  gender: FragranceTrait!
  longevity: FragranceTrait!
  sillage: FragranceTrait!
  complexity: FragranceTrait!
  balance: FragranceTrait!
  allure: FragranceTrait!
}

type FragranceNotes {
  top(limit: Int, offset: Int): [FragranceNote!]!
  middle(limit: Int, offset: Int): [FragranceNote!]!
  base(limit: Int, offset: Int): [FragranceNote!]!
}

type FragranceTrait {
  trait: FragranceTraitType!
  value: Float!
  myVote: Float # Current user's vote
}

type FragranceAccord {
  id: Int!
  name: String!
  color: String!
  votes: Int!
  myVote: Boolean # Whether current user voted
}

type FragranceNote {
  id: Int!
  name: String!
  layer: NoteLayer!
  votes: Int!
  myVote: Boolean # Whether current user voted
}

type FragranceImage {
  id: Int!
  url: String! # Derived from s3Key
}

type FragranceReaction {
  reaction: FragranceReactionType!
}

type User {
  id: Int!
  username: String!
  email: String!
  fragrances: [Fragrance!]!

  cognitoId: String!
}

type Query {
  # Get a single fragrance by its id
  fragrance(id: Int!): Fragrance

  # Get a list of fragrances (with pagination)
  fragrances(limit: Int, offset: Int): [Fragrance!]!

  # Get suggested fragrances for the current user
  suggestedFragrances(limit: Int, offset: Int): [Fragrance!]!

  # Get the current user
  me: User

  # Get user-specific reactions for a fragrance
  myReactions(fragranceId: Int!): [FragranceReaction!]! 

  # Get user-specific votes for fragrance traits, accords, and notes
  myTraitVotes(fragranceId: Int!): [FragranceTrait!]! 
  myAccordVotes(fragranceId: Int!): [FragranceAccord!]!
  myNotevotes(fragranceId: Int!): [FragranceNote!]!
}

type Mutation {
  # Temp
  createUser(cognitoId: String!, email: String!): User
  # Reactions
  reactToFragrance(
    fragranceId: Int!
    type: FragranceReactionType!
  ): FragranceReaction

  # Voting
  voteOnTrait(fragranceId: Int!, trait: FragranceTraitType!): FragranceTrait
  voteOnAccord(fragranceId: Int!, accordId: Int!): FragranceAccord
  voteOnNote(fragranceId: Int!, accordId: Int!): FragranceNote
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
  fill
}
`
