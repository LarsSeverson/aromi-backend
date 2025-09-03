import type { DataSources } from '@src/server/datasources'

export abstract class ApiService {
  sources: DataSources

  constructor (sources: DataSources) {
    this.sources = sources
  }
}
