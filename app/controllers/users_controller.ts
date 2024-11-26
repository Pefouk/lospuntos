import { HttpContext } from '@adonisjs/core/http'
import i18nManager from '@adonisjs/i18n/services/main'

export default class UsersController {
  self({ view }: HttpContext) {
    const fr = i18nManager.locale('fr')
    console.log(fr.t('auth.disconnect'))
    return view.render('pages/user/self')
  }
}
