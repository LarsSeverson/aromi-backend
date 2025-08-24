import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { readFileSync } from 'fs'
import depthLimit from 'graphql-depth-limit'
import { requiredEnv } from './common/env-util'
import { formatApiError } from './common/error'
import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { expressMiddleware } from '@as-integrations/express5'
import { getDataSources } from './datasources'
import { type ApiContext, getContext } from './context'
import { ApiServices } from './services/ApiServices'
import { ApiResolvers } from './resolvers/ApiResolvers'

const typeDefs = readFileSync('src/generated/schema.graphql', { encoding: 'utf-8' })

export const startSever = async (): Promise<string> => {
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
    resolvers: ApiResolvers,
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
