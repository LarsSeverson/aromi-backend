import { BackendError, INDEXATION_JOB_NAMES, parseOrThrow, removeNullish, unwrapOrThrow, type PostCommentRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import type { UpdatePostCommentSchemaType } from '../types.js'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { UpdatePostCommentSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['updatePostComment']

export class UpdatePostCommentResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  async resolve () {
    const { context } = this
    const { services } = context

    const { comment } = await services.withTransaction(async trx => {
      this.trxServices = trx
      return await this.handleResolve()
    })

    return comment
  }

  private async handleResolve () {
    const parsed = this.validateArguments()

    await unwrapOrThrow(this.validateAssets(parsed))

    const currentReply = await unwrapOrThrow(this.getReply(parsed))
    this.checkAuthorized(currentReply)

    const comment = await unwrapOrThrow(this.updateReply(parsed))

    await unwrapOrThrow(this.deleteOldAssets(parsed))
    await unwrapOrThrow(this.updateExistingAssets(parsed))
    const assets = await unwrapOrThrow(this.createAssets(parsed))

    return { comment, assets }
  }

  private handleIndex (comment: PostCommentRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.UPDATE_POST_COMMENT,
      data: comment
    })
  }

  private validateArguments () {
    const { args } = this
    const { input } = args

    const parsed = parseOrThrow(UpdatePostCommentSchema, input)

    return parsed
  }

  private validateAssets (parsed: UpdatePostCommentSchemaType) {
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
      .andThen(foundAssets => {
        if (foundAssets.length !== assetIds.length) {
          return errAsync(
            new BackendError(
              'NOT_FOUND',
              'One or more assets not found',
              404
            )
          )
        }

        return okAsync(foundAssets)
      })
  }

  private getReply (parsed: UpdatePostCommentSchemaType) {
    const { id } = parsed
    const { posts } = this.trxServices!

    return posts.comments.findOne(
      where => where('id', '=', id)
    )
  }

  private updateReply (parsed: UpdatePostCommentSchemaType) {
    const { posts } = this.trxServices!

    const values = removeNullish(parsed) as Partial<PostCommentRow>

    return posts.comments.updateOne(
      where => where('id', '=', parsed.id),
      values
    )
  }

  private deleteOldAssets (parsed: UpdatePostCommentSchemaType) {
    const { id: commentId } = parsed
    const { posts } = this.trxServices!

    const incomingAssets = parsed.assets ?? []
    const keepIds = incomingAssets
      .map(a => a.id)
      .filter(id => id != null)

    return posts.comments.assets.softDelete(
      where => where.and([
        where('commentId', '=', commentId),
        where('id', 'not in', keepIds)
      ])
    )
  }

  private updateExistingAssets (parsed: UpdatePostCommentSchemaType) {
    const { id: commentId } = parsed
    const { posts } = this.trxServices!

    const incomingAssets = parsed.assets ?? []
    const updates = incomingAssets.filter(asset => asset.id != null)

    if (updates.length === 0) return okAsync([])

    const updatePromises = updates.map(asset =>
      posts.comments.assets.updateOne(
        where => where.and([
          where('id', '=', asset.id!),
          where('commentId', '=', commentId)
        ]),
        {
          assetId: asset.assetId,
          displayOrder: asset.displayOrder
        }
      )
    )

    return ResultAsync.combine(updatePromises)
  }

  private createAssets (parsed: UpdatePostCommentSchemaType) {
    const { id: commentId } = parsed
    const { posts } = this.trxServices!

    const incomingAssets = parsed.assets ?? []
    const creates = incomingAssets.filter(asset => asset.id == null)

    if (creates.length === 0) return okAsync([])

    const createValues = creates.map(asset => ({
      commentId,
      assetId: asset.assetId,
      displayOrder: asset.displayOrder
    }))

    return posts.comments.assets.create(createValues)
  }

  private checkAuthorized (comment: PostCommentRow) {
    const { me } = this
    if (comment.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to update this comment',
        403
      )
    }
  }
}