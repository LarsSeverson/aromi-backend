import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import { CreatePostCommentSchema, MAX_POST_COMMENT_DEPTH } from '../utils/validation.js'
import { AGGREGATION_JOB_NAMES, BackendError, INDEXATION_JOB_NAMES, parseOrThrow, unwrapOrThrow, type PostCommentRow } from '@aromi/shared'
import type { CreatePostCommentSchemaType } from '../types.js'
import { errAsync, okAsync } from 'neverthrow'

type Mutation = MutationResolvers['createPostComment']

export class CreatePostCommentResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  async resolve () {
    const { args, context } = this
    const { services } = context

    const { comment } = await services.withTransaction(async trx => {
      this.trxServices = trx
      return await this.handleResolve()
    })

    await this.handleIndex(comment)
    await this.handleAggregation(comment.postId, args.input.parentId)

    return comment
  }

  private async handleResolve () {
    const parsed = this.validateArguments()
    await unwrapOrThrow(this.validateAssets(parsed))

    await unwrapOrThrow(this.getPost(parsed))
    const parent = await unwrapOrThrow(this.getParent(parsed))
    this.checkPostCommentDepth(parent)

    const comment = await unwrapOrThrow(this.createReply(parsed, parent))

    const assets = await unwrapOrThrow(this.createAssets(comment, parsed))

    return { comment, assets }
  }

  private handleIndex (comment: PostCommentRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.INDEX_POST_COMMENT,
      data: comment
    })
  }

  private handleAggregation (postId: string, parentId?: string | null) {
    const { queues } = this.context
    const batch = queues.aggregations.batch()

    batch.enqueue({
      jobName: AGGREGATION_JOB_NAMES.AGGREGATE_POST,
      data: {
        postId,
        type: 'comments'
      }
    })

    if (parentId != null) {
      batch.enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_POST_COMMENT,
        data: {
          commentId: parentId,
          type: 'comments'
        }
      })
    }

    return batch.run()
  }

  private validateArguments () {
    const { args } = this
    const { input } = args

    const parsed = parseOrThrow(CreatePostCommentSchema, input)

    return parsed
  }

  private validateAssets (parsed: CreatePostCommentSchemaType) {
    const { me } = this

    const assetIds = parsed.assets?.map(a => a.assetId) ?? []
    if (assetIds.length === 0) return okAsync([])

    const { assets } = this.trxServices!

    return assets.uploads
      .find(
        where => where.and([
          where('id', 'in', assetIds),
          where('userId', '=', me.id)
        ])
      )
      .andThen(found => {
        if (found.length !== assetIds.length) {
          return errAsync(
            new BackendError(
              'NOT_FOUND',
              'One or more assets not found',
              404
            )
          )
        }
        return okAsync(found)
      })
  }

  private getPost (parsed: CreatePostCommentSchemaType) {
    const { posts } = this.trxServices!
    const { postId } = parsed

    return posts.findOne(
      where => where('id', '=', postId)
    )
  }

  private getParent (parsed: CreatePostCommentSchemaType) {
    const { posts } = this.trxServices!
    const { parentId } = parsed

    if (parentId == null) return okAsync(null)

    return posts.comments.findOne(
      where => where('id', '=', parentId)
    )
  }

  private checkPostCommentDepth (parent: PostCommentRow | null) {
    if (parent == null) return
    if (parent.depth >= MAX_POST_COMMENT_DEPTH) {
      throw new BackendError(
        'BAD_REQUEST',
        `Cannot comment to a post comment with depth >= ${MAX_POST_COMMENT_DEPTH}`,
        400
      )
    }
  }

  private createReply (parsed: CreatePostCommentSchemaType, parent: PostCommentRow | null) {
    const { me } = this
    const { posts } = this.trxServices!

    const depth = (parent?.depth ?? 0) + 1
    const userId = me.id
    const { postId, parentId, content } = parsed

    return posts.comments.createOne({
      postId,
      userId,
      parentId: parentId ?? null,
      content,
      depth
    })
  }

  private createAssets (comment: PostCommentRow, parsed: CreatePostCommentSchemaType) {
    const { posts } = this.trxServices!

    const assets = parsed.assets ?? []

    if (assets.length === 0) return okAsync([])

    const values = assets.map(asset => ({
      commentId: comment.id,
      ...asset
    }))

    return posts.comments.assets.create(values)
  }
}