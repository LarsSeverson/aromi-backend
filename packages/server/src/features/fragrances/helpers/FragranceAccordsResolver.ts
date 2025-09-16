import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import { type FACursorType, FAPaginationFactory } from '../factories/FAPaginationFactory.js'
import type { CombinedFragranceAccordRow, CursorPaginationInput } from '@aromi/shared'
import { PageFactory } from '@src/factories/PageFactory.js'

type Query = FragranceResolvers['accords']

export class FragranceAccordsResolver extends RequestResolver<Query> {
  private readonly pageFactory = new PageFactory()
  private readonly pagination = new FAPaginationFactory()

  resolve () {
    const { input } = this.args
    const pagination = this.pagination.parse(input)

    return this
      .getRows(pagination)
      .map(rows => this.pageFactory.paginate(rows, pagination))
      .map(rows => this.pageFactory.transform(rows, this.mapToOutput.bind(this)))
  }

  getRows (
    pagination: CursorPaginationInput<FACursorType>
  ) {
    const { id } = this.parent
    const { services } = this.context

    const { fragrances } = services

    return fragrances
      .accords
      .findAccords(
        eb => eb('fragranceId', '=', id),
        pagination
      )
  }

  mapToOutput (
    row: CombinedFragranceAccordRow
  ) {
    const {
      id,

      accordId,
      accordName,
      accordColor,
      accordDescription
    } = row

    return {
      id,
      accord: {
        id: accordId,
        name: accordName,
        color: accordColor,
        description: accordDescription
      }
    }
  }

}