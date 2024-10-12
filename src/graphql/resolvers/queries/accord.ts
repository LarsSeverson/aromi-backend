import { Context } from '@src/context'
import { GraphQLResolveInfo } from 'graphql'

export interface Accord {
    id: number
    name: string
}

//
interface AccordArgs {
    id: number | 0
}

const accord = async (parent: undefined, args: AccordArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Accord> => {
  const id = args.id

  const res = await ctx.pool.query('SELECT * FROM accords WHERE id = $1', [id])
  const accord = res.rows[0]

  return accord as Accord
}

//
interface AccordsArgs {
    limit: number | 0
}

const accords = async (parent: undefined, args: AccordsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Accord[]> => {
  const limit = args.limit

  const res = await ctx.pool.query('SELECT * FROM accords LIMIT = $1', [limit])
  const accords = res.rows

  return accords as Accord[]
}

export { accord, accords }
