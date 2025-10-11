import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { MoveFragranceCollectionItemsResolver } from '../helpers/MoveFragranceCollectionItemResolver.js'
import { CreateFragranceCollectionItemResolver } from '../helpers/CreateFragranceCollectionItemResolver.js'
import { RemoveFragranceCollectionItemResolver } from '../helpers/RemoveFragranceCollectionItemResolver.js'

export class FragranceCollectionItemMutationResolvers extends BaseResolver<MutationResolvers> {
  createFragranceCollectionItem: MutationResolvers['createFragranceCollectionItem'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateFragranceCollectionItemResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  moveFragranceCollectionItems: MutationResolvers['moveFragranceCollectionItems'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new MoveFragranceCollectionItemsResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  removeFragranceCollectionItem: MutationResolvers['removeFragranceCollectionItem'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new RemoveFragranceCollectionItemResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): MutationResolvers {
    return {
      createFragranceCollectionItem: this.createFragranceCollectionItem,
      moveFragranceCollectionItems: this.moveFragranceCollectionItems,
      removeFragranceCollectionItem: this.removeFragranceCollectionItem
    }
  }
}