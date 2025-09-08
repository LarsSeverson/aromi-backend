import z from 'zod'

export const UpdateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Usernames need to be at least 3 characters')
      .max(39, 'Usernames need to be less than 40 characters')
      .nullish()
  })
