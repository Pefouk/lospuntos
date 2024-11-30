import type { HttpContext } from '@adonisjs/core/http'
import { LoginValidator } from '#validators/login_validator'
import User from '#models/user'

export default class LoginController {
  async show({ view, auth, response }: HttpContext) {
    const userAuth = await auth.use('web').check()
    if (userAuth) {
      return response.redirect().toRoute('token.claim')
    }
    return view.render('pages/auth/login')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(LoginValidator)
    try {
      const user = await User.verifyCredentials(data.username, data.password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('user.self')
    } catch (e) {
      session.flash('login', {
        type: 'error',
        message: 'Invalid Credentials',
      })
      return response.redirect().toRoute('auth.login.show')
    }
  }
}
