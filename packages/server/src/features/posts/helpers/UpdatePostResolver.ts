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

    const currentPost = await unwrapOrThrow(this.getPost(parsed))
    this.checkAuthorized(currentPost)

    const post = await unwrapOrThrow(this.updatePost(parsed))

    return { post }
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

  private getPost (parsed: UpdatePostSchemaType) {
    const { id } = parsed
    const { posts } = this.trxServices!

    return posts.findOne(
      where => where('id', '=', id)
    )
  }

  private updatePost (parsed: UpdatePostSchemaType) {
    const { posts } = this.trxServices!

    const { content } = removeNullish(parsed)

    const values = {
      content,
      updatedAt: new Date().toISOString()
    }

    return posts.updateOne(
      where => where('id', '=', parsed.id),
      values
    )
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