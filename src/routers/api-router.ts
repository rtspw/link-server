import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

import Joi from 'joi'

import * as DB from '../persistence'

const querySchema = Joi.object({
  keyword: Joi.string().required()
})

const postSchema = Joi.object({
  keyword: Joi.string().required(),
  url: Joi.string().required().uri(),
  description: Joi.string().max(1024)
})

const apiRouter = new Router()

apiRouter.get('/link', async (ctx, next) => {
  try {
    const { keyword } = await querySchema.validateAsync(ctx.request.query)
    const keywordLink = await DB.getKeywordLink(keyword)
    ctx.body = keywordLink
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      ctx.status = 422
      ctx.body = `Validation error: ${error.message}`
    } else if (error instanceof DB.NotFoundError) {
      ctx.status = 404
      ctx.body = error.message
    } else {
      throw error
    }
  }
})

apiRouter.post('/link', bodyParser(), async (ctx, next) => {
  try {
    const body: DB.KeywordLink = await postSchema.validateAsync(ctx.request.body)
    await DB.setKeywordLink(body.keyword, body)
    ctx.body = {
      status: 'success',
      summary: `Set keyword "${body.keyword}" to url "${body.url}"`
    }
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      ctx.status = 422
      ctx.body = `Validation error: ${error.message}`
    } else {
      throw error
    }
  }
})

export default apiRouter
