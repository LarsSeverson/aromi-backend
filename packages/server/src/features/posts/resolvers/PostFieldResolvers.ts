import { BackendError, unwrapOrThrow } from '@aromi/shared'
import { mapFragranceRowToFragranceSummary } from '@src/features/fragrances/utils/mappers.js'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { PostResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { PostCommentPaginationFactory } from '../factories/PostCommentPaginationFactory.js'

export class PostFieldResolvers extends BaseResolver<PostResolvers> {
  private readonly commentPagination = new PostCommentPaginationFactory()

  user: PostResolvers['user'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { userId } = post

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

  fragrance: PostResolvers['fragrance'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { fragranceId } = post

    if (fragranceId == null) return null

    const fragrance = await unwrapOrThrow(
      loaders.fragrances.load(fragranceId)
    )

    if (fragrance == null) return null

    return mapFragranceRowToFragranceSummary(fragrance)
  }

  assets: PostResolvers['assets'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { id: postId } = post

    const assets = await unwrapOrThrow(
      loaders.posts.loadAssets(postId)
    )

    return assets
  }

  commentCount: PostResolvers['commentCount'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { id: postId } = post

    const score = await unwrapOrThrow(
      loaders.posts.loadScore(postId)
    )

    return score?.commentCount ?? 0
  }

  comments: PostResolvers['comments'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { id: postId } = post
    const { input } = args
    const { services } = context
    const { posts } = services

    const pagination = this.commentPagination.parse(input)

    const comments = await unwrapOrThrow(
      posts.comments.find(
        where => where.and([
          where('postId', '=', postId),
          where('parentId', 'is', null)
        ]),
        { pagination }
      )
    )

    const connection = this.pageFactory.paginate(comments, pagination)

    return connection
  }

  searchComments: PostResolvers['searchComments'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { id: postId } = post
    const { input } = args
    const { services } = context
    const { search } = services

    const { term, pagination } = input ?? {}
    const offsetPagination = this.searchPagination.parse(pagination)

    const { hits } = await unwrapOrThrow(
      search
        .posts
        .comments
        .search({
          term,
          filter: `postId = ${postId}`,
          pagination: offsetPagination
        })
    )

    const connection = this.searchPageFactory.paginate(hits, offsetPagination)

    return connection
  }

  votes: PostResolvers['votes'] = async (
    post,
    args,
    context,
    info
  ) => {
    const { id: postId } = post
    const { me, loaders } = context

    const [score, myVote] = await Promise.all([
      unwrapOrThrow(
        loaders.posts.loadScore(postId)
      ),
      unwrapOrThrow(
        loaders.posts.loadUserVote(postId, me?.id)
      )
    ])

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: myVote?.vote
    }

    return votes
  }

  getResolvers (): PostResolvers {
    return {
      user: this.user,
      fragrance: this.fragrance,
      assets: this.assets,
      commentCount: this.commentCount,
      comments: this.comments,
      searchComments: this.searchComments,
      votes: this.votes
    }
  }
}