import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { readFileSync } from 'fs'
import resolvers from './resolvers/resolvers'
import depthLimit from 'graphql-depth-limit'
import { type Context, getContext } from './context'
import { requiredEnv } from './common/env-util'
import { ResultAsync } from 'neverthrow'
import { ApiError } from './common/error'
import { getDataSources } from './datasources'
import express from 'express'
import http from 'http'
import cors from 'cors'

const typeDefs = readFileSync('src/generated/schema.graphql', { encoding: 'utf-8' })

const startSever = async (): Promise<string> => {
  const hostRes = requiredEnv('SERVER_HOST')
  if (hostRes.isErr()) throw hostRes.error

  const portRes = requiredEnv('SERVER_PORT')
  if (portRes.isErr()) throw portRes.error

  const sourcesRes = getDataSources()
  if (sourcesRes.isErr()) throw sourcesRes.error

  const host = hostRes.value
  const port = Number(portRes.value)
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? []
  const sources = sourcesRes.value

  const app = express()
  const httpServer = http.createServer((req, res) => { void app(req, res) })
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true,
    validationRules: [depthLimit(15)],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  await server.start()

  app
    .use(
      '/graphql',
      cors({
        origin: allowedOrigins,
        credentials: true
      }),
      express.json(),
      expressMiddleware(server, {
        context: async (serverArgs) => await getContext({ serverArgs, sources })
      })
    )

  return await new Promise(resolve =>
    httpServer.listen({ host, port }, () => {
      resolve(`http://${host}:${port}/graphql`)
    })
  )
}

const main = (): ResultAsync<string, ApiError> =>
  ResultAsync.fromPromise(
    startSever(),
    e => new ApiError('INTERNAL_ERROR', 'Unable to start server', 500, e)
  )

void main()
  .match(
    (url) => { console.log(`🚀  Server ready at ${url}`) },
    (err) => { console.error(err) }
  )
