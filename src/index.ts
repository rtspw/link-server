import Koa from 'koa'
import favicon from 'koa-favicon'
import serve from 'koa-static'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'

import responseTimeHeader from './middleware/response-time-header'

import router from './routers/main-router'
import path from 'path'

const app = new Koa()

app.use(helmet())
app.use(morgan('combined'))
app.use(responseTimeHeader({ logTime: true }))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(router.routes())
app.use(serve('web/build'))

app.listen(process.env.PORT)
