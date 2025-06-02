import { type ApiDataSources } from '@src/datasources/datasources'
import { type DB } from '@src/db/schema'
import { type ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type Selectable, type ComparisonOperatorExpression, type OperandValueExpressionOrList } from 'kysely'
import { type SortColumn } from '@src/common/types'
import { ApiService } from './apiService'
import { type UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser'

export type Tables = keyof DB
export type Column<T extends Tables> = keyof DB[T]
export type Row<T extends Tables> = Selectable<DB[T]>
export type Value<T extends Tables> = OperandValueExpressionOrList<DB, T, keyof DB[T]>
export type ServiceFindCriteria<T extends keyof DB> = Partial<Record<Column<T>, Value<T>>>

export abstract class DBService<Table extends Tables> extends ApiService {
  db: ApiDataSources['db']

  constructor (sources: ApiDataSources) {
    super(sources)
    this.db = sources.db
  }

  find (
    criteria: ServiceFindCriteria<Table>
  ): ResultAsync<Selectable<DB[Table]>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'find() not implemented for service'
    )
  }

  findAll (
    criteria: ServiceFindCriteria<Table>
  ): ResultAsync<Array<Selectable<DB[Table]>>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'findAll() not implemented for service'
    )
  }

  findAllPaginated (
    critera: ServiceFindCriteria<Table>,
    paginationParams: PaginationParams<SortColumn>
  ): ResultAsync<Array<Selectable<DB[Table]>>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'findAllPaginated() not implemented for service'
    )
  }

  list (
    params: PaginationParams<SortColumn>
  ): ResultAsync<Array<Selectable<DB[Table]>>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'list() not implemented for service'
    )
  }

  // Write
  create (
    data: Partial<Selectable<DB[Table]>>
  ): ResultAsync<Selectable<DB[Table]>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'create() not implemented for service'
    )
  }

  update (
    criteria: ServiceFindCriteria<Table>,
    changes: UpdateObjectExpression<DB, Table, Table>
  ): ResultAsync<Selectable<DB[Table]>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'update() not implemented for service'
    )
  }

  delete (
    id: number
  ): ResultAsync<Selectable<DB[Table]>, ApiError> {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Something went wrong on our end. Please try again later',
      500,
      'delete() not implemented for service'
    )
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
