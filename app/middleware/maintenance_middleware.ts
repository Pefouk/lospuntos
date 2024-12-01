import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

/**
 * Middleware to check that dev is ready
 */
export default class ReadyMiddleware {
  async handle({ request, view, response }: HttpContext, next: NextFn) {
    if (env.get('MAINTENANCE') === 'false' || request.cookiesList().bypass === 'pefouk') {
      return next()
    }
    const res = await view.render('pages/errors/maintenance')
    return response.send(res)
  }
}
