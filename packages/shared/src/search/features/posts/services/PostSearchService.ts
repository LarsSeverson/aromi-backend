import type { DataSources } from '@src/datasources/index.js'
import { SearchService } from '@src/search/services/SearchService.js'
import type { PostDoc, PostFromRowParams } from '../types.js'
import { INDEX_NAMES } from '@src/search/types.js'
import { PostCommentSearchService } from './PostCommentSearchService.js'
import { getTextFromContent } from '@src/utils/tiptap.js'

export class PostSearchService extends SearchService<PostDoc> {
  comments: PostCommentSearchService

  constructor (sources: DataSources) {
    super(sources, INDEX_NAMES.POSTS)
    this.comments = new PostCommentSearchService(sources)
  }

  fromRow (params: PostFromRowParams): PostDoc {
    const { post, user, fragrance } = params

    const postUser = {
      id: user.id,
      username: user.username
    }

    const postFragrance = fragrance == null
      ? undefined
      : {
        id: fragrance.id,
        name: fragrance.name
      }

    const content = getTextFromContent(post.content)
    const postWithContent = { ...post, content }

    return {
      ...postWithContent,
      user: postUser,
      fragrance: postFragrance
    }
  }

  override createIndex () {
    return super.createIndex({ primaryKey: 'id' })
  }

  override configureIndex () {
    return super.configureIndex({
      searchableAttributes: [
        'title',
        'content',
        'user.username',
        'fragrance.name'
      ],
      sortableAttributes: [
        'createdAt',
        'updatedAt'
      ]
    })
  }
}
