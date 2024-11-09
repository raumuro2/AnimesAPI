import { Router } from 'express'
import { AnimeController } from '../controllers/animes.js'

export const createAnimeRouter = ({ animeModel }) => {
  const animeRouter = Router()

  const animeController = new AnimeController({ animeModel })

  animeRouter.get('/', animeController.getAll)
  animeRouter.post('/', animeController.create)

  animeRouter.get('/:id', animeController.getById)
  animeRouter.delete('/:id', animeController.delete)
  animeRouter.patch('/:id', animeController.update)

  return animeRouter
}