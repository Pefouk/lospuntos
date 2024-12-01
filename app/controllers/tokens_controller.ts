import type { HttpContext } from '@adonisjs/core/http'
import { TokenClaimValidator } from '#validators/token_claim_validator'
import TokenManager from '#services/Token/token_manager_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import { createToken } from '#abilities/main'
import { TokenCreateValidator } from '#validators/token_create_validator'
import Token from '#models/token'

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
  async claimStore({ request, auth, session, response }: HttpContext, tokenManager: TokenManager) {
    const data = await request.validateUsing(TokenClaimValidator)
    const target = await User.findOrFail(data.target)
    const token = await tokenManager.claimToken(auth.getUserOrFail(), data)

    session.flash('notification', {
      type: 'success',
      message: `${token.value} puntos crédité a ${target.username}`,
    })
    return response.redirect().toRoute('token.claim.view')
  }

  async createView({ view, bouncer, response }: HttpContext) {
    if (!(await bouncer.allows(createToken))) {
      return response.forbidden('Tu te crois ou a essayer de créer du token la ?')
    }

    return view.render('pages/token/create')
  }

  async createStore({ response, bouncer, request, session }: HttpContext) {
    if (!(await bouncer.allows(createToken))) {
      return response.forbidden('Tu te crois ou a essayer de créer du token la ?')
    }
    const data = await request.validateUsing(TokenCreateValidator)
    const token = await Token.create({
      code: data.code,
      // Srx
      value: data.value ?? undefined,
    })

    session.flash('notification', {
      type: 'success',
      message: `${token.code} créée avec succès`,
    })
    return response.redirect().toRoute('token.create.view')
  }
}
