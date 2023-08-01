import RoomController from '../controllers/RoomController'
import path from 'path'
import multer from 'multer'
import auth from '../middleware/auth'

const storage = multer.diskStorage({
    destination: "./src/public/image/",
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});

const upload = multer({
    storage: storage
})
const room = (router) => {
    router.get('/room/get', RoomController.getRoom)
    router.post('/room/create', upload.single('anh'), auth.authenCreateRoom, RoomController.createRoom)
    router.put('/room/update', upload.single('anh'), auth.authenUpdateRoom, RoomController.updateRoom)
    router.delete('/room/delete', auth.authenDeleteRoom, RoomController.deleteRoom)

    //Danh mục
    router.get('/room/category/get', RoomController.getCategory)
    router.post('/room/category/create', auth.authenCreateCategory, RoomController.createCategory)
    router.put('/room/category/update', auth.authenUpdateCategory, RoomController.updateCategory)
    router.delete('/room/category/delete', auth.authenDeleteCategory, RoomController.deleteCategory)

    router.get('/order-room/get', RoomController.getOrderRoom)
}

export default room