import Koa from 'koa'
import favicon from 'koa-favicon'
import serve from 'koa-static'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'
import path from 'path'

import responseTimeHeader from './middleware/response-time-header'

import router from './routers/main-router'

const app = new Koa()
const port = process.env.port ?? 3000

app.use(responseTimeHeader({ logTime: true }))
app.use(helmet())
app.use(morgan('combined'))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(router.routes())
app.use(serve('web/build'))
app.use(ctx => ctx.redirect('/'))

console.log(`Starting up the server on port ${port}`)

app.listen(port)
