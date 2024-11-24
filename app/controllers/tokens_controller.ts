import type { HttpContext } from '@adonisjs/core/http'

export default class TokensController {
  /**
   * Display a list of resource
   */
  async claim({}: HttpContext) {
    return 'oui'
  }
}
