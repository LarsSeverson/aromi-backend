import { type MutationResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { ApiError, throwError } from '@src/common/error'
import { z } from 'zod'
import { parseSchema } from '@src/common/schema'
import { type ReviewReportRow } from '@src/services/repositories/ReviewReportsRepo'
import { type ReviewReportSummary } from '@src/schemas/fragrance/mappers'

export class ReviewReportResolver extends ApiResolver {
  createReport: MutationResolvers['createReviewReport'] = async (parent, args, context, info) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before creating a report',
        403
      )
    }

    parseSchema(CreateReviewReportSchema, input)

    const userId = me.id
    const { reviewId, report } = input

    return await services
      .fragrance
      .reviews
      .reports
      .create({ reviewId, userId, report })
      .match(
        mapReviewReportRowToReportSummary,
        throwError
      )
  }
}

export const mapReviewReportRowToReportSummary = (row: ReviewReportRow): ReviewReportSummary => {
  const { id, report } = row

  return {
    id,
    report
  }
}

export const CreateReviewReportSchema = z
  .object({
    report: z
      .string()
      .min(100, 'Report must be at least 100 characters')
      .max(1000, 'Report must be 1000 characters or less')
  })
