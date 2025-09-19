import { ValidAccordColor, ValidAccordDescription, ValidAccordName, ValidEditReason } from '@aromi/shared'
import z from 'zod'

export const CreateAccordEditSchema = z
  .object({
    accordId: z
      .uuid('Accord ID must be a valid UUID')
      .nonoptional('Accord ID is required'),
    proposedName: ValidAccordName.nullish(),
    proposedDescription: ValidAccordDescription,
    proposedColor: ValidAccordColor.nullish(),
    reason: ValidEditReason.nullish()
  })