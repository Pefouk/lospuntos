import type { HttpContext } from '@adonisjs/core/http'
import { TokenClaimValidator } from '#validators/token_claim_validator'
import TokenManager from '#services/Token/token_manager_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'

export default class TokensController {
  async claimView({ view }: HttpContext) {
    const users = await User.all()

    const options = users.map((u) => {
      return {
        value: u.id,
        libelle: `"${u.username}" ${u.name}`,
      }
    })

    return view.render('pages/token/claim', {
      options: options,
    })
  }

  @inject()
  async claimStore({ view, request, auth, session }: HttpContext, tokenManager: TokenManager) {
    const data = await request.validateUsing(TokenClaimValidator)
    const target = await User.findOrFail(data.target)
    const value = await tokenManager.claimToken(auth.getUserOrFail(), data)

    session.flash('notification', {
      type: 'success',
      message: `${value} puntos crédité a ${target.username}`,
    })
    return view.render('pages/token/claim')
  }
}
