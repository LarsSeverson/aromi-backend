import { AuroraCapacityUnit, AuroraPostgresEngineVersion, Credentials, DatabaseClusterEngine, ServerlessCluster } from 'aws-cdk-lib/aws-rds'
import type { DatabaseStackProps } from './types.js'
import { InfraStack } from './InfraStack.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Duration, RemovalPolicy, SecretValue } from 'aws-cdk-lib'
import { requiredEnv, unwrapOrThrowSync } from '@aromi/shared'

export class DatabaseStack extends InfraStack {
  static readonly ENGINE = DatabaseClusterEngine.auroraPostgres({
    version: AuroraPostgresEngineVersion.VER_17_5
  })

  static readonly MIN_CAPACITY = AuroraCapacityUnit.ACU_1
  static readonly MAX_CAPACITY = AuroraCapacityUnit.ACU_2

  readonly cluster: ServerlessCluster
  readonly clusterId: string

  constructor (props: DatabaseStackProps) {
    const { app, vpc } = props
    super({ app, stackName: 'database' })

    const dbUser = unwrapOrThrowSync(requiredEnv('DB_USER'))
    const dbPassword = unwrapOrThrowSync(requiredEnv('DB_PASSWORD'))

    this.clusterId = `${this.prefix}-db-cluster`

    this.cluster = new ServerlessCluster(this, this.clusterId, {
      clusterIdentifier: this.clusterId,
      defaultDatabaseName: this.prefix.replace(/-/g, '_'),

      engine: DatabaseStack.ENGINE,

      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      scaling: {
        minCapacity: DatabaseStack.MIN_CAPACITY,
        maxCapacity: DatabaseStack.MAX_CAPACITY
      },

      backupRetention: Duration.days(3),
      removalPolicy: RemovalPolicy.SNAPSHOT,

      credentials: Credentials.fromPassword(
        dbUser,
        SecretValue.unsafePlainText(dbPassword)
      )
    })
  }
}