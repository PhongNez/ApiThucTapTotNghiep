import AdminController from '../controllers/AdminController'


const admin = (router) => {
    router.get('/admin/get-user', AdminController.getAllUser)
    router.put('/admin/update-user', AdminController.updateUser)

}

export default admin