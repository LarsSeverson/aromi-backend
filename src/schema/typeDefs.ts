import { gql } from 'apollo-server-lambda'

const typeDefs = gql`#graphql
  type Fragrance {
    id: ID!
    brand: String!
    name: String!
    rating: Float!
    review_count: Int!
    likes: Int!
    dislikes: Int!
    gender: Float!
    longevity: Float!
    sillage: Float!
    complexity: Float!
    balance: Float!
    allure: Float!

    accords: [Accord]
    notes: [Note]
  }

  type Accord {
    id: ID!
    name: String!
    concentration: Float
  }

  type Note {
    id: ID!
    name: String!
    note_type: String!
    concentration: Float!
  }
  
  type Query {
    # Test
    hello: String!

    # Fetch all fragrances
    fragrances(limit: Int): [Fragrance]

    # Fetch a fragrance by its ID
    fragrance(id: ID!): Fragrance

    # Fetch all accords
    accords: [Accord]

    # Fetch an accord by its ID
    accord(id: ID!): Accord

    # Fetch all notes
    notes: [Note]

    # Fetch a note by its ID
    note(id: ID!): Note
  }
`
export default typeDefs
