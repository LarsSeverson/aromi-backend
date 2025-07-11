import { type ZodTypeAny } from 'zod'
import { ApiError } from './error'

export const parseSchema = (schema: ZodTypeAny, args: unknown): void => {
  const parsed = schema.safeParse(args)

  if (!parsed.success) throw new ApiError('INVALID_INPUT', parsed.error.issues[0].message, 400)
}
