import { ApplicationProtocol, ListenerAction } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { BaseConfig } from '../../BaseConfig.js'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'

export class LoadBalancerConfig extends BaseConfig {
  static readonly SERVER_LOAD_BALANCER_CONFIG = {
    listenerPort: 80,
    listenerProtocol: ApplicationProtocol.HTTP,

    internetFacing: false,
    vpcSubnets: {
      subnetType: SubnetType.PUBLIC
    },

    defaultAction: ListenerAction.fixedResponse(404)
  }
}