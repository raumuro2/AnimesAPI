import { getConnection } from './database.js';
import sql from 'mssql';

export class StudioModel {
    static async getAll() {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .query('SELECT * FROM studios ORDER BY name');
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching studios');
        }
    }

    static async getById(id) {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM studios WHERE id = @id');
            return result.recordset[0] || null;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching studio');
        }
    }

    static async create({ name }) {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .input('name', sql.VarChar(255), name)
                .query(`
                    INSERT INTO studios (name)
                    OUTPUT INSERTED.id
                    VALUES (@name)
                `);
            return this.getById(result.recordset[0].id);
        } catch (error) {
            console.error(error);
            throw new Error('Error creating studio');
        }
    }

    static async update({ id, name }) {
        const pool = await getConnection();
        
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .input('name', sql.VarChar(255), name)
                .query('UPDATE studios SET name = @name WHERE id = @id');
            return this.getById(id);
        } catch (error) {
            console.error(error);
            throw new Error('Error updating studio');
        }
    }

    static async delete(id) {
        const pool = await getConnection();
        
        try {
            // Primero verificar si hay animes usando este estudio
            const checkResult = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT COUNT(*) as count FROM animes WHERE studios = @id');
            
            if (checkResult.recordset[0].count > 0) {
                throw new Error('Cannot delete studio: it is being used by animes');
            }

            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM studios WHERE id = @id');
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    // Método adicional para obtener animes por estudio
    static async getAnimesByStudio(studioId) {
        const pool = await getConnection();
        
        try {
            const result = await pool.request()
                .input('studioId', sql.Int, studioId)
                .query(`
                    SELECT * FROM animes
                    WHERE studios = @studioId
                    ORDER BY mean DESC
                `);
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching animes by studio');
        }
    }
}