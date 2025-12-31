import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { PostRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { PostAssetService } from './PostAssetService.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import { PostCommentService } from './PostCommentService.js'

export class PostService extends FeaturedTableService<PostRow> {
  assets: PostAssetService
  comments: PostCommentService

  constructor (sources: DataSources) {
    super(sources, 'posts')
    this.assets = new PostAssetService(sources)
    this.comments = new PostCommentService(sources)
  }

  findAssets (
    where?: ExpressionOrFactory<DB, 'posts', SqlBool>
  ) {
    const db = this.db

    let query = db
      .selectFrom('posts')
      .innerJoinLateral(
        eb => eb
          .selectFrom('postAssets')
          .selectAll('postAssets')
          .whereRef('postAssets.postId', '=', 'posts.id')
          .where('postAssets.deletedAt', 'is', null)
          .orderBy('postAssets.displayOrder', 'asc')
          .as('a'),
        join => join.onTrue()
      )
      .selectAll('a')
      .where('posts.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }
}