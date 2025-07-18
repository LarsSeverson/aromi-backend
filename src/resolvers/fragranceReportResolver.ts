import { type MutationResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { ApiError, throwError } from '@src/common/error'
import { type FragranceReportRow } from '@src/services/repositories/FragranceReportsRepo'
import { type FragranceReportSummary } from '@src/schemas/fragrance/mappers'
import { z } from 'zod'
import { parseSchema } from '@src/common/schema'

export class FragranceReportResolver extends ApiResolver {
  createReport: MutationResolvers['createFragranceReport'] = async (parent, args, context, info) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to sign up or log in before creating a report',
        403
      )
    }

    parseSchema(CreateReportSchema, input)

    const userId = me.id
    const { fragranceId, report } = input

    return await services
      .fragrance
      .reports
      .create({ fragranceId, userId, report })
      .match(
        mapFragranceReportRowToFragranceReportSummary,
        throwError
      )
  }
}

export const mapFragranceReportRowToFragranceReportSummary = (row: FragranceReportRow): FragranceReportSummary => {
  const { id, report } = row

  return {
    id,
    report
  }
}

export const CreateReportSchema = z
  .object({
    report: z
      .string()
      .min(100, 'Report must be at least 100 characters')
      .max(1000, 'Report must be 1000 characters or less')
  })
