import { Construct } from 'constructs'
import type { AlbConstructProps } from '../types.js'
import { type ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, ListenerAction } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { CfnOutput, Duration } from 'aws-cdk-lib'

export class AlbConstruct extends Construct {
  readonly securityGroup: SecurityGroup
  readonly securityGroupId: string

  readonly loadBalancer: ApplicationLoadBalancer
  readonly loadBalancerId: string

  readonly listener: ApplicationListener
  readonly listenerId: string

  readonly listenerPort = 80
  readonly listenerProtocol = ApplicationProtocol.HTTP
  readonly listenerArn: string

  readonly albDnsNameOutput: CfnOutput
  readonly albListenerPortOutput: CfnOutput
  readonly albListenerArnOutput: CfnOutput

  private readonly internalConfig = {
    security: {
      allowAllOutbound: true
    },

    internetFacing: true,
    vpcSubnets: {
      subnetType: SubnetType.PUBLIC
    },

    idleTimeout: Duration.seconds(60),
    defaultAction: ListenerAction.fixedResponse(404)
  }

  constructor (props: AlbConstructProps) {
    const { scope, config, vpc } = props
    super(scope, `${scope.prefix}-alb`)

    this.securityGroupId = `${scope.prefix}-alb-sg`
    this.securityGroup = new SecurityGroup(this, this.securityGroupId, {
      vpc,
      securityGroupName: this.securityGroupId,
      allowAllOutbound: this.internalConfig.security.allowAllOutbound
    })

    this.loadBalancerId = `${scope.prefix}-application-load-balancer`
    this.loadBalancer = new ApplicationLoadBalancer(this, this.loadBalancerId, {
      vpc,
      internetFacing: this.internalConfig.internetFacing,
      vpcSubnets: this.internalConfig.vpcSubnets
    })

    this.listenerId = `${scope.prefix}-alb-listener`
    this.listener = this.loadBalancer.addListener(this.listenerId, {
      protocol: this.listenerProtocol,
      port: this.listenerPort,
      defaultAction: this.internalConfig.defaultAction
    })

    this.listenerArn = this.listener.listenerArn

    this.albDnsNameOutput = new CfnOutput(this, `${scope.prefix}-alb-dns-name`, {
      exportName: config.exportNames.albDnsName,
      value: this.loadBalancer.loadBalancerDnsName
    })

    this.albListenerPortOutput = new CfnOutput(this, `${scope.prefix}-alb-listener-port`, {
      exportName: config.exportNames.albListenerPort,
      value: this.listenerPort.toString()
    })

    this.albListenerArnOutput = new CfnOutput(this, `${scope.prefix}-alb-listener-arn`, {
      exportName: config.exportNames.albListenerArn,
      value: this.listenerArn
    })
  }
}