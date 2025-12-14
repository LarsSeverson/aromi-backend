import { sql } from 'kysely'
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

    const { db } = sources
    await sql`SELECT 1`.execute(db)

    const { redis } = sources
    await redis.client.ping()

    const { meili } = sources
    await meili.client.health()

    return 'Yes'
  }

  getResolvers (): QueryResolvers {
    return {
      healthy: this.healthy
    }
  }
}