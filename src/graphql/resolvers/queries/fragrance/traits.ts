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
  id: number
}

export const traits = async (parent: Fragrance, args: FragranceTraitsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceTrait | null> => {
  const user = ctx.user
  const fragranceId = parent.id

  if (!fragranceId) return null

  const fields: TraitsFields = graphqlFields(info)

  const parts = traitsQueryParts(fields)
  const trait: FragranceTraitType = info.fieldName as FragranceTraitType

  const query = `--sql
    SELECT ${parts.join(',')}
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
  `
  const values = [fragranceId, user?.id, trait]

  const result = await ctx.pool.query<FragranceTrait>(query, values)

  const fragranceTrait = result.rows[0]

  return fragranceTrait
}
