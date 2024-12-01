import { inject } from '@adonisjs/core'
import TokenRepository from '#services/Token/token_repository_service'
import { randomInt } from 'node:crypto'
import User from '#models/user'
import Token from '#models/token'

type TToken = {
  code: string
  bonus: 'bonus' | 'malus'
  target: number
}

@inject()
export default class TokenManager {
  constructor(private tokenRepository: TokenRepository) {}

  async claimToken(user: User, claim: TToken) {
    const token = await Token.findBy({ code: claim.code })
    let value = token?.value ?? 0

    if (!token?.value) {
      if (claim.bonus === 'bonus') {
        value = randomInt(0, 100)
      }
      if (claim.bonus === 'malus') {
        value = randomInt(-200, 50)
      }
    }

    return await this.tokenRepository.claim(user.id, claim.target, value, claim.code)
  }
}
