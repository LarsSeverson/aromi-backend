import { type NoteRequest, type QueryResolvers } from '@src/generated/gql-types'

const NOTE_REQUEST_BY_QUERY = /* sql */`
  SELECT 
    id, 
    name, 
    s3_key as "url", 
    created_at as "dCreated", 
    updated_at as "dModified", 
    deleted_at as "dDeleted", 
    user_id as "user", 
    state
  FROM note_request
  WHERE id = $1 AND deleted_at IS NULL
`

// If you pull in anything from the User table, it wont work.
// I need to learn how to fix that. The core table without Querying User works
export const noteRequest: QueryResolvers['noteRequest'] = async (parent, args, context, info) => {
  const { id } = args
  const { sources } = context
  const { db } = sources

  const values = [id]
  const { rows } = await db.query<NoteRequest>(NOTE_REQUEST_BY_QUERY, values)

  return rows.at(0) ?? null
}
