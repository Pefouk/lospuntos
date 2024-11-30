import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RegisterValidator } from '#validators/register_validator'
import { ValidationError } from '@vinejs/vine/build/src/errors/validation_error.js'

export default class RegisterController {
  async show({ view, auth, response }: HttpContext) {
    // Redirect the user if already logged in
    if (auth.isAuthenticated) {
      return response.redirect().toRoute('user.self')
    }

    return view.render('pages/auth/register')
  }

  async store({ request, auth, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(RegisterValidator)
      const user = await User.create({
        username: data.username,
        password: data.password,
        name: data.name,
      })

      await auth.use('web').login(user)
      return response.redirect().toRoute('home')
    } catch (e: ValidationError) {
      session.flash('notification', {
        type: 'error',
        message: e.message,
      })
      console.log(session.flashMessages)
      return response.redirect().toRoute('auth.register.show')
    }
  }
}
