import { ApolloServer } from '@apollo/server'
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda'
import { getContext } from './context'
import { readFileSync } from 'fs'
import resolvers from './resolvers/resolvers'

const typeDefs = readFileSync('src/generated/schema.graphql', { encoding: 'utf-8' })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
})

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: getContext
  }
)
