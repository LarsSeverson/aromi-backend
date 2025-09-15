import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { FragranceRequestBrandMutationResolvers } from './FragranceRequestBrandMutationResolvers.js'
import { FragranceRequestImageMutationResolvers } from './FragranceRequestImageMutationResolvers.js'
import { FragranceRequestTraitMutationResolvers } from './FragranceRequestTraitMutationResolvers.js'
import { FragranceRequestAccordMutationResolvers } from './FragranceRequestAccordMutationResolvers.js'
import { FragranceRequestNoteMutationResolvers } from './FragranceRequestNoteMutationResolvers.js'
import { FragranceRequestVoteMutationResolvers } from './FragranceRequestVoteMutationResolvers.js'
import { CreateFRResolver } from '../helpers/CreateFRResolver.js'
import { UpdateFRResolver } from '../helpers/UpdateFRResolver.js'
import { DeleteFRResolver } from '../helpers/DeleteFRResolver.js'
import { SubmitFRResolver } from '../helpers/SubmitFRResolver.js'

export class FragranceRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly brands = new FragranceRequestBrandMutationResolvers()
  private readonly images = new FragranceRequestImageMutationResolvers()
  private readonly traits = new FragranceRequestTraitMutationResolvers()
  private readonly accords = new FragranceRequestAccordMutationResolvers()
  private readonly notes = new FragranceRequestNoteMutationResolvers()
  private readonly votes = new FragranceRequestVoteMutationResolvers()

  createFragranceRequest: MutationResolvers['createFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateFRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  updateFragranceRequest: MutationResolvers['updateFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateFRResolver({ parent, args, context, info })
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
    const resolver = new SubmitFRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.brands.getResolvers(),
      ...this.images.getResolvers(),
      ...this.traits.getResolvers(),
      ...this.accords.getResolvers(),
      ...this.notes.getResolvers(),
      ...this.votes.getResolvers(),

      createFragranceRequest: this.createFragranceRequest,
      updateFragranceRequest: this.updateFragranceRequest,
      deleteFragranceRequest: this.deleteFragranceRequest,

      submitFragranceRequest: this.submitFragranceRequest
    }
  }
}
