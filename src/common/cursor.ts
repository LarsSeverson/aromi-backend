export const encodeCursor = <T>(sortValue: T, id: number): string => {
  const value = sortValue instanceof Date ? sortValue.toISOString() : String(sortValue)
  return Buffer.from(`${value}|${id}`).toString('base64')
}

export const decodeCursor = (cursor: string): { sortValue: string, id: number } => {
  const decoded = Buffer.from(cursor, 'base64').toString('ascii')
  const [sortValue, id] = decoded.split('|')
  return { sortValue, id: Number(id) }
}
