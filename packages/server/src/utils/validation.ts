import { ValidVote } from '@aromi/shared'
import z from 'zod'

export const GenericVoteOnEntityInputSchema = z
  .object({
    vote: ValidVote
  })
  .strip()