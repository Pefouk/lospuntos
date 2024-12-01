import type { HttpContext } from '@adonisjs/core/http'
import { LoginValidator } from '#validators/login_validator'
import User from '#models/user'

export default class LoginController {
  async show({ view, auth, response }: HttpContext) {
    const userAuth = await auth.use('web').check()
    // User already logged ? redirect to home
    if (userAuth) {
      return response.redirect().toRoute('home')
    }
    return view.render('pages/auth/login')
  }

  async store({ request, auth, response, session }: HttpContext) {
    // Validate form, will auto go back to form with errors if invalid
    const data = await request.validateUsing(LoginValidator)

    // look for the given user, if not found, will display an error message on the login page
    try {
      const user = await User.verifyCredentials(data.username, data.password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('home')
    } catch (e) {
      session.flash('notification', {
        type: 'error',
        message: 'Identifiants invalide',
      })
      return response.redirect().toRoute('auth.login.show')
    }
  }
}
