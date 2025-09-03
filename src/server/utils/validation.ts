import type z from 'zod'
import { type ZodType } from 'zod'
import { ApiError } from '../../common/error'

export const parseSchema = <T extends ZodType>(
  schema: T,
  args: z.input<T>
): z.output<T> => {
  const parsed = schema.safeParse(args)
  if (!parsed.success) throw new ApiError('INVALID_INPUT', parsed.error.issues[0].message, 400)

  return parsed.data
}

export const removeNullish = <T extends Record<string, unknown>>(
  input: T
): Partial<T> => {
  return Object
    .fromEntries(
      Object
        .entries(input)
        .filter(([, v]) => v != null)
    ) as Partial<T>
}

export const removeUndefined = <T extends Record<string, unknown>>(
  input: T
): Partial<T> => {
  return Object
    .fromEntries(
      Object
        .entries(input)
        .filter(([, v]) => v !== undefined)
    ) as Partial<T>
}
