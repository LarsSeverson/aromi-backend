import { BackendError, unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { PostCommentResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { PostCommentPaginationFactory } from '../factories/PostCommentPaginationFactory.js'

export class PostCommentFieldResolvers extends BaseResolver<PostCommentResolvers> {
  private readonly commentPagination = new PostCommentPaginationFactory()

  parent: PostCommentResolvers['parent'] = async (
    comment,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { parentId } = comment

    if (parentId == null) return null

    const parent = await unwrapOrThrow(
      loaders.posts.comments.load(parentId)
    )

    if (parent == null) {
      throw new BackendError(
        'NOT_FOUND',
        `Post comment with ID "${parentId}" not found`,
        404
      )
    }

    return parent
  }

  user: PostCommentResolvers['user'] = async (
    comment,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { userId } = comment

    const user = await unwrapOrThrow(
      loaders.users.load(userId)
    )

    if (user == null) {
      throw new BackendError(
        'NOT_FOUND',
        `User with ID "${userId}" not found`,
        404
      )
    }

    return mapUserRowToUserSummary(user)
  }

  assets: PostCommentResolvers['assets'] = async (
    comment,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { id: postId } = comment

    const assets = await unwrapOrThrow(
      loaders.posts.comments.loadAssets(postId)
    )

    return assets
  }

  comments: PostCommentResolvers['comments'] = async (
    comment,
    args,
    context,
    info
  ) => {
    const { id: commentId } = comment
    const { input } = args
    const { services } = context
    const { posts } = services

    const pagination = this.commentPagination.parse(input)

    const comments = await unwrapOrThrow(
      posts.comments.find(
        where => where('parentId', '=', commentId),
        { pagination }
      )
    )

    const connection = this.pageFactory.paginate(comments, pagination)

    return connection
  }

  getResolvers (): PostCommentResolvers {
    return {
      parent: this.parent,
      user: this.user,
      assets: this.assets,
      comments: this.comments
    }
  }
}