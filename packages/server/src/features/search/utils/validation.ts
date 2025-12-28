import z from 'zod'

export const SearchInputSchema = z
  .object({
    term: z
      .string()
      .trim()
      .nullish()
  })
  .strip()
  .default({ term: '' })
  .transform(({ term }) => ({
    term: term ?? ''
  }))