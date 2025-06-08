export interface ApiCursor<T> {
  value: T
  lastId: string | null
  isValid: boolean
}

export interface ApiRawCursor {
  value: unknown
  lastId: string | undefined | null
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

    const isValid = lastId != null && lastId.length > 0

    return { value, lastId: lastId ?? '', isValid }
  }

  private decodeRawCursor (
    rawCursor: string
  ): ApiRawCursor {
    const decoded = Buffer
      .from(rawCursor, 'base64')
      .toString('ascii')
    const parts = decoded.split('|')
    const lastId = parts.pop()
    const value = parts.join('|')

    return { value, lastId }
  }
}
