/* eslint-disable @typescript-eslint/no-unused-vars */
import { App } from 'aws-cdk-lib'
import { NetworkStack } from '../lib/network/NetworkStack.js'
import { StorageStack } from '../lib/storage/StorageStack.js'
import { RedisTaskStack } from '../lib/redis/RedisTaskStack.js'
import { RedisServiceStack } from '../lib/redis/RedisServiceStack.js'
import { ClusterStack } from '../lib/cluster/ClusterStack.js'
import { ServerLoadBalancerStack } from '../lib/server/ServerLoadBalancerStack.js'
import { MeiliStorageStack } from '../lib/meili-search/MeiliStorageStack.js'
import { MeiliTaskStack } from '../lib/meili-search/MeiliTaskStack.js'
import { MeiliServiceStack } from '../lib/meili-search/MeiliServiceStack.js'

const app = new App()

const network = new NetworkStack({ app })

const storage = new StorageStack({ app })

const cluster = new ClusterStack({ app, network })

const redisTask = new RedisTaskStack({ app })
const redisService = new RedisServiceStack({ app, network, cluster, task: redisTask })

const meiliStorage = new MeiliStorageStack({ app, network })
const meiliTask = new MeiliTaskStack({ app, storage: meiliStorage })
const meiliService = new MeiliServiceStack({ app, network, cluster, task: meiliTask })

const serverLB = new ServerLoadBalancerStack({ app, network })

app.synth()
