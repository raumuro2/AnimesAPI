import sql from 'mssql';
import { getConnection } from './database.js'

export class AnimeModel {
  async getAll() {
    const pool = await getConnection()
    const query = `
      SELECT Top 100
        a.*,
        STRING_AGG(g.name, ', ') as genres
      FROM animes a
      LEFT JOIN anime_genres ag ON a.id = ag.anime_id
      LEFT JOIN genres g ON ag.genre_id = g.id
      GROUP BY 
        a.id, a.title, a.titleJa, a.titleEn, a.image, 
        a.mean, a.rank, a.num_list_users, a.num_scoring_users,
        a.num_episodes, a.start_date, a.end_date, a.media_type,
        a.status, a.rating, a.average_episode_duration, a.studios`
    
    const result = await pool.request().query(query)
    return result.recordset
  }

  async getById(id) {
    const pool = await getConnection()
    const query = `
      SELECT 
        a.*,
        STRING_AGG(g.name, ', ') as genres
      FROM animes a
      LEFT JOIN anime_genres ag ON a.id = ag.anime_id
      LEFT JOIN genres g ON ag.genre_id = g.id
      WHERE a.id = @id
      GROUP BY 
        a.id, a.title, a.titleJa, a.titleEn, a.image, 
        a.mean, a.rank, a.num_list_users, a.num_scoring_users,
        a.num_episodes, a.start_date, a.end_date, a.media_type,
        a.status, a.rating, a.average_episode_duration, a.studios`
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(query)
    
    return result.recordset[0]
  }

  async create(animeData) {
    const pool = await getConnection()
    const transaction = pool.transaction()
    
    try {
      await transaction.begin()
      
      // Primero insertamos el anime
      const insertAnimeQuery = `
        INSERT INTO animes (
          title, titleJa, titleEn, image, mean, rank,
          num_list_users, num_scoring_users, num_episodes,
          start_date, end_date, media_type, status, rating,
          average_episode_duration, studios
        )
        OUTPUT INSERTED.id
        VALUES (
          @title, @titleJa, @titleEn, @image, @mean, @rank,
          @num_list_users, @num_scoring_users, @num_episodes,
          @start_date, @end_date, @media_type, @status, @rating,
          @average_episode_duration, @studios
        )`
      
      const result = await transaction.request()
        .input('title', sql.VarChar(255), animeData.title)
        // ... resto de inputs ...
        .query(insertAnimeQuery)
      
      const animeId = result.recordset[0].id
      
      // Luego insertamos los géneros si existen
      if (animeData.genres && animeData.genres.length > 0) {
        for (const genreId of animeData.genres) {
          await transaction.request()
            .input('animeId', sql.Int, animeId)
            .input('genreId', sql.Int, genreId)
            .query('INSERT INTO anime_genres (anime_id, genre_id) VALUES (@animeId, @genreId)')
        }
      }
      
      await transaction.commit()
      return animeId
      
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async update(id, animeData) {
    const pool = await getConnection()
    const transaction = pool.transaction()
    
    try {
      await transaction.begin()
      
      // Actualizamos los datos básicos del anime
      const updateAnimeQuery = `
        UPDATE animes
        SET title = @title,
            titleJa = @titleJa,
            -- ... resto de campos ...
        WHERE id = @id`
      
      await transaction.request()
        .input('id', sql.Int, id)
        .input('title', sql.VarChar(255), animeData.title)
        // ... resto de inputs ...
        .query(updateAnimeQuery)
      
      // Si se proporcionaron géneros, actualizamos las relaciones
      if (animeData.genres) {
        // Primero eliminamos las relaciones existentes
        await transaction.request()
          .input('animeId', sql.Int, id)
          .query('DELETE FROM anime_genres WHERE anime_id = @animeId')
        
        // Luego insertamos las nuevas relaciones
        for (const genreId of animeData.genres) {
          await transaction.request()
            .input('animeId', sql.Int, id)
            .input('genreId', sql.Int, genreId)
            .query('INSERT INTO anime_genres (anime_id, genre_id) VALUES (@animeId, @genreId)')
        }
      }
      
      await transaction.commit()
      
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}