import { Port, PrefixList, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2'
import type { NetworkStackProps } from './types.js'
import { BaseStack } from '../../common/BaseStack.js'
import { RedisSecurityGroupComponent } from './components/RedisSecurityGroup.js'
import { ServerSecurityGroupComponent } from './components/ServerSecurityGroup.js'
import { RedisConfig } from '../redis/components/RedisConfig.js'
import { ServerLoadBalancerSecurityGroupComponent } from './components/ServerLoadBalancerSecurityGroup.js'
import { MeiliSecurityGroupComponent } from './components/MeiliSecurityGroup.js'
import { MeiliConfig } from '../meili-search/components/MeiliConfig.js'
import { DatabaseSecurityGroup } from './components/DatabaseSecurityGroup.js'
import { DatabaseConfig } from '../db/components/DatabaseConfig.js'
import { ServerConfig } from '../server/components/ServerConfig.js'
import { NetworkConfig } from './components/NetworkConfig.js'
import { LoadBalancerConfig } from '../load-balancer/components/LoadBalancerConfig.js'

export class NetworkStack extends BaseStack {
  static readonly MAX_AZS = 2
  static readonly PUBLIC_MASK = 24
  static readonly PRIVATE_MASK = 24
  static readonly NAT_GATEWAYS = 1

  readonly vpc: Vpc
  readonly vpcId: string

  readonly databaseSecurityGroup: DatabaseSecurityGroup

  readonly meiliSecurityGroup: MeiliSecurityGroupComponent

  readonly redisSecurityGroup: RedisSecurityGroupComponent

  readonly serverLoadBalancerSecurityGroup: ServerLoadBalancerSecurityGroupComponent

  readonly serverSecurityGroup: ServerSecurityGroupComponent

  constructor (props: NetworkStackProps) {
    const { scope: app } = props

    super({ scope: app, stackName: 'network' })

    this.vpcId = `${this.prefix}-vpc`
    this.vpc = new Vpc(this, this.vpcId, {
      maxAzs: NetworkStack.MAX_AZS,

      subnetConfiguration: [
        {
          name: `${this.stackName}-public`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: NetworkStack.PUBLIC_MASK
        },
        {
          name: `${this.stackName}-private`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: NetworkStack.PRIVATE_MASK
        }
      ],

      natGateways: NetworkStack.NAT_GATEWAYS
    })

    this.databaseSecurityGroup = new DatabaseSecurityGroup({ stack: this })

    this.meiliSecurityGroup = new MeiliSecurityGroupComponent({ stack: this })

    this.redisSecurityGroup = new RedisSecurityGroupComponent({ stack: this })

    this.serverLoadBalancerSecurityGroup = new ServerLoadBalancerSecurityGroupComponent({ stack: this })

    this.serverSecurityGroup = new ServerSecurityGroupComponent({ stack: this })

    this.allowCdnToAlb()

    this.allowMeiliToEFS()

    this.allowAlbToServer()

    this.allowServerToDatabase()
    this.allowServerToMeili()
    this.allowServerToRedis()
  }

  private allowCdnToAlb () {
    const ipv4PrefixList = PrefixList.fromLookup(this, NetworkConfig.CDN_PREFIX_LIST_ID, {
      prefixListName: NetworkConfig.CDN_PREFIX_LIST_NAME
    })

    this.serverLoadBalancerSecurityGroup.securityGroup.addIngressRule(
      ipv4PrefixList,
      Port.tcp(LoadBalancerConfig.SERVER_LOAD_BALANCER_CONFIG.listenerPort)
    )
  }

  private allowMeiliToEFS () {
    this.meiliSecurityGroup.efsSecurityGroup.addIngressRule(
      this.meiliSecurityGroup.serviceSecurityGroup,
      MeiliConfig.EFS_CONFIG.tcpPort
    )
  }

  private allowAlbToServer () {
    this.serverSecurityGroup.securityGroup.addIngressRule(
      this.serverLoadBalancerSecurityGroup.securityGroup,
      Port.tcp(ServerConfig.CONTAINER_CONFIG.containerPort)
    )
  }

  private allowServerToDatabase () {
    this.databaseSecurityGroup.securityGroup.addIngressRule(
      this.serverSecurityGroup.securityGroup,
      DatabaseConfig.DB_PORT
    )
  }

  private allowServerToMeili () {
    this.meiliSecurityGroup.serviceSecurityGroup.addIngressRule(
      this.serverSecurityGroup.securityGroup,
      Port.tcp(MeiliConfig.CONTAINER_CONFIG.containerPort)
    )
  }

  private allowServerToRedis () {
    this.redisSecurityGroup.securityGroup.addIngressRule(
      this.serverSecurityGroup.securityGroup,
      Port.tcp(RedisConfig.CONTAINER_CONFIG.containerPort)
    )
  }
}