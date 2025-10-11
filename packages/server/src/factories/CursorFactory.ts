export interface ApiCursor<T> {
  value: T
  lastId: string | null
  isValid: boolean
}

export interface ApiRawCursor {
  value: string
  lastId: string | null
}

export type CursorDecoder<T> = (decodedValue: unknown) => T

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
    decoder?: CursorDecoder<T>
  ): ApiCursor<T> {
    const { value: rawValue, lastId } = this.decodeRawCursor(eCursor)

    const value = (
      decoder == null
        ? rawValue
        : decoder(rawValue)
    ) as T

    const isValid = value != null && lastId != null

    return { value, lastId, isValid }
  }

  decodeRawCursor (
    rawCursor: string
  ): ApiRawCursor {
    const decoded = Buffer
      .from(rawCursor, 'base64')
      .toString('ascii')

    const parts = decoded.split('|')
    const lastIdRaw = parts.pop()
    const value = parts.join('|')

    const lastId = lastIdRaw?.trim() === '' ? null : lastIdRaw ?? null

    return { value, lastId }
  }
}
