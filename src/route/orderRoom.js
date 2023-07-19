import OrderRoom from '../controllers/OrderRoom'


const orderRoom = (router) => {
    router.post('/order-room/create', OrderRoom.createOrderRoom)
    router.get('/history/get', OrderRoom.getHistoryOrder)
    router.get('/check-history/get', OrderRoom.checkHistoryOrder)

    router.put('/admin/xacnhan', OrderRoom.btnXacNhan)
    router.put('/admin/huy', OrderRoom.btnHuy)
    router.delete('/xoa', OrderRoom.btnXoa)
    router.put('/chuyenphong', OrderRoom.changeOrderRoom)
    router.put('/admin/dahoanthanh', OrderRoom.btnDaHoanThanh)
    router.get('/hitory-order-room/detail', OrderRoom.getDetailOrderRoom)

}

export default orderRoom