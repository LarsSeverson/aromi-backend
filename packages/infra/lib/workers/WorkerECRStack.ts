import type { Repository } from 'aws-cdk-lib/aws-ecr'
import { InfraStack } from '../InfraStack.js'
import type { WorkerECRStackProps } from './types.js'

export class WorkerECRStack extends InfraStack {
  readonly repository: Repository

  constructor (props: WorkerECRStackProps) {
    const { app } = props
    super({ app, stackName: 'worker-ecr' })
  }
}