import { type FragranceTraitType, type FragranceTrait, type FragranceTraitsResolvers } from '@src/generated/gql-types'

const TRAITS_QUERY = /* sql */`
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

export const traits: FragranceTraitsResolvers['allure'] = async (parent, args, context, info) => {
  const { fragranceId } = parent
  const { user, pool } = context
  const trait = info.fieldName as FragranceTraitType

  const values = [fragranceId, user?.id, trait]
  const { rows } = await pool.query<FragranceTrait>(TRAITS_QUERY, values)

  return rows.at(0) ?? null
}
