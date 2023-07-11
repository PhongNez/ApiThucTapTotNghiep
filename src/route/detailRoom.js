import RoomController from '../controllers/RoomController'
import DetailRoomController from '../controllers/DetailRoomController'

const detailRoom = (router) => {
    router.post('/chi-tiet-phong/create', DetailRoomController.createDetailRoom)
    router.put('/chi-tiet-phong/update', DetailRoomController.updateDetailRoom)
}

export default detailRoom