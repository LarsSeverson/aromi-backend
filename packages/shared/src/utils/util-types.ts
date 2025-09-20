export type NonNullableType<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type DeepNonNullable<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends (...args: unknown[]) => unknown
      ? T[K]
      : DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>
}

export type Override<T, U> = Omit<T, keyof U> & U

export type ValueOf<T> = T[keyof T]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DBAny = any

export type PartialWithId<T> = Partial<T> & { id: string }