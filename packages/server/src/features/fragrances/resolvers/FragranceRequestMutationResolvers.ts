import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { CreateFragranceRequestResolver } from '../helpers/CreateFragranceRequestResolver.js'
import { UpdateFragranceRequestResolver } from '../helpers/UpdateFragranceRequestResolver.js'
import { DeleteFRResolver } from '../helpers/DeleteFragranceRequestResolver.js'
import { SubmitFragranceRequestResolver } from '../helpers/SubmitFragranceRequestResolver.js'
import { SetFragranceRequestBrandResolver } from '../helpers/SetFragranceRequestBrandResolver.js'
import { SetFragranceRequestAccordsResolver } from '../helpers/SetFragranceRequestAccordsResolver.js'
import { SetFragranceRequestNotesResolver } from '../helpers/SetFragranceRequestNotesResolver.js'
import { SetFragranceRequestTraitResolver } from '../helpers/SetFragranceRequestTraitResolver.js'
import { VoteOnFragranceRequestResolver } from '../helpers/VoteOnFragranceRequestResolver.js'

export class FragranceRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  createFragranceRequest: MutationResolvers['createFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateFragranceRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  updateFragranceRequest: MutationResolvers['updateFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateFragranceRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteFragranceRequest: MutationResolvers['deleteFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteFRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitFragranceRequest: MutationResolvers['submitFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitFragranceRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  setFragranceRequestBrand: MutationResolvers['setFragranceRequestBrand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFragranceRequestBrandResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  setFragranceRequestAccords: MutationResolvers['setFragranceRequestAccords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFragranceRequestAccordsResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  setFragranceRequestNotes: MutationResolvers['setFragranceRequestNotes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFragranceRequestNotesResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  setFragranceRequestTrait: MutationResolvers['setFragranceRequestTrait'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFragranceRequestTraitResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  voteOnFragranceRequest: MutationResolvers['voteOnFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnFragranceRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      createFragranceRequest: this.createFragranceRequest,
      updateFragranceRequest: this.updateFragranceRequest,
      deleteFragranceRequest: this.deleteFragranceRequest,
      submitFragranceRequest: this.submitFragranceRequest,
      setFragranceRequestBrand: this.setFragranceRequestBrand,
      setFragranceRequestAccords: this.setFragranceRequestAccords,
      setFragranceRequestNotes: this.setFragranceRequestNotes,
      setFragranceRequestTrait: this.setFragranceRequestTrait,
      voteOnFragranceRequest: this.voteOnFragranceRequest
    }
  }
}
