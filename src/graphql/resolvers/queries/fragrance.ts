import { Context } from '@src/context'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

interface FragranceArgs {
  id: number
}

export const fragrance = async (parent: undefined, args: FragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<any> => {
  const id = args.id

  const fields = graphqlFields(info)

  const fragranceFields = Object.keys(fields).filter(field => Object.keys(fields[field]).length === 0).map(field => `"${field}"`).join(', ')

  const fragranceRes = await ctx.pool.query(`SELECT ${fragranceFields} FROM fragrances_view WHERE id = $1`, [id])

  const fragranceAccordsRes = await ctx.pool.query(
          `SELECT a.id, a.name, fa.concentration
           FROM fragrance_accords_view fa
           JOIN accords a ON fa."accordID" = a.id
           WHERE fa."fragranceID" = $1
          `,
          [id]
  )

  const fragranceNotesRes = await ctx.pool.query(
          `SELECT n.id, n.name, fn.type, fn.concentration
           FROM fragrance_notes_view fn
           JOIN notes n ON fn."noteID" = n.id
           WHERE fn."fragranceID" = $1 
          `,
          [id]
  )

  const fragrance = fragranceRes.rows[0]
  const fragranceAccords = fragranceAccordsRes.rows
  const fragranceNotes = fragranceNotesRes.rows

  return {
    ...fragrance,
    accords: fragranceAccords,
    notes: fragranceNotes
  }
}
