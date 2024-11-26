import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const LogoutController = () => import('#controllers/session/logout_controller')
const LoginController = () => import('#controllers/session/login_controller')
const RegisterController = () => import('#controllers/session/register_controller')
const UsersController = () => import('#controllers/users_controller')
const TokensController = () => import('#controllers/tokens_controller')
const HomeController = () => import('#controllers/home_controller')

// Auth Stuff
router
  .group(() => {
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')

    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')

    router.get('/logout', [LogoutController, 'index']).as('logout')
  })
  .prefix('/auth')
  .as('auth')

// Token Stuff
router
  .group(() => {
    router.get('/token/claim', [TokensController, 'claim']).use(middleware.auth()).as('claim')
  })
  .use(middleware.auth())
  .as('token')
  .prefix('/token')

// User stuff
router
  .group(() => {
    router.get('/me', [UsersController, 'self']).as('self')
  })
  .use(middleware.auth())
  .prefix('/user')
  .as('user')

// Home page
router.get('/', [HomeController, 'index']).use(middleware.auth()).as('home')
