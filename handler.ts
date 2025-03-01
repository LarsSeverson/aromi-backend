import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { getContext } from './src/context'
import { readFileSync } from 'fs'
import resolvers from './src/resolvers/resolvers'

const typeDefs = readFileSync('src/generated/schema.graphql', { encoding: 'utf-8' })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
})

export const start = async (): Promise<void> => {
  const { url } = await startStandaloneServer(server, {
    context: getContext
  })

  console.log(`🚀 Server ready at ${url}`)
}

void start()
