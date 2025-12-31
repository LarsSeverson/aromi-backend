import type { DataSources } from '@src/datasources/DataSources.js'
import { PostService, UserService } from '@src/db/index.js'
import { PostSearchService } from '../services/PostSearchService.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export const syncComments = async (sources: DataSources) => {
  const userService = new UserService(sources)
  const postService = new PostService(sources)
  const postSearch = new PostSearchService(sources)

  const comments = await unwrapOrThrow(postService.comments.find())

  const userIds = comments.map(c => c.userId)

  const users = userIds.length === 0
    ? []
    : await unwrapOrThrow(
      userService.find(
        where => where('id', 'in', comments.map(c => c.userId))
      )
    )

  const userMap = new Map(users.map(u => [u.id, u]))

  const docs = comments.map(comment => {
    const user = userMap.get(comment.userId)!

    return postSearch.comments.fromRow({ comment, user })
  })

  console.log('\n--- Post Comment Sync ---')
  console.log(`Fetched ${comments.length} comments from database`)
  console.log(`Indexing ${docs.length} comment documents into search index\n`)

  return await unwrapOrThrow(postSearch.comments.addDocuments(docs))
}