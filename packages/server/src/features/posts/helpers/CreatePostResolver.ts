import { BackendError, INDEXATION_JOB_NAMES, parseOrThrow, unwrapOrThrow, type PostRow, type PostType } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { okAsync, errAsync } from 'neverthrow'
import { CreatePostSchema } from '../utils/validation.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import type { CreatePostSchemaType } from '../types.js'

type Mutation = MutationResolvers['createPost']

export class CreatePostResolver extends MutationResolver<Mutation> {
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

    const post = await unwrapOrThrow(this.createPost(parsed))

    const assets = await unwrapOrThrow(this.createAssets(post, parsed))

    return { post, assets }
  }

  private handleIndex (post: PostRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.INDEX_POST,
      data: post
    })
  }

  private validateArguments () {
    const { args } = this
    const { input } = args

    const parsed = parseOrThrow(CreatePostSchema, input)

    return parsed
  }

  private validateAssets (parsed: CreatePostSchemaType) {
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

  private createPost (parsed: CreatePostSchemaType) {
    const { me } = this
    const { posts } = this.trxServices!

    const userId = me.id
    const { type, title, content, fragranceId } = parsed

    const values = {
      type: type as PostType,
      title,
      content,
      userId,
      fragranceId: fragranceId ?? null
    }

    return posts.createOne(values)
  }

  private createAssets (post: PostRow, parsed: CreatePostSchemaType) {
    const { posts } = this.trxServices!

    const assets = parsed.assets ?? []

    if (assets.length === 0) return okAsync([])

    const values = assets.map(asset => ({
      postId: post.id,
      ...asset
    }))

    return posts.assets.create(values)
  }
}