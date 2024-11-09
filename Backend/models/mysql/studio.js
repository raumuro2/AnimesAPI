import { getConnection } from './database.js'; 

export class StudioModel {
  // Obtener todos los estudios
  static async getAll() {
    const pool = await getConnection();
    
    try {
      const [rows] = await pool.execute('SELECT * FROM studios ORDER BY name');
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching studios');
    }
  }

  // Obtener un estudio por ID
  static async getById(id) {
    const pool = await getConnection();
    
    try {
      const [rows] = await pool.execute('SELECT * FROM studios WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching studio');
    }
  }

  // Crear un nuevo estudio
  static async create({ name }) {
    const pool = await getConnection();
    
    try {
      const [result] = await pool.execute(`
        INSERT INTO studios (name)
        VALUES (?)`, [name]);
      
      // Obtener el estudio recién insertado usando su ID
      return this.getById(result.insertId);
    } catch (error) {
      console.error(error);
      throw new Error('Error creating studio');
    }
  }

  // Actualizar un estudio existente
  static async update({ id, name }) {
    const pool = await getConnection();
    
    try {
      await pool.execute('UPDATE studios SET name = ? WHERE id = ?', [name, id]);
      return this.getById(id);
    } catch (error) {
      console.error(error);
      throw new Error('Error updating studio');
    }
  }

  // Eliminar un estudio
  static async delete(id) {
    const pool = await getConnection();
    
    try {
      // Primero verificamos si el estudio está siendo utilizado por algún anime
      const [checkResult] = await pool.execute('SELECT COUNT(*) AS count FROM animes WHERE studios = ?', [id]);
      
      if (checkResult[0].count > 0) {
        throw new Error('Cannot delete studio: it is being used by animes');
      }

      // Si no está en uso, eliminamos el estudio
      await pool.execute('DELETE FROM studios WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  // Obtener animes por estudio
  static async getAnimesByStudio(studioId) {
    const pool = await getConnection();
    
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM animes
        WHERE studios = ?
        ORDER BY mean DESC
      `, [studioId]);
      
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching animes by studio');
    }
  }
}
