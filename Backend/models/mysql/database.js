import mysql from 'mysql2/promise'


const DEFAULT_CONFIG = {
    host: 'localhost',          
    user: 'root',               
    password: '',  
    database: 'animedb',        // El nombre de la base de datos
  };

const config = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
let pool;

export const getConnection = async () => {
    if (!pool) {
      // Si no hay un pool aún, lo creamos con la configuración
      pool = await mysql.createPool(config);
    }
    return pool;
  };