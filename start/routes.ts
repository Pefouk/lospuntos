import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
const LogoutController = () => import('#controllers/session/logout_controller')
const LoginController = () => import('#controllers/session/login_controller')
const RegisterController = () => import('#controllers/session/register_controller')
const UsersController = () => import('#controllers/users_controller')
const TokensController = () => import('#controllers/tokens_controller')

// Home page is the leaderboard
router
  .get('/', [UsersController, 'leaderboard'])
  .as('home')
  .use(middleware.auth())
  .use(middleware.maintenance())

// Auth Stuff
router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')

    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')

    router.get('/logout', [LogoutController, 'index']).as('logout')
  })
  .use(middleware.maintenance())
  .prefix('/auth')
  .as('auth')

// Token Stuff
router
  .group(() => {
    router.get('/token/claim', [TokensController, 'claimView']).as('claim.view')
    router.post('/token/claim', [TokensController, 'claimStore']).as('claim.store')
  })
  .use(middleware.auth())
  .use(middleware.maintenance())
  .as('token')
  .prefix('/token')

// User stuff
router
  .group(() => {
    router.get('/:userId', [UsersController, 'user']).as('info')
  })
  .use(middleware.auth())
  .use(middleware.maintenance())
  .prefix('/user')
  .as('user')

// Maintenance mode
router
  .get('/maintenance', ({ view }: HttpContext) => {
    return view.render('pages/errors/maintenance')
  })
  .as('maintenance')
