import RoomController from '../controllers/RoomController'
import path from 'path'
import multer from 'multer'


const storage = multer.diskStorage({
    destination: "./src/public/image/",
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});

const upload = multer({
    storage: storage
})
const room = (router) => {
    router.get('/room/get', RoomController.getRoom)
    router.post('/room/create', upload.single('anh'), RoomController.createRoom)
    router.put('/room/update', upload.single('anh'), RoomController.updateRoom)
}

export default room