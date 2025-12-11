import { BaseStack } from '../BaseStack.js'
import { ServerLoadBalancerComponent } from './components/ServerLoadBalancer.js'
import type { LoadBalancerStackProps } from './types.js'

export class LoadBalancerStack extends BaseStack {
  readonly serverLoadBalancer: ServerLoadBalancerComponent

  constructor (props: LoadBalancerStackProps) {
    const { app, network } = props
    super({ app, stackName: 'load-balancerv2' })

    this.serverLoadBalancer = new ServerLoadBalancerComponent({ stack: this, network })
  }
}