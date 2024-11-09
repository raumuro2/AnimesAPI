// models/database.js
import sql from 'mssql';

const DEFAULT_CONFIG = {
    server: 'LAPTOP-8MIHGSJL\\SQLEXPRESS',
    database: 'AnimeDB',
    options: {
        trustedConnection: true
    }
};

const config = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
let pool;

export const getConnection = async () => {
    if (!pool) {
        pool = await sql.connect(config);
    }
    return pool;
};