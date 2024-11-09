import { getConnection } from './database.js';
import sql from 'mssql';

export class GenreModel {
    static async getAll() {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .query('SELECT * FROM genres ORDER BY name');
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching genres');
        }
    }

    static async getById(id) {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM genres WHERE id = @id');
            return result.recordset[0] || null;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching genre');
        }
    }

    static async create({ name }) {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .input('name', sql.VarChar(50), name)
                .query(`
                    INSERT INTO genres (name)
                    OUTPUT INSERTED.id
                    VALUES (@name)
                `);
            return this.getById(result.recordset[0].id);
        } catch (error) {
            console.error(error);
            throw new Error('Error creating genre');
        }
    }

    static async update({ id, name }) {
        const pool = await getConnection();
        
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .input('name', sql.VarChar(50), name)
                .query('UPDATE genres SET name = @name WHERE id = @id');
            return this.getById(id);
        } catch (error) {
            console.error(error);
            throw new Error('Error updating genre');
        }
    }

    static async delete(id) {
        const pool = await getConnection();
        
        try {
            // Primero verificar si hay animes usando este género
            const checkResult = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT COUNT(*) as count FROM anime_genres WHERE genre_id = @id');
            
            if (checkResult.recordset[0].count > 0) {
                throw new Error('Cannot delete genre: it is being used by animes');
            }

            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM genres WHERE id = @id');
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    // Método adicional para obtener animes por género
    static async getAnimesByGenre(genreId) {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .input('genreId', sql.Int, genreId)
                .query(`
                    SELECT a.* 
                    FROM animes a
                    INNER JOIN anime_genres ag ON a.id = ag.anime_id
                    WHERE ag.genre_id = @genreId
                    ORDER BY a.mean DESC
                `);
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching animes by genre');
        }
    }
}