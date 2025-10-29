import { parseOrThrow, unwrapOrThrow, ValidFragranceReport } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class FragranceReportMutationResolvers extends BaseResolver<MutationResolvers> {
  createFragranceReport: MutationResolvers['createFragranceReport'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { services } = context
    const { input } = args
    const me = this.checkAuthenticated(context)

    const { fragranceId } = input
    const { body } = parseOrThrow(ValidFragranceReport, input)
    const { fragrances } = services

    const values = {
      fragranceId,
      body,
      userId: me.id
    }

    const report = await unwrapOrThrow(fragrances.reports.createOne(values))

    return report
  }

  getResolvers (): MutationResolvers {
    return {
      createFragranceReport: this.createFragranceReport
    }
  }
}