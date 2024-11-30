import type { HttpContext } from '@adonisjs/core/http'

export default class TokensController {
  async claim({ view }: HttpContext) {
    return view.render('pages/token/claim')
  }
}
