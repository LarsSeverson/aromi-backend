import z from 'zod'

export const SearchInputSchema = z
  .object({
    term: z
      .string()
      .trim()
  })
  .strip()
  .default({ term: '' })