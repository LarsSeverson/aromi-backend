import { type Note, type QueryResolvers } from '@src/generated/gql-types'

const NOTE_BY_ID_QUERY = /* sql */`
  SELECT
    id,
    name,
    s3_key as "url",
    created_at as "dCreated",
    updated_at as "dModified",
    deleted_at as "dDeleted"
  FROM note
  WHERE id = $1 AND deleted_at IS NULL
`

const NOTE_LIKE_NAME_QUERY = /* sql */`
  SELECT
    id,
    name,
    s3_key as "url",
    created_at as "dCreated",
    updated_at as "dModified",
    deleted_at as "dDeleted"
  FROM note
  WHERE SIMILARITY(name, $1) > 0.2
`
export const noteById: QueryResolvers['noteById'] = async (parent, args, context, info) => {
  const { id } = args
  const { sources } = context
  const { db } = sources

  const values = [id]
  const { rows } = await db.query<Note>(NOTE_BY_ID_QUERY, values)

  return rows.at(0) ?? null
}

export const noteByLikeName: QueryResolvers['noteByLikeName'] = async (parent, args, context, info) => {
  const { name } = args
  const { sources } = context
  const { db } = sources

  const values = [name]
  const { rows } = await db.query<Note>(NOTE_LIKE_NAME_QUERY, values)

  return rows ?? null
}
