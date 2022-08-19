import Router from '@koa/router'

import apiRouter from './api-router'
import gotoRouter from './goto-router'

const mainRouter = new Router()

mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods())
mainRouter.use('/g', gotoRouter.routes(), gotoRouter.allowedMethods())

export default mainRouter
