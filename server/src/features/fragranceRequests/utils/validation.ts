import { ValidVersion } from '@aromi/shared/db'
import { ValidFragranceDescription, ValidFragranceImageSize, ValidFragranceImageType, ValidFragranceName, ValidFragranceReleaseYear } from '@aromi/shared/db/features/fragrances/validation'
import z from 'zod'

export const CreateFragranceRequestSchema = z
  .object({
    name: ValidFragranceName.nullish(),
    description: ValidFragranceDescription,
    releaseYear: ValidFragranceReleaseYear
  })
  .strip()

export const UpdateFragranceRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidFragranceName.nullish(),
    description: ValidFragranceDescription,
    releaseYear: ValidFragranceReleaseYear
  })
  .strip()

export const StageFragranceRequestImageSchema = z
  .object({
    contentType: ValidFragranceImageType,
    contentSize: ValidFragranceImageSize
  })
  .strip()

export const FinalizeFragranceRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
