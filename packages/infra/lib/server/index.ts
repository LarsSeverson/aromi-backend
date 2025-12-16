import { ServerAppStack } from './ServerAppStack.js'
import type { SynthServerServiceStackProps } from './types.js'

export const synthServerStack = (props: SynthServerServiceStackProps) => {
  const {
    scope: app,

    networkStack,
    authStack,
    storageStack,
    databaseStack,
    clusterStack,
    cdnStack,
    loadBalancerStack,
    ecrStack,

    meiliStack,
    redisStack
  } = props

  const { network } = networkStack
  const { auth } = authStack
  const { storage } = storageStack
  const { database } = databaseStack
  const { cluster } = clusterStack
  const { cdn } = cdnStack
  const { loadBalancer } = loadBalancerStack
  const { ecr } = ecrStack

  const { app: meiliApp } = meiliStack
  const { app: redisApp } = redisStack

  const serverAppStack = new ServerAppStack({
    scope: app,
    network,
    auth,
    storage,
    database,
    cdn,
    cluster,
    loadBalancer,
    ecr,

    meili: meiliApp,
    redis: redisApp
  })

  return { app: serverAppStack }
}