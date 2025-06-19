import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { FragranceReviewsRepo } from './repositories/FragranceReviewsRepo'
import { FragranceCollectionRepo } from './repositories/FragranceCollectionRepo'
import { FragranceVotesRepo } from './repositories/FragranceVotesRepo'

export type UserRow = Selectable<DB['users']>

export class UserService extends TableService<'users', UserRow> {
  collections: FragranceCollectionRepo
  votes: FragranceVotesRepo
  reviews: FragranceReviewsRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'users')

    this.collections = new FragranceCollectionRepo(sources)
    this.votes = new FragranceVotesRepo(sources)
    this.reviews = new FragranceReviewsRepo(sources)
  }
}
