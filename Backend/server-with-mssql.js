//inyeccion de dependencias
import { createApp } from './app.js'
import { AnimeModel } from './models/mssql/anime.js'
import { GenreModel } from './models/mssql/genre.js'
import { StudioModel } from './models/mssql/studio.js'

const animeModel = new AnimeModel()
const genreModel = new GenreModel()
const studioModel = new StudioModel()

// Creamos la aplicación pasando todos los modelos
createApp({ animeModel, genreModel, studioModel })