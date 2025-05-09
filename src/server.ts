import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { expressMiddleware } from '@apollo/server/express4'
import { readFileSync } from 'fs'
import { ApiResolvers } from './resolvers/resolvers'
import depthLimit from 'graphql-depth-limit'
import { type ApiContext, getContext } from './context'
import { requiredEnv } from './common/env-util'
import { ResultAsync } from 'neverthrow'
import { ApiError, formatApiError } from './common/error'
import { getDataSources } from './datasources/datasources'
import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApiServices } from './services/services'

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
  const services = new ApiServices(sources)
  const resolvers = new ApiResolvers()

  const app = express()
  const httpServer = http.createServer((req, res) => { void app(req, res) })
  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })]

  if (process.env.NODE_ENV === 'development') {
    plugins.push(ApolloServerPluginLandingPageLocalDefault({
      embed: true,
      includeCookies: true
    }))
  }

  const server = new ApolloServer<ApiContext>({
    typeDefs,
    resolvers: { ...resolvers },
    introspection: true,
    validationRules: [depthLimit(15)],
    plugins,
    formatError: formatApiError
  })

  await server.start()

  app
    .use(cookieParser())
    .use(cors({ origin: allowedOrigins, credentials: true }))
    .use(express.json())
    .use(
      '/graphql',
      expressMiddleware(server, {
        context: async (serverArgs) => await getContext({ serverArgs, sources, services })
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
