import { type Accord, type QueryResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { throwError } from '@src/common/error'
import { type AccordRow } from '@src/services/AccordService'

export class AccordResolver extends ApiResolver {
  accords: QueryResolvers['accords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const processed = this.paginationFactory.process(input)

    return await services
      .accord
      .paginate(processed)
      .match(
        rows => this.newPage(
          rows,
          processed,
          (row) => String(row[processed.column]),
          mapAccordRowToAccord
        ),
        throwError
      )
  }
}

export const mapAccordRowToAccord = (row: AccordRow): Accord => {
  const {
    id,
    name,
    color,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    name,
    color,
    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}
