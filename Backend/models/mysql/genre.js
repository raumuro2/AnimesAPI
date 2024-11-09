import { getConnection } from './database.js';  
import mysql from 'mysql2/promise';  

export class GenreModel {
  // Obtener todos los géneros
  static async getAll() {
    const pool = await getConnection();
    
    try {
      const [rows] = await pool.execute('SELECT * FROM genres ORDER BY name');
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching genres');
    }
  }

  // Obtener un género por ID
  static async getById(id) {
    const pool = await getConnection();
    
    try {
      const [rows] = await pool.execute('SELECT * FROM genres WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching genre');
    }
  }

  // Crear un nuevo género
  static async create({ name }) {
    const pool = await getConnection();
    
    try {
      const [result] = await pool.execute(`
        INSERT INTO genres (name)
        VALUES (?)`, [name]);
      
      // Obtener el género recién insertado usando su ID
      return this.getById(result.insertId);
    } catch (error) {
      console.error(error);
      throw new Error('Error creating genre');
    }
  }

  // Actualizar un género existente
  static async update({ id, name }) {
    const pool = await getConnection();
    
    try {
      await pool.execute('UPDATE genres SET name = ? WHERE id = ?', [name, id]);
      return this.getById(id);
    } catch (error) {
      console.error(error);
      throw new Error('Error updating genre');
    }
  }

  // Eliminar un género
  static async delete(id) {
    const pool = await getConnection();
    
    try {
      // Primero verificamos si el género está siendo utilizado por algún anime
      const [checkResult] = await pool.execute('SELECT COUNT(*) AS count FROM anime_genres WHERE genre_id = ?', [id]);
      
      if (checkResult[0].count > 0) {
        throw new Error('Cannot delete genre: it is being used by animes');
      }

      // Si no está en uso, eliminamos el género
      await pool.execute('DELETE FROM genres WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  // Obtener animes por género
  static async getAnimesByGenre(genreId) {
    const pool = await getConnection();
    
    try {
      const [rows] = await pool.execute(`
        SELECT a.* 
        FROM animes a
        INNER JOIN anime_genres ag ON a.id = ag.anime_id
        WHERE ag.genre_id = ?
        ORDER BY a.mean DESC
      `, [genreId]);
      
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching animes by genre');
    }
  }
}
