import z from 'zod'

export const genreSchema = z.object({
  id: z.number().int({
    invalid_type_error: 'Genre ID must be an integer',
    required_error: 'Genre ID is required.'
  }),
  name: z.string({
    invalid_type_error: 'Genre name must be a string',
    required_error: 'Genre name is required.'
  }).max(255)
})

export function validateGenre(input) {
  return genreSchema.safeParse(input)
}

export function validatePartialGenre(input) {
  return genreSchema.partial().safeParse(input)
}