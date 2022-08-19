import type { BaseContext } from 'koa'

export default ({ logTime = false }) => async (ctx: BaseContext, next: () => Promise<any>) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  if (logTime) console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
}
