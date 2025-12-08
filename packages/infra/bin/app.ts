/* eslint-disable @typescript-eslint/no-unused-vars */
import { App } from 'aws-cdk-lib'
import { synthNetworkStack } from '../lib/network/index.js'
import { synthAuthStack } from '../lib/auth/index.js'
import { synthDatabaseStack } from '../lib/db/index.js'
import { synthCDNStack } from '../lib/cdn/index.js'
import { synthClusterStack } from '../lib/cluster/index.js'
import { synthRedisStack } from '../lib/redis/index.js'
import { synthMeiliStack } from '../lib/meili-search/index.js'
import { synthServerStack } from '../lib/server/index.js'
import { synthWorkersStack } from '../lib/workers/index.js'
import { synthStorageStack } from '../lib/storage/index.js'
import { synthLoadBalancerStack } from '../lib/load-balancer/index.js'

const app = new App()

const networkStack = synthNetworkStack({ app })

const authStack = synthAuthStack({ app })

const storageStack = synthStorageStack({ app })

const databaseStack = synthDatabaseStack({ app, networkStack })

const loadBalancerStack = synthLoadBalancerStack({ app, networkStack })

const cdnStack = synthCDNStack({ app, networkStack, storageStack, loadBalancerStack })

const clusterStack = synthClusterStack({ app, networkStack })

const redisStack = synthRedisStack({ app, networkStack, clusterStack })

const meiliStack = synthMeiliStack({ app, networkStack, clusterStack })

const serverStack = synthServerStack({
  app,
  networkStack,
  authStack,
  storageStack,
  databaseStack,
  cdnStack,
  clusterStack,
  loadBalancerStack,
  meiliStack,
  redisStack
})

// const workersStack = synthWorkersStack({
//   app,
//   networkStack,
//   authStack,
//   databaseStack,
//   clusterStack,
//   cdnStack,
//   meiliStack
// })

app.synth()
