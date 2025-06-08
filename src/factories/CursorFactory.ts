export interface ApiCursor<T> {
  value: T
  lastId: string | null
  isValid: boolean
}

export interface ApiRawCursor {
  value: unknown
  lastId: string
}

export type CursorParser<T> = (decodedValue: unknown) => T

export class CursorFactory {
  encodeCursor (
    value: unknown,
    id: string
  ): string {
    const parsedValue = String(value)

    return Buffer
      .from(`${parsedValue}|${id}`)
      .toString('base64')
  }

  decodeCursor <T>(
    eCursor: string,
    parser?: CursorParser<T>
  ): ApiCursor<T> {
    const { value: rawValue, lastId } = this.decodeRawCursor(eCursor)

    const value = (parser != null
      ? parser(rawValue)
      : rawValue) as T

    return { value, lastId, isValid: lastId != null }
  }

  private decodeRawCursor (
    rawCursor: string
  ): ApiRawCursor {
    const decoded = Buffer
      .from(rawCursor, 'base64')
      .toString('ascii')
    const [value, id] = decoded.split('|')

    return { value, lastId: id }
  }
}
