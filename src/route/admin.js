import AdminController from '../controllers/AdminController'


const admin = (router) => {
    router.get('/admin/get-user', AdminController.getAllUser)
    router.put('/admin/update-user', AdminController.updateUser)
    router.post('/admin/add-role', AdminController.addRole)
    router.get('/admin/get-role', AdminController.getRoleUser)
}

export default admin