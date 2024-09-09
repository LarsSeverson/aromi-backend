import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { log } from 'console'
import { Pool, QueryArrayConfig } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aromidb',
  password: 'password',
  port: 5432
})

const db = {
  query: (text: string, params?: any[]) => pool.query(text, params)
}

const typeDefs = `#graphql
  type Fragrance {
    id: ID!
    brand: String!
    name: String!
    rating: Float!
    reviewCount: Int!
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
  
  # type FragranceAccord {
  #   fragranceID: ID
  #   noteID: ID
  #   note_type: String
  #   concentration: Float

  #   note: Note
  #   fragrance: Fragrance
  # }

  type Query {
    # Test
    hello: String

    # Fetch all fragrances
    fragrances: [Fragrance]

    # Fetch a fragrance by its ID
    fragrance(id: ID!): Fragrance

    # Fetch all accords
    accords: [Accord]

    # Fetch an accord by its ID
    accord(id: ID!): Accord

    # Fetch afragrance-accord by a fragrance ID and accord ID
    # getFragranceAccord(fragranceID: ID!, accordID: ID!): FragranceAccord

    # # Fetch all notes
    # notes: [Note]

    # # Fetch a note by its ID
    # note(id: ID): Note

    # # Fetch all fragrance-note relationships by a fragrance ID
    # fragranceNote(fragranceID: ID): FragranceNote
  }
`
const startServer = async () => {
  const resolvers = {
    Query: {
      hello: () => 'Hello world!',

      fragrances: async () => {
        const res = await db.query('SELECT * FROM fragrances')
        return res.rows
      },

      fragrance: async (_: any, args: { id: number }) => {
        const id = args.id || 0

        const fragranceRes = await db.query(
          'SELECT * FROM fragrances WHERE id = $1',
          [id]
        )

        const fragranceAccordsRes = await db.query(
          `SELECT a.id, a.name, fa.concentration
           FROM fragrance_accords fa
           JOIN accords a ON fa.accord_id = a.id
           WHERE fa.fragrance_id = $1
          `,
          [id]
        )

        const fragranceNotesRes = await db.query(
          `SELECT n.id, n.name, fn.note_type, fn.concentration
           FROM fragrance_notes fn
           JOIN notes n ON fn.note_id = n.id
           WHERE fn.fragrance_id = $1 
          `,
          [id]
        )

        const fragrance = fragranceRes.rows[0]
        const fragranceAccords = fragranceAccordsRes.rows
        const fragranceNotes = fragranceNotesRes.rows

        return {
          ...fragrance,
          accords: fragranceAccords,
          notes: fragranceNotes
        }
      },

      accords: async () => {
        const res = await db.query('SELECT * FROM accords')
        return res.rows
      },

      accord: async (_: any, args: { id: number }) => {
        const id = args.id || 0
        const res = await db.query('SELECT * FROM accords WHERE id = $1', [id])
        return res.rows[0]
      }

      // fragranceAccord: async (
      //   source: any,
      //   args: { fragranceID: number; accordID: number },
      //   context: any,
      //   info: any
      // ) => {
      //   const fragranceID = args.fragranceID || 0
      //   const accordID = args.accordID || 0

      //   const res = await db.query(
      //     `SELECT a.*, fa.concentration FROM fragrance_accords fa
      //      JOIN accords a ON fa.accord_id = a.id
      //      WHERE fa.fragrance_id = $1 AND fa.accord_id = $2
      //     `,
      //     [fragranceID, accordID]
      //   )

      //   const { id, name, concentration } = res.rows[0]

      //   return { accord: { id, name }, concentration }
      // }
    }
  }
  const server = new ApolloServer({ typeDefs, resolvers })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })

  console.log(`Server is ready at: ${url}`)
}

startServer()
