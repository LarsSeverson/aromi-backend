import { type Accord, type QueryResolvers } from '@src/generated/gql-types'

const ACCORD_BY_ID_QUERY = /* sql */`
  SELECT
    id,
    name,
    color,
    created_at as "dCreated",
    updated_at as "dModified",
    deleted_at as "dDeleted"
  FROM accords
  WHERE id = $1 AND deleted_at IS NULL
`

const LIKE_ACCORD_NAME_QUERY = /* sql */`
  SELECT
    id,
    name,
    color,
    created_at as "dCreated",
    updated_at as "dModified",
    deleted_at as "dDeleted"
  FROM accords
  WHERE SIMILARITY(name, $1) > 0.2
`
export const accordById: QueryResolvers['accordById'] = async (parent, args, context, info) => {
  const { id } = args
  const { sources } = context
  const { db } = sources

  const values = [id]
  const { rows } = await db.query<Accord>(ACCORD_BY_ID_QUERY, values)

  return rows.at(0) ?? null
}

export const accordByLikeName: QueryResolvers['accordByLikeName'] = async (parent, args, context, info) => {
  const { name } = args
  const { sources } = context
  const { db } = sources

  const values = [name]
  const { rows } = await db.query<Accord>(LIKE_ACCORD_NAME_QUERY, values)

  return rows ?? null
}
