import { ValidVote } from '@aromi/shared'
import z from 'zod'

export const VoteOnRequestSchema = z
  .object({
    vote: ValidVote
  })
  .strip()

export const GenericStageRequestAssetSchema = z
  .object({
    contentType: z.string(),
    contentSize: z.number()
  })
  .strip()