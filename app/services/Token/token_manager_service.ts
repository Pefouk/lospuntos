import { inject } from '@adonisjs/core'
import TokenRepository from '#services/Token/token_repository_service'
import { randomInt } from 'node:crypto'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

type TToken = {
  code: string
  bonus: 'bonus' | 'malus'
  target: number
}

@inject()
export default class TokenManager {
  constructor(
    private tokenRepository: TokenRepository,
    private ctx: HttpContext
  ) {}

  async claimToken(user: User, claim: TToken) {
    let value = 0
    if (claim.bonus === 'bonus') {
      value = randomInt(10, 500)
    }
    if (claim.bonus === 'malus') {
      value = randomInt(-500, 20)
    }

    await this.tokenRepository.claim(user.id, claim.target, value, claim.code)

    this.ctx.session.flash('notification', {
      type: 'success',
      message: `${value} crédité a ${claim.target}`,
    })
  }
}
