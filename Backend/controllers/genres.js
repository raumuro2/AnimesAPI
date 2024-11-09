import { validateGenre, validatePartialGenre } from '../schemas/genres.js'

export class GenreController {
  constructor ({ genreModel }) {
    this.genreModel = genreModel
  }

  getAll = async (req, res) => {
    try {
      const genres = await this.genreModel.getAll()
      res.json(genres)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener los genres',
        details: error.message 
      })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const genre = await this.genreModel.getById(parseInt(id))
      
      if (!genre) {
        return res.status(404).json({ 
          error: `genre con id ${id} no encontrado` 
        })
      }

      res.json(genre)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener el genre',
        details: error.message 
      })
    }
  }

  create = async (req, res) => {
    try {
      // Validar el body con el schema de Zod
      const result = validateGenre(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.errors })
      }

      const newGenreId = await this.genreModel.create(result.data)
      
      // Obtener el anime recién creado
      const newGenre = await this.genreModel.getById(newGenreId)
      
      res.status(201).json(newGenre)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al crear el genre',
        details: error.message 
      })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      
      const genreExists = await this.genreModel.getById(parseInt(id))
      if (!genreExists) {
        return res.status(404).json({ 
          error: `Genre con id ${id} no encontrado` 
        })
      }

      // Validar los datos de actualización
      const result = validatePartialGenre(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.errors })
      }

      await this.genreModel.update(parseInt(id), result.data)
      
      const updatedGenre = await this.genreModel.getById(parseInt(id))
      
      res.json(updatedGenre)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al actualizar el genre',
        details: error.message 
      })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      
      const genreExists = await this.genreModel.getById(parseInt(id))
      if (!genreExists) {
        return res.status(404).json({ 
          error: `Genre con id ${id} no encontrado` 
        })
      }

      await this.genreModel.delete(parseInt(id))
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al eliminar el genre',
        details: error.message 
      })
    }
  }
}