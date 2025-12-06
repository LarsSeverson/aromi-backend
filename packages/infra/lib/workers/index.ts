import type { SynthWorkersServiceStackProps } from './types.js'
import { WorkersECRStack } from './WorkersECRStack.js'
import { WorkersServiceStack } from './WorkersServiceStack.js'
import { WorkersTaskStack } from './WorkersTaskStack.js'

export const synthWorkersStack = (props: SynthWorkersServiceStackProps) => {
  const { app, networkStack, authStack, databaseStack, clusterStack, cdnStack, meiliStack } = props
  const { network } = networkStack
  const { auth } = authStack
  const { database } = databaseStack
  const { cluster } = clusterStack
  const { cdn } = cdnStack
  const { task: meiliTask } = meiliStack

  const ecr = new WorkersECRStack({ app })
  const task = new WorkersTaskStack({ app, auth, database, meiliTask, cdn, ecr })
  const service = new WorkersServiceStack({ app, network, cluster, task })

  return { ecr, task, service }
}