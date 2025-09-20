import type { DataSources } from '@src/datasources/DataSources.js'
import type { NoteRequestScoreRow } from '../types.js'
import { TableService } from '@src/db/services/TableService.js'

export class NoteRequestScoreService extends TableService<NoteRequestScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestScores')
  }
}