import { VALID_IMAGE_TYPES, ValidVote } from '@aromi/shared'
import z from 'zod'

export const VoteOnRequestSchema = z
  .object({
    vote: ValidVote
  })
  .strip()

export const GenericStageRequestAssetSchema = z
  .object({
    contentType: z
      .union([
        z.string(),
        z.enum(VALID_IMAGE_TYPES)
      ]),
    contentSize: z.number()
  })
  .strip()