import { BaseStack } from '../BaseStack.js'
import { ServerECRComponent } from './components/ServerECR.js'
import { ServerIamComponent } from './components/ServerIam.js'
import { ServerServiceComponent } from './components/ServerService.js'
import { ServerTaskComponent } from './components/ServerTask.js'
import type { ServerAppStackProps } from './types.js'

export class ServerAppStack extends BaseStack {
  readonly iamComponent: ServerIamComponent

  readonly ecrComponent: ServerECRComponent
  readonly taskComponent: ServerTaskComponent
  readonly serviceComponent: ServerServiceComponent

  constructor (props: ServerAppStackProps) {
    const {
      app,

      network,
      auth,
      storage,
      database,
      cdn,
      cluster,
      loadBalancer,

      meili,
      redis
    } = props

    super({ app, stackName: 'server-app' })

    this.iamComponent = new ServerIamComponent({
      stack: this,
      auth,
      storage
    })

    this.ecrComponent = new ServerECRComponent({
      stack: this
    })

    this.taskComponent = new ServerTaskComponent({
      stack: this,
      auth,
      storage,
      database,
      cdn,

      iam: this.iamComponent,
      ecr: this.ecrComponent,

      meili,
      redis
    })

    this.serviceComponent = new ServerServiceComponent({
      stack: this,
      network,
      cluster,
      loadBalancer,
      taskComponent: this.taskComponent
    })
  }
}