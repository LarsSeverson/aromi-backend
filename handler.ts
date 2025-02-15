import { ApolloServer } from 'apollo-server-lambda'
import { GraphQLDateTime } from 'graphql-scalars'
import { getContext } from './src/graphql/schema/context'
import { schema } from './src/graphql/schema/schema'
import { Mutation } from './src/graphql/resolvers/mutations/mutations'
import { FragranceQuery, FragranceNotesQuery, Query, FragranceTraitsQuery } from './src/graphql/resolvers/queries/queries'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Mutation,

    Query,
    Fragrance: FragranceQuery,
    FragranceTraits: FragranceTraitsQuery,
    FragranceNotes: FragranceNotesQuery,

    Date: GraphQLDateTime
  },
  context: getContext,
  introspection: true
})

export const graphql = server.createHandler()
