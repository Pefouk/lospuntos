import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RegisterValidator } from '#validators/register_validator'

export default class RegisterController {
  async show({ view, auth, response }: HttpContext) {
    // Redirect the user if already logged in
    if (auth.isAuthenticated) {
      return response.redirect().toRoute('user.info')
    }

    return view.render('pages/auth/register')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(RegisterValidator)
    const user = await User.create({
      username: data.username,
      password: data.password,
      name: data.name,
    })

    session.flash('notification', {
      type: 'success',
      message: `Bienvenido mi amigo !`,
    })

    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }
}
