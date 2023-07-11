import UserController from '../controllers/UserController'


const auth = (router) => {
    router.post('/auth/login', UserController.login)
    router.post('/auth/signup', UserController.signUp)
}

export default auth