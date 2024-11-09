import { Router } from 'express'
import { GenreController } from '../controllers/genres.js'

export const createGenreRouter = ({ genreModel }) => {
  const genreRouter = Router()

  const genreController = new GenreController({ genreModel })

  genreRouter.get('/', genreController.getAll)
  genreRouter.post('/', genreController.create)

  genreRouter.get('/:id', genreController.getById)
  genreRouter.delete('/:id', genreController.delete)
  genreRouter.patch('/:id', genreController.update)

  return genreRouter
}