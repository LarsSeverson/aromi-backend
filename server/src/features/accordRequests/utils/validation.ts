import { ValidAccordColor, ValidAccordDescription, ValidAccordImageSize, ValidAccordImageType, ValidAccordName, ValidVersion } from '@aromi/shared/db'
import z from 'zod'

export const CreateAccordRequestSchema = z
  .object({
    name: ValidAccordName.nullish(),
    description: ValidAccordDescription,
    color: ValidAccordColor.nullish()
  })
  .strip()

export const UpdateAccordRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidAccordName.nullish(),
    description: ValidAccordDescription,
    color: ValidAccordColor.nullish()
  })
  .strip()

export const MAX_ACCORD_IMAGE_SIZE = 2_000_000 // 2 MB

export const StageAccordRequestImageSchema = z
  .object({
    contentType: ValidAccordImageType,
    contentSize: ValidAccordImageSize
  })
  .strip()

export const FinalizeAccordRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
