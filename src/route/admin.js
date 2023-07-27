import AdminController from '../controllers/AdminController'


const admin = (router) => {
    router.get('/admin/get-user', AdminController.getAllUser)
    router.put('/admin/update-user', AdminController.updateUser)
    router.post('/admin/add-role', AdminController.addRole)
    router.get('/admin/get-role', AdminController.getRoleUser)
    router.get('/admin/get-collect-money', AdminController.getCollectMoney)
    router.post('/admin/collect-money', AdminController.collectMoney)
    router.get('/history-collect-money', AdminController.getCollectMoney)
    router.post('/admin/collect-elec', AdminController.collectElec)
}

export default admin