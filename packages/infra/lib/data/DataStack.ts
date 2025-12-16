import { BaseStack } from '../../common/BaseStack.js'
import { DatabaseConstruct } from './database/DatabaseConstruct.js'
import { FileSystemConstruct } from './filesystem/FileSystemConstruct.js'
import type { DataStackProps } from './types.js'

export class DataStack extends BaseStack {
  readonly database: DatabaseConstruct
  readonly fileSystem: FileSystemConstruct

  constructor (props: DataStackProps) {
    const { scope, vpc, config } = props
    super({ scope, stackName: 'data', config })

    this.database = new DatabaseConstruct({
      scope: this,
      vpc,
      config
    })

    this.fileSystem = new FileSystemConstruct({
      scope: this,
      vpc,
      config
    })
  }
}