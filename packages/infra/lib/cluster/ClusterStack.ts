import { Cluster } from 'aws-cdk-lib/aws-ecs'
import { BaseStack } from '../BaseStack.js'
import type { ClusterStackProps } from './types.js'
import { ClusterConfig } from './components/ClusterConfig.js'

export class ClusterStack extends BaseStack {
  readonly clusterId: string
  readonly cluster: Cluster

  constructor (props: ClusterStackProps) {
    const { app, network } = props
    super({ app, stackName: 'cluster' })

    this.clusterId = `${this.prefix}-cluster`
    this.cluster = new Cluster(this, this.clusterId, {
      vpc: network.vpc,

      enableFargateCapacityProviders: ClusterConfig.enableFargateCapacityProviders,
      defaultCloudMapNamespace: ClusterConfig.defaultCloudMapNamespace
    })
  }

  dns (cloudMapName: string) {
    return `${cloudMapName}.${ClusterConfig.defaultCloudMapNamespace.name}`
  }
}