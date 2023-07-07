import path from 'path'
import UserController from '../controllers/UserController'


const auth = (router) => {
    router.get('/test', UserController.login)
    router.get('/hello', (req, res) => {
        return res.status(200).json({
            phong: 'hello'
        })
    })
}

export default auth