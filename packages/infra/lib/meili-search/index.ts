import { MeiliAppStack } from './MeiliAppStack.js'
import { MeiliInfraStack } from './MeiliInfraStack.js'
import type { SynthMeiliStackProps } from './types.js'

export const synthMeiliStack = (props: SynthMeiliStackProps) => {
  const { app, networkStack, clusterStack } = props
  const { network } = networkStack
  const { cluster } = clusterStack

  const infra = new MeiliInfraStack({ app, network })
  const meiliApp = new MeiliAppStack({ app, network, cluster, infra })

  return { infra, app: meiliApp }
}