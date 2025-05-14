import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type ComparisonOperatorExpression, type OperandValueExpressionOrList } from 'kysely'

export interface ApiServiceContext {
  me?: ApiContext['me']
}

type Tables = keyof DB
type Column<T extends Tables> = keyof DB[T]
type Value<T extends Tables> = OperandValueExpressionOrList<DB, T, keyof DB[T]>
export type ServiceFindCriteria<T extends keyof DB> = Partial<Record<Column<T>, Value<T>>>

export interface FindAllPaginatedParams <T extends Tables> {
  criteria: ServiceFindCriteria<T>
  paginationParams: PaginationParams
}

export abstract class ApiService<Table extends Tables> {
  context: ApiServiceContext = {}
  db: ApiDataSources['db']

  constructor (sources: ApiDataSources) {
    this.db = sources.db
  }

  abstract find (criteria: ServiceFindCriteria<Table>): ResultAsync<unknown, ApiError>
  abstract findAll (criteria: ServiceFindCriteria<Table>): ResultAsync<unknown[], ApiError>
  abstract list (params: PaginationParams): ResultAsync<unknown[], ApiError>

  setContext (context: ApiServiceContext): this {
    this.context = context
    return this
  }

  protected entries <T extends Tables>(criteria: ServiceFindCriteria<T>): Array<[Column<T>, Value<T>]> {
    return Object.entries(criteria) as Array<[Column<T>, Value<T>]>
  }

  protected operand <T extends Tables>(value: Value<T>): ComparisonOperatorExpression {
    return Array.isArray(value) ? 'in' : '='
  }
}
