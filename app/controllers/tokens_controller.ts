import type { HttpContext } from '@adonisjs/core/http'
import { TokenClaimValidator } from '#validators/token_claim_validator'
import TokenManager from '#services/Token/token_manager_service'
import { inject } from '@adonisjs/core'

export default class TokensController {
  async claimView({ view }: HttpContext) {
    return view.render('pages/token/claim')
  }

  @inject()
  async claimStore({ view, request, auth }: HttpContext, tokenManager: TokenManager) {
    const data = await request.validateUsing(TokenClaimValidator)
    await tokenManager.claimToken(auth.getUserOrFail(), data)

    return view.render('pages/token/claim')
  }
}
