import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord, FragranceTrait, FragranceTraitType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface TraitsFields {
  trait: boolean
  value: boolean
  myVote: boolean
}

const traitsQueryParts = (fields: TraitsFields): string[] => {
  const parts: string[] = []

  if (fields.trait) parts.push("'trait', ft.trait")
  if (fields.value) parts.push("'value', ft.value")
  if (fields.myVote) parts.push("'myVote', COALESCE(ftv.value, 0.0)")

  return parts
}

interface FragranceTraitsArgs {
  limit: number
  offset: number
}

export const traits = async (parent: Fragrance, args: FragranceTraitsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceTrait[] | null> => {
  const userId = ctx.userId || null
  const fragranceId = parent.id
  const { limit = 10, offset = 0 } = args

  if (!fragranceId) return null

  const fields: TraitsFields = graphqlFields(info)

  const parts = traitsQueryParts(fields)
  const trait: FragranceTraitType = info.fieldName as FragranceTraitType

  const query = `
    SELECT JSONB_BUILD_OBJECT(${parts.join(',')}) AS trait
    FROM fragrance_traits ft
    LEFT JOIN LATERAL (
      SELECT value
      FROM fragrance_trait_votes
      WHERE fragrance_trait_id = ft.id
        AND user_id = $2
      LIMIT 1
    ) ftv ON true
    WHERE ft.fragrance_id = $1
      AND ft.trait = $3::fragrance_trait
    LIMIT $4
    OFFSET $5
  `
  const values = [fragranceId, userId, trait, limit, offset]

  const result = await ctx.pool.query<{'trait': FragranceTrait[]}>(query, values)

  const traits = result.rows[0].trait

  return traits
}
