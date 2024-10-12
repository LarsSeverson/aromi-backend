import { ApolloServer } from 'apollo-server-lambda'
import dotenv from 'dotenv'
import typeDefs from './src/schema/typeDefs'
import resolvers from './src/graphql/resolvers/main'
import context from './src/context'

dotenv.config()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true
})

export const graphql = server.createHandler()
