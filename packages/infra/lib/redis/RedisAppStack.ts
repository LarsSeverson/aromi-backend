import { BaseStack } from '../BaseStack.js'
import { RedisServiceComponent } from './components/RedisService.js'
import { RedisTaskComponent } from './components/RedisTask.js'
import type { RedisAppStackProps } from './types.js'

export class RedisAppStack extends BaseStack {
  readonly taskComponent: RedisTaskComponent
  readonly serviceComponent: RedisServiceComponent

  constructor (props: RedisAppStackProps) {
    const { app, network, cluster } = props
    super({ app, stackName: 'redis-app' })

    this.taskComponent = new RedisTaskComponent({
      stack: this
    })

    this.serviceComponent = new RedisServiceComponent({
      stack: this,
      network,
      cluster,
      taskComponent: this.taskComponent
    })
  }
}