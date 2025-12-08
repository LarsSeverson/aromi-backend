import { ServerAppStack } from './ServerAppStack.js'
import type { SynthServerServiceStackProps } from './types.js'

export const synthServerStack = (props: SynthServerServiceStackProps) => {
  const {
    app,

    networkStack,
    authStack,
    storageStack,
    databaseStack,
    clusterStack,
    cdnStack,
    loadBalancerStack,

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

  const { app: meiliApp } = meiliStack
  const { app: redisApp } = redisStack

  const serverAppStack = new ServerAppStack({
    app,
    network,
    auth,
    storage,
    database,
    cdn,
    cluster,
    loadBalancer,

    meili: meiliApp,
    redis: redisApp
  })

  return { app: serverAppStack }
}