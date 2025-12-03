import { Cluster } from 'aws-cdk-lib/aws-ecs'
import { InfraStack } from '../InfraStack.js'
import type { ClusterStackProps } from './types.js'

export class ClusterStack extends InfraStack {
  static readonly CONTAINER_INSIGHTS = true
  static readonly ENABLE_FARGATE_CAPACITY_PROVIDERS = true

  readonly clusterId: string
  readonly cluster: Cluster

  constructor (props: ClusterStackProps) {
    const { app, network } = props
    super({ app, stackName: 'cluster' })

    this.clusterId = `${this.prefix}-cluster`
    this.cluster = new Cluster(this, this.clusterId, {
      clusterName: this.clusterId,

      vpc: network.vpc,
      enableFargateCapacityProviders: ClusterStack.ENABLE_FARGATE_CAPACITY_PROVIDERS,

      containerInsights: ClusterStack.CONTAINER_INSIGHTS
    })
  }
}