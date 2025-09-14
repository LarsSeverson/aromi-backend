import type z from 'zod'
import type { ZodType } from 'zod'
import { BackendError } from './error.js'

export const parseOrThrow = <T extends ZodType>(
  schema: T,
  args: unknown
): z.output<T> => {
  const parsed = schema.safeParse(args)
  if (!parsed.success) throw BackendError.fromZod(parsed.error)

  return parsed.data
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