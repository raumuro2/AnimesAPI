import { Router } from 'express'
import { createAnimeRouter } from './animes.js'
import { createGenreRouter } from './genres.js'
import { createStudioRouter } from './studios.js'

export const createApiRouter = ({ animeModel, genreModel, studioModel }) => {
  const apiRouter = Router()

  apiRouter.use('/animes', createAnimeRouter({ animeModel }))
  apiRouter.use('/genres', createGenreRouter({ genreModel }))
  apiRouter.use('/studios', createStudioRouter({ studioModel }))

  return apiRouter
}