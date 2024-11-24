// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  index(context: HttpContext) {
    console.log(context)
    return 'hey'
  }
}
