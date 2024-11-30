import { HttpContext } from '@adonisjs/core/http'
import Token from '#models/token'

export default class UsersController {
  async self({ view, auth }: HttpContext) {
    const userId = auth?.user?.id ?? 0
    const tokens = await Token.query().where('target_to', userId)
    const score = tokens.reduce((acc, token) => (acc += token.value), 0)

    const all = await Token.all()

    all.forEach((token) => {
      console.log(token)
    })

    return view.render('pages/user/self', {
      tokens: tokens,
      score: score,
    })
  }
}
