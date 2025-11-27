import { AuroraCapacityUnit, AuroraPostgresEngineVersion, DatabaseClusterEngine, ServerlessCluster } from 'aws-cdk-lib/aws-rds'
import { EnvName, type DatabaseStackProps } from './types.js'
import { InfraStack } from './InfraStack.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'

export class DatabaseStack extends InfraStack {
  readonly cluster: ServerlessCluster

  constructor (props: DatabaseStackProps) {
    super(props)

    const clusterId = `${this.prefix}-db-cluster`

    this.cluster = new ServerlessCluster(this, clusterId, {
      defaultDatabaseName: this.appName,

      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_17_5
      }),

      vpc: props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      scaling: {
        minCapacity: AuroraCapacityUnit.ACU_1,
        maxCapacity: AuroraCapacityUnit.ACU_2
      },

      backupRetention: props.envName === EnvName.PROD
        ? Duration.days(7)
        : Duration.days(1),

      removalPolicy: RemovalPolicy.RETAIN,

      copyTagsToSnapshot: true
    })
  }
}