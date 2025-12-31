import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class HealthQueryResolvers extends BaseResolver<QueryResolvers> {
  healthy: QueryResolvers['healthy'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { sources } = context

    await sources.checkHealth()

    return 'Yes'
  }

  getResolvers (): QueryResolvers {
    return {
      healthy: this.healthy
    }
  }
}