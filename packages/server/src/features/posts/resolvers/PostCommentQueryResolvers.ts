import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { PostCommentPaginationFactory } from '../factories/PostCommentPaginationFactory.js'
import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'

export class PostCommentQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new PostCommentPaginationFactory()

  postComment: QueryResolvers['postComment'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context
    const { posts } = services

    const comment = await unwrapOrThrow(
      posts.comments.findOne(eb => eb('id', '=', id))
    )

    return comment
  }

  postComments: QueryResolvers['postComments'] = async (
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
      posts.comments.paginate(pagination)
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      postComment: this.postComment,
      postComments: this.postComments
    }
  }
}