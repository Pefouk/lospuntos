import router from '@adonisjs/core/services/router'
const TokensController = () => import('#controllers/tokens_controller')
const HomeController = () => import('#controllers/home_controller')

router.on('/').render('pages/home')
router.get('/login', [HomeController, 'index'])
router.get('/token/claim', [TokensController, 'claim'])
