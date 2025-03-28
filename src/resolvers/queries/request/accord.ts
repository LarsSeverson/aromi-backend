import { type AccordRequest, type QueryResolvers } from '@src/generated/gql-types'

const ACCORD_REQUEST_BY_QUERY = /* sql */`
  SELECT 
    id, 
    name, 
    color, 
    created_at as "dCreated", 
    updated_at as "dModified", 
    deleted_at as "dDeleted", 
    user_id as "user", 
    state
  FROM accord_request
  WHERE id = $1 AND deleted_at IS NULL
`

// If you pull in anything from the User table, it wont work.
// I need to learn how to fix that. The core table without Querying User works
// ANDY: Look at how I do it for the User.reviews. Each review has a user field and fragrance
export const accordRequest: QueryResolvers['accordRequest'] = async (parent, args, context, info) => {
  const { pool } = context
  const { id } = args

  const values = [id]
  const { rows } = await pool.query<AccordRequest>(ACCORD_REQUEST_BY_QUERY, values)
  return rows.at(0) ?? null
}
