import type z from 'zod'
import type { ZodType } from 'zod'
import { BackendError } from './error.js'
import { err, ok, type Result } from 'neverthrow'

export const parseOrThrow = <T extends ZodType>(
  schema: T,
  args: unknown
): z.output<T> => {
  const parsed = schema.safeParse(args)
  if (!parsed.success) throw BackendError.fromZod(parsed.error)

  return parsed.data
}

export const parseOrErr = <T extends ZodType>(
  schema: T,
  args: unknown
): Result<z.output<T>, BackendError> => {
  const parsed = schema.safeParse(args)
  if (!parsed.success) return err(BackendError.fromZod(parsed.error))

  return ok(parsed.data)
}

export const removeNullish = <T extends Record<string, unknown>>(
  input: T
): Partial<T> => {
  return Object.fromEntries(
    Object
      .entries(input)
      .filter(([, v]) => v != null)
  ) as Partial<T>
}

export const removeUndefined = <T extends Record<string, unknown>>(
  input: T
): Partial<T> => {
  return Object.fromEntries(
    Object
      .entries(input)
      .filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

export const notNull = <T>(value: T | null): value is T => value != null