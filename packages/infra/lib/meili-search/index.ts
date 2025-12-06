import { MeiliServiceStack } from './MeiliServiceStack.js'
import { MeiliStorageStack } from './MeiliStorageStack.js'
import { MeiliTaskStack } from './MeiliTaskStack.js'
import type { SynthMeiliStackProps } from './types.js'

export const synthMeiliStack = (props: SynthMeiliStackProps) => {
  const { app, networkStack, clusterStack } = props
  const { network } = networkStack
  const { cluster } = clusterStack

  const storage = new MeiliStorageStack({ app, network })
  const task = new MeiliTaskStack({ app, storage })
  const service = new MeiliServiceStack({ app, network, cluster, storage, task })

  return { storage, task, service }
}