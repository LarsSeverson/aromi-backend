import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { BackendError, INDEXATION_JOB_NAMES, parseOrThrow, removeNullish, unwrapOrThrow, type PostRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import { UpdatePostSchema } from '../utils/validation.js'
import type { UpdatePostSchemaType } from '../types.js'

type Mutation = MutationResolvers['updatePost']

export class UpdatePostResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  async resolve () {
    const { context } = this
    const { services } = context

    const { post } = await services.withTransaction(async trx => {
      this.trxServices = trx
      return await this.handleResolve()
    })

    await this.handleIndex(post)

    return post
  }

  private async handleResolve () {
    const parsed = this.validateArguments()

    await unwrapOrThrow(this.validateAssets(parsed))

    const currentPost = await unwrapOrThrow(this.getPost(parsed))
    this.checkAuthorized(currentPost)

    const post = await unwrapOrThrow(this.updatePost(parsed))

    await unwrapOrThrow(this.deleteOldAssets(parsed))
    await unwrapOrThrow(this.updateExistingAssets(parsed))
    const assets = await unwrapOrThrow(this.createAssets(parsed))

    return { post, assets }
  }

  private handleIndex (post: PostRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.UPDATE_POST,
      data: post
    })
  }

  private validateArguments () {
    const { args } = this
    const { input } = args

    const parsed = parseOrThrow(UpdatePostSchema, input)

    return parsed
  }

  private validateAssets (parsed: UpdatePostSchemaType) {
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

  private getPost (parsed: UpdatePostSchemaType) {
    const { id } = parsed
    const { posts } = this.trxServices!

    return posts.findOne(
      where => where('id', '=', id)
    )
  }

  private updatePost (parsed: UpdatePostSchemaType) {
    const { posts } = this.trxServices!

    const values = removeNullish(parsed) as Partial<PostRow>

    return posts.updateOne(
      where => where('id', '=', parsed.id),
      values
    )
  }

  private deleteOldAssets (parsed: UpdatePostSchemaType) {
    const { id: postId } = parsed
    const { posts } = this.trxServices!

    const incomingAssets = parsed.assets ?? []
    const keepIds = incomingAssets
      .map(a => a.id)
      .filter(id => id != null)

    return posts.assets.softDelete(
      where => where.and([
        where('postId', '=', postId),
        where('id', 'not in', keepIds)
      ])
    )
  }

  private updateExistingAssets (parsed: UpdatePostSchemaType) {
    const { id: postId } = parsed
    const { posts } = this.trxServices!

    const incomingAssets = parsed.assets ?? []
    const updates = incomingAssets.filter(a => a.id != null)

    if (updates.length === 0) return okAsync([])

    const updatePromises = updates.map(asset => {
      return posts.assets.updateOne(
        where => where.and([
          where('id', '=', asset.id!),
          where('postId', '=', postId)
        ]),
        {
          assetId: asset.assetId,
          displayOrder: asset.displayOrder
        }
      )
    })

    return ResultAsync.combine(updatePromises)
  }

  private createAssets (parsed: UpdatePostSchemaType) {
    const { id: postId } = parsed
    const { posts } = this.trxServices!

    const incomingAssets = parsed.assets ?? []
    const creates = incomingAssets.filter(a => a.id == null)

    if (creates.length === 0) return okAsync([])

    const createValues = creates.map(asset => ({
      postId,
      assetId: asset.assetId,
      displayOrder: asset.displayOrder
    }))

    return posts.assets.create(createValues)
  }

  private checkAuthorized (post: PostRow) {
    const { me } = this

    if (post.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to update this post.',
        403
      )
    }
  }
}