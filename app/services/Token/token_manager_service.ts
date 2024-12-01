import { inject } from '@adonisjs/core'
import TokenRepository from '#services/Token/token_repository_service'
import { randomInt } from 'node:crypto'
import User from '#models/user'

type TToken = {
  code: string
  bonus: 'bonus' | 'malus'
  target: number
}

@inject()
export default class TokenManager {
  constructor(private tokenRepository: TokenRepository) {}

  async claimToken(user: User, claim: TToken) {
    let value = 0

    if (claim.bonus === 'bonus') {
      value = randomInt(0, 100)
    }
    if (claim.bonus === 'malus') {
      value = randomInt(-200, 50)
    }

    await this.tokenRepository.claim(user.id, claim.target, value, claim.code)

    return value
  }
}
