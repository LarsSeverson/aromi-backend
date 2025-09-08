import { type DataSources } from '@src/datasources/index.js'
import { type UserRow } from '../types.js'
import { TableService } from '@src/db/services/TableService.js'

export class UserService extends TableService<'users', UserRow> {
  constructor (sources: DataSources) {
    super(sources, 'users')
  }
}
