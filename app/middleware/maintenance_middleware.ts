import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

/**
 * Middleware to check that dev is ready
 */
export default class ReadyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (env.get('MAINTENANCE') === 'false' || ctx.request.cookiesList().bypass === 'pefouk') {
      return next()
    }
    return ctx.response.redirect().toRoute('maintenance')
  }
}
