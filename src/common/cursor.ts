export const encodeCursor = <T>(value: T): string => {
  if (value instanceof Date) return Buffer.from(value.toISOString()).toString('base64')

  return Buffer.from(String(value)).toString('base64')
}

export const decodeCursor = (cursor: string): string => {
  return Buffer.from(cursor, 'base64').toString('ascii')
}
