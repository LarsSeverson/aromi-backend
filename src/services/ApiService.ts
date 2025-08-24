import type { DataSources } from '@src/datasources'

export abstract class ApiService {
  sources: DataSources

  constructor (sources: DataSources) {
    this.sources = sources
  }
}
