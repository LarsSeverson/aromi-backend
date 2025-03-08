export const INVALID_ID = -1

export type NonNullableType<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}
