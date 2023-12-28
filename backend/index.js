import express from 'express'
import cors from 'cors'
import cp from 'cookie-parser'
import router from './routes/router.js'
import logger from './libs/logger.js'
import './libs/associations.js'
import { config } from 'dotenv'
config()

const app = express()
const port = process.env.PORT

app.use(cors({ credentials: true, origin: `http://localhost:3000` }))
app.use(express.static('./views'))
app.use(express.json())
app.use(cp())

app.use('/', router)

app.listen(port, err => {
  if (err) throw console.log(err)
  logger.server(`Running on http://localhost:${port}`)
})