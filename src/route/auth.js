import UserController from '../controllers/UserController'


const auth = (router) => {
    router.post('/auth/login', UserController.login)
    router.post('/auth/signup', UserController.signUp)
    router.post('/auth/check-role', UserController.getRoleFromToken)
    router.put('/auth/change-password', UserController.changePassword)
}

export default auth