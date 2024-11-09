import express, { json } from 'express' // require -> commonJS
import { createApiRouter  } from './routes/apiRouter.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

export const createApp = ({ animeModel, genreModel, studioModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware()) //middleware que arregla problema de cors
  app.disable('x-powered-by') //para que no se filtre 

  app.use('/api', createApiRouter({ animeModel, genreModel, studioModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}