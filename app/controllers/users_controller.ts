import { HttpContext } from '@adonisjs/core/http'
import TokenRepository from '#services/Token/token_repository_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'

export default class UsersController {
  @inject()
  async leaderboard({ view }: HttpContext, tokenRepository: TokenRepository) {
    const leaderboard = await tokenRepository.leaderBoard()

    return view.render('pages/user/leaderboard', {
      leaderboard: leaderboard,
    })
  }

  @inject()
  async user({ view, params }: HttpContext, tokenRepository: TokenRepository) {
    const user = await User.findOrFail(params.userId)
    const score = await tokenRepository.score(user)
    const history = await tokenRepository.history(user)

    return view.render('pages/user/user', {
      user: user,
      score: score,
      history: history,
    })
  }
}
