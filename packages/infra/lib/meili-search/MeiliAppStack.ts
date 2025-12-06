import { InfraStack } from '../InfraStack.js'
import type { MeiliAppStackProps } from './types.js'
import { MeiliTaskComponent } from './components/MeiliTask.js'
import { MeiliServiceComponent } from './components/MeiliService.js'

export class MeiliAppStack extends InfraStack {
  readonly taskComponent: MeiliTaskComponent
  readonly serviceComponent: MeiliServiceComponent

  constructor (props: MeiliAppStackProps) {
    const { app, network, cluster, infra } = props
    super({ app, stackName: 'meili-app' })

    this.taskComponent = new MeiliTaskComponent({
      stack: this,
      efsComponent: infra.efsComponent
    })

    this.serviceComponent = new MeiliServiceComponent({
      stack: this,
      network,
      cluster,
      taskComponent: this.taskComponent,
      efsComponent: infra.efsComponent
    })
  }
}
