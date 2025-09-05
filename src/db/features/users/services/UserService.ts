import { type DataSources } from '@src/datasources'
import { type UserRow } from '../types'
import { TableService } from '@src/db/services/TableService'

export class UserService extends TableService<'users', UserRow> {
  constructor (sources: DataSources) {
    super(sources, 'users')
  }
}
