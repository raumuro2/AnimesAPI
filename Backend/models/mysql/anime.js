  // Usamos mysql2/promise para trabajar con promesas
  import { getConnection } from './database.js';  // Tu archivo de conexión

export class AnimeModel {
  // Método para obtener todos los animes
  async getAll({ page = 1, limit = 10 }) {
    const pool = await getConnection();
  
    // Validar y convertir los valores
    const parsedLimit = Math.max(1, parseInt(limit, 10)); // Asegura que limit sea al menos 1
    const parsedPage = Math.max(1, parseInt(page, 10)); // Asegura que page sea al menos 1
    const offset = (parsedPage - 1) * parsedLimit;
  
    // Asegúrate de que `parsedLimit` y `offset` sean enteros válidos
    if (isNaN(parsedLimit) || isNaN(offset)) {
      throw new Error("Invalid pagination parameters.");
    }
  
    const query = `
      SELECT a.*, 
        GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
      FROM animes a
      LEFT JOIN anime_genres ag ON a.id = ag.anime_id
      LEFT JOIN genres g ON ag.genre_id = g.id
      GROUP BY a.id
      ORDER BY a.id
      LIMIT ${parsedLimit} OFFSET ${offset};
    `;
  
    try {
      const [rows] = await pool.execute(query);
  
      const [countResult] = await pool.execute(`SELECT COUNT(*) AS total FROM animes`);
      const total = countResult[0].total;
  
      return {
        animes: rows,
        total,
        totalPages: Math.ceil(total / parsedLimit),
        currentPage: parsedPage,
      };
    } catch (error) {
      console.error("Database query error:", error.message);
      throw new Error("Database query failed.");
    }
  }
  
  

  // Método para obtener un anime por ID
  async getById(id) {
    const pool = await getConnection();
    const query = `
      SELECT a.*, 
        GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
      FROM animes a
      LEFT JOIN anime_genres ag ON a.id = ag.anime_id
      LEFT JOIN genres g ON ag.genre_id = g.id
      WHERE a.id = ?
      GROUP BY a.id;`;

    const [rows] = await pool.execute(query, [id]);  // Pasamos el id como parámetro
    return rows[0];  // Retornamos el primer resultado (único)
  }

  // Método para crear un nuevo anime
  async create(animeData) {
    const pool = await getConnection();
    const connection = await pool.getConnection();  // Obtenemos una conexión directa

    try {
      await connection.beginTransaction();  // Iniciamos la transacción

      // Primero insertamos el anime
      const insertAnimeQuery = `
        INSERT INTO animes (
          title, titleJa, titleEn, image, mean, rank, 
          num_list_users, num_scoring_users, num_episodes,
          start_date, end_date, media_type, status, rating,
          average_episode_duration, studios
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await connection.execute(insertAnimeQuery, [
        animeData.title, animeData.titleJa, animeData.titleEn, animeData.image, animeData.mean, animeData.rank, 
        animeData.num_list_users, animeData.num_scoring_users, animeData.num_episodes,
        animeData.start_date, animeData.end_date, animeData.media_type, animeData.status, animeData.rating,
        animeData.average_episode_duration, animeData.studios
      ]);

      const animeId = result.insertId;  // Obtenemos el ID del anime insertado

      // Luego insertamos los géneros si existen
      if (animeData.genres && animeData.genres.length > 0) {
        for (const genreId of animeData.genres) {
          await connection.execute('INSERT INTO anime_genres (anime_id, genre_id) VALUES (?, ?)', [animeId, genreId]);
        }
      }

      await connection.commit();  // Confirmamos la transacción
      return animeId;  // Retornamos el ID del anime insertado

    } catch (error) {
      await connection.rollback();  // En caso de error, revertimos la transacción
      throw error;
    } finally {
      connection.release();  // Liberamos la conexión
    }
  }

  // Método para actualizar un anime
  async update(id, animeData) {
    const pool = await getConnection();
    const connection = await pool.getConnection();  // Obtenemos una conexión directa

    try {
      await connection.beginTransaction();  // Iniciamos la transacción

      // Actualizamos los datos básicos del anime
      const updateAnimeQuery = `
        UPDATE animes 
        SET title = ?, titleJa = ?, titleEn = ?, image = ?, mean = ?, rank = ?, 
            num_list_users = ?, num_scoring_users = ?, num_episodes = ?, 
            start_date = ?, end_date = ?, media_type = ?, status = ?, rating = ?, 
            average_episode_duration = ?, studios = ?
        WHERE id = ?`;

      await connection.execute(updateAnimeQuery, [
        animeData.title, animeData.titleJa, animeData.titleEn, animeData.image, animeData.mean, animeData.rank, 
        animeData.num_list_users, animeData.num_scoring_users, animeData.num_episodes, 
        animeData.start_date, animeData.end_date, animeData.media_type, animeData.status, animeData.rating, 
        animeData.average_episode_duration, animeData.studios, id
      ]);

      // Si se proporcionaron géneros, actualizamos las relaciones
      if (animeData.genres) {
        // Primero eliminamos las relaciones existentes
        await connection.execute('DELETE FROM anime_genres WHERE anime_id = ?', [id]);

        // Luego insertamos las nuevas relaciones
        for (const genreId of animeData.genres) {
          await connection.execute('INSERT INTO anime_genres (anime_id, genre_id) VALUES (?, ?)', [id, genreId]);
        }
      }

      await connection.commit();  // Confirmamos la transacción

    } catch (error) {
      await connection.rollback();  // En caso de error, revertimos la transacción
      throw error;
    } finally {
      connection.release();  // Liberamos la conexión
    }
  }
    // Método para eliminar un anime
async delete(id) {
  const pool = await getConnection();
  const connection = await pool.getConnection();  // Obtenemos una conexión directa

  try {
    await connection.beginTransaction();  // Iniciamos la transacción

    // Primero eliminamos las relaciones de géneros con el anime
    await connection.execute('DELETE FROM anime_genres WHERE anime_id = ?', [id]);

    // Luego eliminamos el anime
    const deleteAnimeQuery = 'DELETE FROM animes WHERE id = ?';
    const [result] = await connection.execute(deleteAnimeQuery, [id]);

    // Verificamos si se eliminó alguna fila (anime)
    if (result.affectedRows === 0) {
      throw new Error('Anime no encontrado o ya eliminado');
    }

    await connection.commit();  // Confirmamos la transacción

  } catch (error) {
    await connection.rollback();  // En caso de error, revertimos la transacción
    throw error;
  } finally {
    connection.release();  // Liberamos la conexión
  }
}

}
