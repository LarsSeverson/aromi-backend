import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { CreateAccordRequestResolver } from '../helpers/CreateAccordRequestResolver.js'
import { UpdateAccordRequestResolver } from '../helpers/UpdateAccordRequestResolver.js'
import { DeleteAccordRequestResolver } from '../helpers/DeleteAccordRequestResolver.js'
import { SubmitAccordRequestResolver } from '../helpers/SubmitAccordRequestResolver.js'
import { StageAccordRequestThumbnailResolver } from '../helpers/StageAccordRequestThumbnailResolver.js'
import { VoteOnAccordRequestResolver } from '../helpers/VoteOnAccordRequestResolver.js'

export class AccordRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  createAccordRequest: MutationResolvers['createAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateAccordRequestResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  updateAccordRequest: MutationResolvers['updateAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateAccordRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteAccordRequest: MutationResolvers['deleteAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteAccordRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitAccordRequest: MutationResolvers['submitAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitAccordRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  stageAccordRequestThumbnail: MutationResolvers['stageAccordRequestThumbnail'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new StageAccordRequestThumbnailResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  voteOnAccordRequest: MutationResolvers['voteOnAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnAccordRequestResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): MutationResolvers {
    return {
      createAccordRequest: this.createAccordRequest,
      updateAccordRequest: this.updateAccordRequest,
      deleteAccordRequest: this.deleteAccordRequest,
      submitAccordRequest: this.submitAccordRequest,
      stageAccordRequestThumbnail: this.stageAccordRequestThumbnail,
      voteOnAccordRequest: this.voteOnAccordRequest
    }
  }
}
