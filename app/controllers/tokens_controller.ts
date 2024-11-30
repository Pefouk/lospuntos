import type { HttpContext } from '@adonisjs/core/http'

export default class TokensController {
  async claim({}: HttpContext) {
    return 'oui'
  }
}
