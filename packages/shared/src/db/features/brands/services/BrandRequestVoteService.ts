import type { DataSources } from '@src/datasources/index.js'
import { type BrandRequestVoteRow, TableService } from '@src/db/index.js'

export class BrandRequestVoteService extends TableService<BrandRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestVotes')
  }
}
