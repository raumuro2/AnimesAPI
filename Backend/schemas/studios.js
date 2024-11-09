import z from 'zod'

export const studioSchema = z.object({
  id: z.number().int({
    invalid_type_error: 'Studio ID must be an integer',
    required_error: 'Studio ID is required.'
  }),
  name: z.string({
    invalid_type_error: 'Studio name must be a string',
    required_error: 'Studio name is required.'
  }).max(255)
})

export function validateStudio(input) {
  return studioSchema.safeParse(input)
}

export function validatePartialStudio(input) {
  return studioSchema.partial().safeParse(input)
}