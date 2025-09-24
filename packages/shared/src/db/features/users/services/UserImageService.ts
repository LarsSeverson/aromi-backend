import type { UserImageRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { TableService } from '@src/db/services/TableService.js'

export class UserImageService extends TableService<UserImageRow> {
  constructor (sources: DataSources) {
    super(sources, 'userImages')
  }
}