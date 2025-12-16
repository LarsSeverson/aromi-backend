/* eslint-disable @typescript-eslint/no-unused-vars */
import { App } from 'aws-cdk-lib'
import { FoundationStack } from '../lib/foundation/FoundationStack.js'
import { DataStack } from '../lib/data/DataStack.js'
import { EnvMode } from '../common/types.js'
import { loadConfig } from '../config/index.js'
import { EdgeGlobalStack } from '../lib/edge/EdgeGlobalStack.js'
import { EdgeStack } from '../lib/edge/EdgeStack.js'

const app = new App()

const env = (app.node.tryGetContext('env') ?? 'dev') === 'prod'
  ? EnvMode.PRODUCTION
  : EnvMode.DEVELOPMENT

const config = loadConfig(env)

const foundation = new FoundationStack({ scope: app, config })
const data = new DataStack({ scope: app, config, vpc: foundation.network.vpc })

const edgeGlobal = new EdgeGlobalStack({ scope: app, config })
const edgeRegional = new EdgeStack({
  scope: app,
  config,

  certificate: edgeGlobal.acm.certifacte,
  webAclId: edgeGlobal.acl.webAcl.attrArn
})

// const networkStack = synthNetworkStack({ scope: app })

// const authStack = synthAuthStack({ scope: app })

// const storageStack = synthStorageStack({ scope: app })

// const databaseStack = synthDatabaseStack({ scope: app, networkStack })

// const loadBalancerStack = synthLoadBalancerStack({ scope: app, networkStack })

// const ecrStack = synthECRStack({ scope: app })

// const certStack = synthCertStack({ scope: app })
// const wafStack = synthWAFStack({ scope: app })
// const cdnStack = synthCDNStack({ scope: app, networkStack, storageStack, loadBalancerStack, wafStack, certStack })

// const clusterStack = synthClusterStack({ scope: app, networkStack })

// const redisStack = synthRedisStack({ scope: app, networkStack, clusterStack })

// const meiliStack = synthMeiliStack({ scope: app, networkStack, clusterStack })

// const serverStack = synthServerStack({
//   scope: app,
//   networkStack,
//   authStack,
//   storageStack,
//   databaseStack,
//   cdnStack,
//   clusterStack,
//   loadBalancerStack,
//   ecrStack,
//   meiliStack,
//   redisStack
// })

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
