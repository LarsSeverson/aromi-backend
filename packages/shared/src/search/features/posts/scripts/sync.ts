import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceService, PostService, UserService } from '@src/db/index.js'
import { PostSearchService } from '../services/PostSearchService.js'
import { unwrapOrThrow } from '@src/utils/error.js'

export const syncPosts = async (sources: DataSources) => {
  const userService = new UserService(sources)
  const fragranceService = new FragranceService(sources)
  const postService = new PostService(sources)
  const postSearch = new PostSearchService(sources)

  const posts = await unwrapOrThrow(postService.find())

  const users = await unwrapOrThrow(userService.find(
    where => where('id', 'in', posts.map(p => p.userId))
  ))

  const fragrances = await unwrapOrThrow(fragranceService.find(
    where => where('id', 'in', posts.map(p => p.fragranceId).filter((id): id is string => id != null))
  ))

  const userMap = new Map(users.map(u => [u.id, u]))
  const fragranceMap = new Map(fragrances.map(f => [f.id, f]))

  const postsWithRelations = posts.map(post => ({
    post,
    user: userMap.get(post.userId)!,
    fragrance: post.fragranceId == null
      ? undefined
      : fragranceMap.get(post.fragranceId) ?? undefined
  }))

  const docs = postsWithRelations.map(row => postSearch.fromRow(row))

  console.log('\n--- Post Sync ---')
  console.log(`Fetched ${posts.length} posts from database`)
  console.log(`Indexing ${docs.length} post documents into search index\n`)

  return await unwrapOrThrow(postSearch.addDocuments(docs))
}