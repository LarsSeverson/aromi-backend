import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord, FragranceTrait, FragranceTraitType } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface TraitsFields {
  trait: boolean
  value: boolean
  myVote: boolean
}

interface FragranceTraitsArgs {
  id: number
}

export const traits = async (parent: Fragrance, args: FragranceTraitsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceTrait | null> => {
  const user = ctx.user
  const fragranceId = parent.id

  if (!fragranceId) return null

  const fields: TraitsFields = graphqlFields(info)
  const trait: FragranceTraitType = info.fieldName as FragranceTraitType

  const query = `--sql
    SELECT
      ft.id,
      ft.value,
      COALESCE(ftv.value, 50.0) AS "myVote",
      ft.trait
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
