import { SearchService } from '@src/search/services/SearchService.js'
import type { PostCommentDoc, PostCommentFromRowParams } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { INDEX_NAMES } from '@src/search/types.js'

export class PostCommentSearchService extends SearchService<PostCommentDoc> {
  constructor (sources: DataSources) {
    super(sources, INDEX_NAMES.POST_COMMENTS)
  }

  fromRow (params: PostCommentFromRowParams): PostCommentDoc {
    const { comment, user } = params

    const commentUser = {
      id: user.id,
      username: user.username
    }

    return {
      ...comment,
      user: commentUser
    }
  }

  override createIndex () {
    return super.createIndex({ primaryKey: 'id' })
  }

  override configureIndex () {
    return super.configureIndex({
      searchableAttributes: [
        'content',
        'user.username'
      ],
      filterableAttributes: [
        'postId',
        'parentId'
      ],
      sortableAttributes: [
        'createdAt',
        'updatedAt'
      ]
    })
  }
}