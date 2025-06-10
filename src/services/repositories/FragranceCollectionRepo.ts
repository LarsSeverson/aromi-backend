import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceCollectionRow = Selectable<DB['fragranceCollections']>

export class FragranceCollectionRepo extends TableService<'fragranceCollections', FragranceCollectionRow> {
  items: FragranceCollectionItemRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceCollections')

    this.items = new FragranceCollectionItemRepo(sources)
  }
}

export type FragranceCollectionItemRow = Selectable<DB['fragranceCollectionItems']>

export class FragranceCollectionItemRepo extends TableService<'fragranceCollectionItems', FragranceCollectionItemRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceCollectionItems')
  }
}
