import { validateStudio, validatePartialStudio } from '../schemas/studios.js'

export class StudioController {
  constructor ({ studioModel }) {
    this.studioModel = studioModel
  }

  getAll = async (req, res) => {
    try {
      const studios = await this.studioModel.getAll()
      res.json(studios)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener los studios',
        details: error.message
      })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const studio = await this.studioModel.getById(parseInt(id))
      
      if (!studio) {
        return res.status(404).json({ 
          error: `Studio con id ${id} no encontrado`
        })
      }

      res.json(studio)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener el studio',
        details: error.message
      })
    }
  }

  create = async (req, res) => {
    try {
      // Validar el body con el schema de Zod
      const result = validateStudio(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.errors })
      }

      const newStudioId = await this.studioModel.create(result.data)
      
      // Obtener el studio recién creado
      const newStudio = await this.studioModel.getById(newStudioId)
      
      res.status(201).json(newStudio)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al crear el studio',
        details: error.message
      })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      
      const studioExists = await this.studioModel.getById(parseInt(id))
      if (!studioExists) {
        return res.status(404).json({ 
          error: `Studio con id ${id} no encontrado`
        })
      }

      // Validar los datos de actualización
      const result = validatePartialStudio(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.errors })
      }

      await this.studioModel.update(parseInt(id), result.data)
      
      const updatedStudio = await this.studioModel.getById(parseInt(id))
      
      res.json(updatedStudio)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al actualizar el studio',
        details: error.message
      })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      
      const studioExists = await this.studioModel.getById(parseInt(id))
      if (!studioExists) {
        return res.status(404).json({ 
          error: `Studio con id ${id} no encontrado`
        })
      }

      await this.studioModel.delete(parseInt(id))
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al eliminar el studio',
        details: error.message
      })
    }
  }
}