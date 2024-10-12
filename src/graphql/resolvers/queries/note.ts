import { Context } from '@src/context'
import { GraphQLResolveInfo } from 'graphql'

export interface Note {
    id: number
    name: string
}

//
interface NoteArgs {
    id: number | 0
}

const note = async (parent: undefined, args: NoteArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Note> => {
  const id = args.id

  const res = await ctx.pool.query('SELECT * FROM notes WHERE id = $1', [id])
  const note = res.rows[0]

  return note as Note
}

//
interface NotesArgs {
    limit: number | 0
}

const notes = async (parent: undefined, args: NotesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Note[]> => {
  const limit = args.limit

  const res = await ctx.pool.query('SELECT * FROM notes LIMIT = $1', [limit])
  const notes = res.rows

  return notes as Note[]
}

export { note, notes }
