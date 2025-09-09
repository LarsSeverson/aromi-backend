import { DataSources } from '@aromi/shared'

export class WorkerContext {
  sources: DataSources

  constructor () {
    this.sources = new DataSources()
  }
}