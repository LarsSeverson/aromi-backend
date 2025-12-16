import { BaseStack } from '../../common/BaseStack.js'
import { ServerIamComponent } from './components/ServerIam.js'
import { ServerServiceComponent } from './components/ServerService.js'
import { ServerTaskComponent } from './components/ServerTask.js'
import type { ServerAppStackProps } from './types.js'

export class ServerAppStack extends BaseStack {
  readonly iamComponent: ServerIamComponent

  readonly taskComponent: ServerTaskComponent
  readonly serviceComponent: ServerServiceComponent

  constructor (props: ServerAppStackProps) {
    const {
      scope: app,

      network,
      auth,
      storage,
      database,
      cdn,
      cluster,
      loadBalancer,
      ecr,

      meili,
      redis
    } = props

    super({ scope: app, stackName: 'server-app' })

    this.iamComponent = new ServerIamComponent({
      stack: this,
      auth,
      storage
    })

    this.taskComponent = new ServerTaskComponent({
      stack: this,
      auth,
      storage,
      database,
      cdn,
      ecr,

      iam: this.iamComponent,

      meili,
      redis
    })

    this.serviceComponent = new ServerServiceComponent({
      stack: this,

      network,
      cluster,
      loadBalancer,

      taskComponent: this.taskComponent,

      redis
    })
  }
}