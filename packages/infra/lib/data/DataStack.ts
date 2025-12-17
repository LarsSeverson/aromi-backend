import { BaseStack } from '../../common/BaseStack.js'
import { AssetsBucketConstruct } from './assetsBucket/AssetsBucketConstruct.js'
import { DatabaseConstruct } from './database/DatabaseConstruct.js'
import { FileSystemConstruct } from './filesystem/FileSystemConstruct.js'
import { SpaBucketConstruct } from './spaBucket/SpaBucketConstruct.js'
import type { DataStackProps } from './types.js'

export class DataStack extends BaseStack {
  readonly database: DatabaseConstruct
  readonly fileSystem: FileSystemConstruct

  readonly spaBucket: SpaBucketConstruct
  readonly assetsBucket: AssetsBucketConstruct

  constructor (props: DataStackProps) {
    const { scope, config, foundationStack } = props
    super({ scope, stackName: 'data', config })

    this.database = new DatabaseConstruct({
      scope: this,
      foundationStack,
      config
    })

    this.fileSystem = new FileSystemConstruct({
      scope: this,
      foundationStack,
      config
    })

    this.spaBucket = new SpaBucketConstruct({
      scope: this,
      config
    })

    this.assetsBucket = new AssetsBucketConstruct({
      scope: this,
      config
    })
  }
}