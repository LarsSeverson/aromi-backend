import { ValidVote } from '@aromi/shared'
import z from 'zod'

export const VoteOnRequestSchema = z
  .object({
    vote: ValidVote
  })
  .strip()

export type VoteOnRequestInput = z.infer<typeof VoteOnRequestSchema>