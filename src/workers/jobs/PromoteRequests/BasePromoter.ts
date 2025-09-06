import { type WorkerContext } from '../../context'

export abstract class BasePromoter<R, T> {
  protected readonly context: WorkerContext

  constructor (context: WorkerContext) {
    this.context = context
  }

  abstract promote (rows: R[]): Promise<[T[], R[]]>
}
