import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { PostPaginationFactory } from '../factories/PostPaginationFactory.js'
import { PostCommentQueryResolvers } from './PostCommentQueryResolvers.js'

export class PostQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new PostPaginationFactory()
  private readonly comments = new PostCommentQueryResolvers()

  post: QueryResolvers['post'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context
    const { posts } = services

    const post = await unwrapOrThrow(
      posts.findOne(eb => eb('id', '=', id))
    )

    return post
  }

  posts: QueryResolvers['posts'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const { posts } = services

    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(
      posts.paginate(pagination)
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
  }

  searchPosts: QueryResolvers['searchPosts'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const { search } = services

    const { term, pagination } = input ?? {}
    const offsetPagination = this.searchPagination.parse(pagination)

    const { hits } = await unwrapOrThrow(
      search.posts.search({
        term,
        pagination: offsetPagination
      })
    )

    const connection = this.searchPageFactory.paginate(hits, offsetPagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      post: this.post,
      posts: this.posts,
      searchPosts: this.searchPosts,
      ...this.comments.getResolvers()
    }
  }
}