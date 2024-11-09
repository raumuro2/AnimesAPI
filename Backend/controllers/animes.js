import { validateAnime, validatePartialAnime } from '../schemas/animes.js'

export class AnimeController {
  constructor ({ animeModel }) {
    this.animeModel = animeModel
  }

  getAll = async (req, res) => {
    try {
      // Validar y convertir los parámetros de paginación
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
  
      if (page <= 0 || limit <= 0) {
        return res.status(400).json({ error: "Page and limit must be positive integers." });
      }
  
      // Llamar al modelo con los valores validados
      const result = await this.animeModel.getAll({ page, limit });
  
      // Responder con el resultado
      res.json(result);
    } catch (error) {
      console.error("Error fetching animes:", error.message);
      res.status(500).json({ 
        error: "Error interno del servidor al obtener los animes",
        details: error.message,
      });
    }
  };
  

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const anime = await this.animeModel.getById(parseInt(id))
      
      if (!anime) {
        return res.status(404).json({ 
          error: `Anime con id ${id} no encontrado` 
        })
      }

      res.json(anime)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener el anime',
        details: error.message 
      })
    }
  }

  create = async (req, res) => {
    try {
      // Validar el body con el schema de Zod
      const result = validateAnime(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.errors })
      }

      const newAnimeId = await this.animeModel.create(result.data)
      
      // Obtener el anime recién creado
      const newAnime = await this.animeModel.getById(newAnimeId)
      
      res.status(201).json(newAnime)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al crear el anime',
        details: error.message 
      })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      
      // Verificar que el anime existe
      const animeExists = await this.animeModel.getById(parseInt(id))
      if (!animeExists) {
        return res.status(404).json({ 
          error: `Anime con id ${id} no encontrado` 
        })
      }

      // Validar los datos de actualización
      const result = validatePartialAnime(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.errors })
      }

      await this.animeModel.update(parseInt(id), result.data)
      
      // Obtener el anime actualizado
      const updatedAnime = await this.animeModel.getById(parseInt(id))
      
      res.json(updatedAnime)
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al actualizar el anime',
        details: error.message 
      })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      
      // Verificar que el anime existe
      const animeExists = await this.animeModel.getById(parseInt(id))
      if (!animeExists) {
        return res.status(404).json({ 
          error: `Anime con id ${id} no encontrado` 
        })
      }

      await this.animeModel.delete(parseInt(id))
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor al eliminar el anime',
        details: error.message 
      })
    }
  }
}