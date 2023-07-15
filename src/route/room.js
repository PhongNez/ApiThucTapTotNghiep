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
}

export default room