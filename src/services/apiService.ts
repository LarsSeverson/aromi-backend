import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ComparisonOperatorExpression, type OperandValueExpressionOrList } from 'kysely'
import { type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'

export interface ApiServiceContext {
  me?: ApiContext['me']
}

type Table = keyof DB
type Column<T extends Table> = keyof DB[T]
type Value<T extends Table> = OperandValueExpressionOrList<DB, T, keyof DB[T]>
export type ServiceFindCriteria<T extends keyof DB> = Partial<Record<Column<T>, Value<T>>>

export abstract class ApiService<T extends Table> {
  context: ApiServiceContext = {}
  db: ApiDataSources['db']

  constructor (sources: ApiDataSources) {
    this.db = sources.db
  }

  abstract find (criteria: ServiceFindCriteria<T>): ResultAsync<unknown, ApiError>
  abstract findAll (criteria: ServiceFindCriteria<T>): ResultAsync<unknown[], ApiError>
  abstract list (params: PaginationParams): ResultAsync<unknown[], ApiError>

  setContext (context: ApiServiceContext): this {
    this.context = context
    return this
  }

  protected entries (criteria: ServiceFindCriteria<T>): Array<[Column<T>, Value<T>]> {
    return Object.entries(criteria) as Array<[Column<T>, Value<T>]>
  }

  protected operand (value: Value<T>): ComparisonOperatorExpression {
    return Array.isArray(value) ? 'in' : '='
  }
}
