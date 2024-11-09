import { Router } from 'express'
import { StudioController } from '../controllers/studios.js'

export const createStudioRouter = ({ studioModel }) => {
  const studioRouter = Router()

  const studioController = new StudioController({ studioModel })

  studioRouter.get('/', studioController.getAll)
  studioRouter.post('/', studioController.create)

  studioRouter.get('/:id', studioController.getById)
  studioRouter.delete('/:id', studioController.delete)
  studioRouter.patch('/:id', studioController.update)

  return studioRouter
}