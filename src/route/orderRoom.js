import OrderRoom from '../controllers/OrderRoom'


const orderRoom = (router) => {
    router.post('/order-room/create', OrderRoom.createOrderRoom)
    router.get('/history/get', OrderRoom.getHistoryOrder)

    router.put('/admin/xacnhan', OrderRoom.btnXacNhan)
    router.put('/admin/huy', OrderRoom.btnHuy)
    router.delete('/xoa', OrderRoom.btnXoa)
    router.put('/chuyenphong', OrderRoom.changeOrderRoom)
    router.get('/hitory-order-room/detail', OrderRoom.getDetailOrderRoom)

}

export default orderRoom