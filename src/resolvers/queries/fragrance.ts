import { Context } from '@src/context'
import { GraphQLResolveInfo } from 'graphql'
import { Note } from './note'
import { Accord } from './accord'

export interface Fragrance {
  id: number
  brand: string
  name: string
  rating: number
  reviewCount: number
  likes: number
  dislikes: number
  gender: number
  longevity: number
  sillage: number
  complexity: number
  balance: number
  allure: number
  accords: Accord[]
  notes: Note[]
}

//
interface FragranceArgs {
  id: number | 0
}

const fragrance = async (parent: undefined, args: FragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance> => {
  const id = args.id

  const fragranceRes = await ctx.pool.query('SELECT * FROM fragrances WHERE id = $1', [id])

  const fragranceAccordsRes = await ctx.pool.query(
          `SELECT a.id, a.name, fa.concentration
           FROM fragrance_accords fa
           JOIN accords a ON fa.accord_id = a.id
           WHERE fa.fragrance_id = $1
          `,
          [id]
  )

  const fragranceNotesRes = await ctx.pool.query(
          `SELECT n.id, n.name, fn.note_type, fn.concentration
           FROM fragrance_notes fn
           JOIN notes n ON fn.note_id = n.id
           WHERE fn.fragrance_id = $1 
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
  } as Fragrance
}

// `SELECT f.* FROM fragrances f
//  LEFT JOIN user_interactions ui ON ui.fragrance_id = f.id AND ui.user_id = $1
//  WHERE ui.fragrance_id IS NULL
//  LIMIT $2`

//
interface FragrancesArgs {
  limit: number | 0
}

const fragrances = async (parent: undefined, args: FragrancesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance[]> => {
  const limit = args.limit

  const res = await ctx.pool.query('SELECT * FROM fragrances LIMIT $1', [limit])
  const fragrances = res.rows

  return fragrances as Fragrance[]
}

export { fragrance, fragrances }
