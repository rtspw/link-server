import Router from '@koa/router'
import * as DB from '../persistence/api'

const gotoRouter = new Router()

gotoRouter.get('/:keyword', async ctx => {
  const { keyword } = ctx.params
  try {
    const keywordLink = await DB.getKeywordLink(keyword)
    ctx.redirect(keywordLink.url)
  } catch (error) {
    if (error instanceof DB.Errors.NotFoundError) {
      // Redirect to (do you want to make this a link?) page
      ctx.status = 404
      ctx.body = error.message
    }
  }
})

export default gotoRouter
