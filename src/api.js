import express from 'express'
import noFavicons from 'express-no-favicons'
import uconfig from '../universal.config'

import App from './app/webapp'
import Demo from './demo/webapp'
import home from './home'

const api = express()

api.use(noFavicons())

api.use(App.middleware())
api.use(Demo.middleware())

api.get('/', home)

export default api
