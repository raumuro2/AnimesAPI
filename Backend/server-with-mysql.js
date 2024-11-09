//inyeccion de dependencias
import { createApp } from './app.js'
import { AnimeModel } from './models/mysql/anime.js'
import { GenreModel } from './models/mysql/genre.js'
import { StudioModel } from './models/mysql/studio.js'

const animeModel = new AnimeModel()
const genreModel = new GenreModel()
const studioModel = new StudioModel()

// Creamos la aplicación pasando todos los modelos
createApp({ animeModel, genreModel, studioModel })