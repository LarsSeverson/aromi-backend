import { ClusterInstance, Credentials, DatabaseCluster, type IClusterInstance } from 'aws-cdk-lib/aws-rds'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import type { DatabaseConstructProps } from '../types.js'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

export class DatabaseConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly dbSecret: Secret
  readonly dbSecretId: string
  readonly dbSecretPasswordKey = 'password'
  readonly dbSecretUsernameKey = 'username'

  readonly writer: IClusterInstance
  readonly writerId: string

  readonly cluster: DatabaseCluster
  readonly clusterId: string

  readonly databaseName: string
  readonly databasePort: number
  readonly databaseUrl: string

  private readonly internalConfig = {
    allowAllOutbound: true,

    usernameValue: 'postgres',

    passwordLength: 32,
    passwordExcludeCharacters: '/@" '
  }

  constructor (props: DatabaseConstructProps) {
    const { scope, config, foundationStack } = props
    super(scope, `${scope.prefix}-database`)

    this.securityGroupId = `${scope.prefix}-database-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc: foundationStack.network.vpc,
      allowAllOutbound: this.internalConfig.allowAllOutbound
    })

    this.dbSecretId = `${scope.prefix}-db-secret`
    this.dbSecret = new Secret(this, this.dbSecretId, {
      secretName: this.dbSecretId,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          [this.dbSecretUsernameKey]: this.internalConfig.usernameValue
        }),
        generateStringKey: this.dbSecretPasswordKey,
        passwordLength: this.internalConfig.passwordLength,
        excludeCharacters: this.internalConfig.passwordExcludeCharacters
      }
    })

    this.writerId = `${scope.prefix}-db-writer`
    this.writer = ClusterInstance.provisioned(this.writerId, {
      publiclyAccessible: false
    })

    this.clusterId = `${scope.prefix}-db-cluster`
    this.cluster = new DatabaseCluster(this, this.clusterId, {
      clusterIdentifier: this.clusterId,
      defaultDatabaseName: config.database.databaseName,

      engine: config.database.engine,
      writer: this.writer,

      serverlessV2MinCapacity: config.database.minCapacity,
      serverlessV2MaxCapacity: config.database.maxCapacity,

      vpc: foundationStack.network.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS
      },

      securityGroups: [this.securityGroup],

      credentials: Credentials.fromSecret(this.dbSecret),

      removalPolicy: config.database.removalPolicy
    })

    this.databaseName = config.database.databaseName
    this.databasePort = this.cluster.clusterEndpoint.port
    this.databaseUrl = this.cluster.clusterEndpoint.socketAddress
  }
}