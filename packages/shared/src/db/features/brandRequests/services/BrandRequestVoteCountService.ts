import { TableService } from '@src/db/services/TableService.js'
import type { BrandRequestVoteCountRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class BrandRequestVoteCountService extends TableService<BrandRequestVoteCountRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestVoteCounts')
  }
}