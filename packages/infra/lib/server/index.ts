import { ServerECRStack } from './ServerECRStack.js'
import { ServerIamStack } from './ServerIamStack.js'
import { ServerServiceStack } from './ServerServiceStack.js'
import { ServerTaskStack } from './ServerTaskStack.js'
import type { SynthServerServiceStackProps } from './types.js'

export const synthServerStack = (props: SynthServerServiceStackProps) => {
  const { app, networkStack, authStack, databaseStack, clusterStack, cdnStack, meiliStack } = props
  const { network } = networkStack
  const { auth } = authStack
  const { database } = databaseStack
  const { cluster } = clusterStack
  const { cdn, serverLoadBalancer } = cdnStack
  const { task: meiliTask } = meiliStack

  const ecr = new ServerECRStack({ app })
  const iam = new ServerIamStack({ app, auth, cdn })
  const task = new ServerTaskStack({ app, auth, database, cdn, meiliTask, ecr, iam })
  const service = new ServerServiceStack({ app, network, cluster, task, serverLoadBalancer })

  return { ecr, iam, task, service }
}