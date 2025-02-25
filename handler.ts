import { ApolloServer } from 'apollo-server-lambda'
import { GraphQLDateTime } from 'graphql-scalars'
import { getContext } from './src/graphql/schema/context'
import { schema } from './src/graphql/schema/schema'
import { Mutation } from './src/graphql/resolvers/mutations/mutations'
import { FragranceQuery, FragranceNotesQuery, Query, FragranceTraitsQuery, UserQuery, FragranceCollectionQuery } from './src/graphql/resolvers/queries/queries'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Mutation,
    Query,

    Fragrance: FragranceQuery,
    FragranceTraits: FragranceTraitsQuery,
    FragranceNotes: FragranceNotesQuery,
    FragranceCollection: FragranceCollectionQuery,

    User: UserQuery,

    Date: GraphQLDateTime
  },
  context: getContext,
  introspection: true
})

export const graphql = server.createHandler()
