import { ValidAccordColor, ValidAccordDescription, ValidAccordName, ValidEditReason } from '@aromi/shared'
import z from 'zod'

export const CreateAccordEditSchema = z
  .object({
    proposedName: ValidAccordName.nullish(),
    proposedDescription: ValidAccordDescription,
    proposedColor: ValidAccordColor.nullish(),
    reason: ValidEditReason.nullish()
  })