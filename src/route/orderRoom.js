import OrderRoom from '../controllers/OrderRoom'


const orderRoom = (router) => {
    router.post('/order-room/create', OrderRoom.createOrderRoom)
}

export default orderRoom