import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { AccordRequestImageMutationResolvers } from './AccordRequestImageMutationResolvers.js'
import { AccordRequestVoteMutationResolvers } from './AccordRequestVoteMutationResolvers.js'
import { CreateARResolver } from '../helpers/CreateARResolver.js'
import { UpdateARResolver } from '../helpers/UpdateARResolver.js'
import { DeleteARResolver } from '../helpers/DeleteARResolver.js'
import { SubmitARResolver } from '../helpers/SubmitARResolver.js'

export class AccordRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly images = new AccordRequestImageMutationResolvers()
  private readonly votes = new AccordRequestVoteMutationResolvers()

  createAccordRequest: MutationResolvers['createAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateARResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  updateAccordRequest: MutationResolvers['updateAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateARResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteAccordRequest: MutationResolvers['deleteAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteARResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitAccordRequest: MutationResolvers['submitAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitARResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.images.getResolvers(),
      ...this.votes.getResolvers(),

      createAccordRequest: this.createAccordRequest,
      updateAccordRequest: this.updateAccordRequest,
      deleteAccordRequest: this.deleteAccordRequest,
      submitAccordRequest: this.submitAccordRequest
    }
  }
}
