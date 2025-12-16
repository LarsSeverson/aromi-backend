import { BaseStack } from '../../common/BaseStack.js'
import { ServerLoadBalancerComponent } from './components/ServerLoadBalancer.js'
import type { LoadBalancerStackProps } from './types.js'

export class LoadBalancerStack extends BaseStack {
  readonly serverLoadBalancer: ServerLoadBalancerComponent

  constructor (props: LoadBalancerStackProps) {
    const { scope: app, network } = props
    super({ scope: app, stackName: 'load-balancer' })

    this.serverLoadBalancer = new ServerLoadBalancerComponent({ stack: this, network })
  }
}