import { ValidBrandDescription, ValidBrandImageSize, ValidBrandImageType, ValidBrandName, ValidBrandWebsite, ValidVersion } from '@src/db'
import z from 'zod'

export const CreateBrandRequestSchema = z
  .object({
    name: ValidBrandName.nullish(),
    description: ValidBrandDescription,
    website: ValidBrandWebsite
  })
  .strip()

export const UpdateBrandRequestSchema = z
  .object({
    version: ValidVersion,
    name: ValidBrandName.nullish(),
    description: ValidBrandDescription,
    website: ValidBrandWebsite
  })
  .strip()

export const StageBrandRequestImageSchema = z
  .object({
    contentType: ValidBrandImageType,
    contentSize: ValidBrandImageSize
  })
  .strip()

export const FinalizeBrandRequestImageSchema = z
  .object({
    version: ValidVersion
  })
  .strip()
