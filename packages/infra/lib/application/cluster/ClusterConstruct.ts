import { Construct } from 'constructs'
import type { ClusterConstructProps } from '../types.js'
import { Cluster } from 'aws-cdk-lib/aws-ecs'

export class ClusterConstruct extends Construct {
  readonly cluster: Cluster
  readonly clusterId: string

  constructor (props: ClusterConstructProps) {
    const { scope, config, vpc } = props
    super(scope, `${scope.prefix}-cluster`)

    this.clusterId = `${scope.prefix}-ecs-cluster`
    this.cluster = new Cluster(this, this.clusterId, {
      clusterName: this.clusterId,
      vpc,

      enableFargateCapacityProviders: config.cluster.enableFargateCapacityProviders,
      defaultCloudMapNamespace: config.cluster.defaultCloudMapNamespace
    })
  }
}