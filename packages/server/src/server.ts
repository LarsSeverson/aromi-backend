import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { readFileSync } from 'node:fs'
import express from 'express'
import http from 'node:http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { expressMiddleware } from '@as-integrations/express5'
import { DataSources, formatApiError, requiredEnv } from '@aromi/shared'
import { ServerServices } from './services/ServerServices.js'
import { ServerQueues } from './queues/ServerQueues.js'
import { getContext, type ServerContext } from './context/index.js'
import { ApiResolvers } from './resolvers/ApiResolvers.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.join(dirname, 'graphql', 'schema.graphql')
const typeDefs = readFileSync(schemaPath, { encoding: 'utf-8' })

export const startServer = async (): Promise<string> => {
  const hostRes = requiredEnv('SERVER_HOST')
  if (hostRes.isErr()) throw hostRes.error

  const portRes = requiredEnv('SERVER_PORT')
  if (portRes.isErr()) throw portRes.error

  const host = hostRes.value
  const port = Number(portRes.value)
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? []

  const sources = new DataSources()
  const services = new ServerServices(sources)
  const queues = new ServerQueues(sources)

  const app = express()
  const httpServer = http.createServer(app)
  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })]

  if (process.env.NODE_ENV === 'development') {
    plugins.push(ApolloServerPluginLandingPageLocalDefault({
      embed: true,
      includeCookies: true
    }))
  }

  const server = new ApolloServer<ServerContext>({
    typeDefs,
    resolvers: ApiResolvers,
    introspection: true,
    validationRules: [],
    plugins,
    formatError: formatApiError
  })

  await server.start()

  app.get('/health', (_req, res) => {
    res.status(200).send('ok')
  })

  app
    .use(cookieParser())
    .use(cors({ origin: allowedOrigins, credentials: true }))
    .use(express.json())
    .use(
      '/graphql',
      expressMiddleware(server, {
        context: async (serverArgs) =>
          await getContext({ serverArgs, sources, services, queues })
      })
    )

  return await new Promise(
    resolve => {
      httpServer.listen({ host, port }, () => {
        resolve(`http://${host}:${port}/graphql`)
      })
    }
  )
}
