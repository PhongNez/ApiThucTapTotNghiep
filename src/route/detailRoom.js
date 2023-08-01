import RoomController from '../controllers/RoomController'
import DetailRoomController from '../controllers/DetailRoomController'
import auth from '../middleware/auth'

const detailRoom = (router) => {
    router.post('/chi-tiet-phong/create', auth.authenCreateRoom, DetailRoomController.createDetailRoom)
    router.put('/chi-tiet-phong/update',
        auth.authenUpdateRoom,
        DetailRoomController.updateDetailRoom)

    router.get('/test', auth.authenUpdateRoom, (req, res) => { return res.send({ test: 'hello' }) })
    router.get('/history-price', DetailRoomController.getHistoryPriceRoom)
    router.get('/history-price/detail', DetailRoomController.getDetailHistoryPriceRoom)
}

export default detailRoom