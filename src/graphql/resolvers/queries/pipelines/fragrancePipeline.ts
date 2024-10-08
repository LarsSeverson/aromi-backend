import { Context, util } from '@aws-appsync/utils'
import { FragranceAccords } from '../fragranceAccords'
import { Fragrance } from '../fragrance'
import { FragranceNotes } from '../fragranceNotes'

export interface FragrancePipeline extends Fragrance {
    accords?: FragranceAccords | null
    notes?: FragranceNotes | null
}

interface FragrancePipelineArgs {
    id: number
}

export const request = (ctx: Context): void => {
  const { id }: FragrancePipelineArgs = ctx.args
}

export const response = (ctx: Context): any => {
  const { error, result } = ctx

  if (error) {
    return util.appendError(
      error.message,
      error.type,
      result
    )
  }

  const fragrance = ctx.stash.fragrance
  const accords = ctx.stash.accords || null
  const notes = ctx.stash.notes || null

  fragrance.accords = accords
  fragrance.notes = notes

  return fragrance as FragrancePipeline
}
