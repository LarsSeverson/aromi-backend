import { ClusterInstance, Credentials, DatabaseCluster } from 'aws-cdk-lib/aws-rds'
import type { DatabaseStackProps } from './types.js'
import { BaseStack } from '../BaseStack.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { RemovalPolicy } from 'aws-cdk-lib'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import { DatabaseConfig } from './components/DatabaseConfig.js'

export class DatabaseStack extends BaseStack {
  readonly cluster: DatabaseCluster
  readonly clusterId: string

  readonly dbName: string
  readonly dbUrl: string

  readonly dbSecretId: string
  readonly dbSecretKey = 'password'
  readonly dbSecret: Secret

  readonly writerId: string

  constructor (props: DatabaseStackProps) {
    const { app, network } = props
    super({ app, stackName: 'database' })

    this.dbName = this.appName

    this.dbSecretId = `${this.prefix}-db-secret`
    this.dbSecret = new Secret(this, this.dbSecretId, {
      secretName: this.dbSecretId,

      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: 'postgres'
        }),
        generateStringKey: this.dbSecretKey,
        passwordLength: 32,
        excludeCharacters: '/@" '
      }
    })

    this.writerId = `${this.prefix}-db-writer`
    this.clusterId = `${this.prefix}-db-cluster`
    this.cluster = new DatabaseCluster(this, this.clusterId, {
      clusterIdentifier: this.clusterId,
      defaultDatabaseName: this.dbName,

      engine: DatabaseConfig.ENGINE,

      vpc: network.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },
      securityGroups: [network.databaseSecurityGroup.securityGroup],

      writer: ClusterInstance.provisioned(this.writerId, {
        publiclyAccessible: false
      }),

      serverlessV2MinCapacity: DatabaseConfig.MIN_CAPACITY,
      serverlessV2MaxCapacity: DatabaseConfig.MAX_CAPACITY,

      removalPolicy: RemovalPolicy.SNAPSHOT,

      credentials: Credentials.fromSecret(this.dbSecret)
    })

    this.dbUrl = ''
  }
}