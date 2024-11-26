import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RegisterValidator } from '#validators/register_validator'

export default class RegisterController {
  async show({ view, auth, response }: HttpContext) {
    if (auth.isAuthenticated) {
      return response.redirect().toRoute('user.self')
    }

    return view.render('pages/auth/register')
  }

  async store({ request, auth, response }: HttpContext) {
    console.log('ca farte')
    const data = await request.validateUsing(RegisterValidator)
    console.log(data)
    const user = await User.create({ username: data.username, password: data.password })
    console.log({ user: user.serialize() })

    await auth.use('web').login(user)
    return response.redirect().toRoute('user.self')
  }
}
