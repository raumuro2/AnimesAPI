import z from 'zod'

export const animeSchema = z.object({
  id: z.number().int(),
  title: z.string({
    invalid_type_error: 'Anime title must be a string',
    required_error: 'Anime title is required.'
  }).max(255),
  titleJa: z.string().max(255).nullable(),
  titleEn: z.string().max(255).nullable(),
  image: z.string().url().max(255).nullable(),
  mean: z.number().min(0).max(10).nullable(),
  rank: z.number().int().nullable(),
  num_list_users: z.number().int().nullable(),
  num_scoring_users: z.number().int().nullable(),
  num_episodes: z.number().int().nullable(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  media_type: z.string().max(255).nullable(),
  status: z.string().max(255).nullable(),
  rating: z.string().max(255).nullable(),
  average_episode_duration: z.number().int().nullable(),
  studios: z.number().int().nullable(),
  genres: z.array(z.number().int()).optional()
})
  
  export function validateAnime (input) {
    return animeSchema.safeParse(input)
  }
  
  export function validatePartialAnime (input) {
    return animeSchema.partial().safeParse(input)
  }