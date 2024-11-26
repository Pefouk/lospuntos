import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async index({ auth, response }: HttpContext) {
    auth.use('web').logout()
    return response.redirect().toRoute('auth.login.show')
  }
}
