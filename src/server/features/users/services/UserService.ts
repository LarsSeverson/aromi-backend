import { type DataSources } from '@src/server/datasources'
import { TableService } from '@src/server/services/TableService'
import { type UserRow } from '../types'

export class UserService extends TableService<'users', UserRow> {
  constructor (sources: DataSources) {
    super(sources, 'users')
  }
}
