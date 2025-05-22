import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type Selectable, type ComparisonOperatorExpression, type OperandValueExpressionOrList } from 'kysely'

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

  // Reads
  find (criteria: ServiceFindCriteria<Table>): ResultAsync<Selectable<DB[Table]>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'find() not implemented for service'
    )
  }

  findAll (criteria: ServiceFindCriteria<Table>): ResultAsync<Array<Selectable<DB[Table]>>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'findAll() not implemented for service'
    )
  }

  list (params: PaginationParams): ResultAsync<Array<Selectable<DB[Table]>>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'list() not implemented for service'
    )
  }

  // Write
  create (data: Partial<DB[Table]>): ResultAsync<DB[Table], ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'create() not implemented for service'
    )
  }

  // Update
  update (
    criteria: ServiceFindCriteria<Table>,
    changes: Partial<DB[Table]>
  ): ResultAsync<DB[Table], ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'update() not implemented for service'
    )
  }

  // Delete
  delete (
    criteria: ServiceFindCriteria<Table>
  ): ResultAsync<number, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'delete() not implemented for service'
    )
  }

  // Utils
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

// Util types
export interface MyVote { myVote: number | null }
