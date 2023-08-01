import AdminController from '../controllers/AdminController'
import auth from '../middleware/auth'

const admin = (router) => {
    router.get('/admin/get-user', AdminController.getAllUser)
    router.put('/admin/update-user', auth.authenUpdateUser, AdminController.updateUser)
    router.post('/admin/add-role', AdminController.addRole)
    router.get('/admin/get-role', AdminController.getRoleUser)
    router.get('/admin/get-collect-money', AdminController.getCollectMoney)
    router.post('/admin/collect-money', AdminController.collectMoney)
    router.get('/history-collect-money', AdminController.getCollectMoney)
    router.post('/admin/collect-elec', AdminController.collectElec)
    router.get('/history-collect-elec', AdminController.getCollectElec)
    router.get('/admin/history-collect-elec', AdminController.getCollectElec)
    router.put('/admin/collect-elec/confirm', AdminController.btnCollectElec)
    router.get('/admin/doanh-thu', AdminController.getDoanhThu)
    router.get('/admin/doanh-thu-dien', AdminController.getDoanhThuDien)
}

export default admin