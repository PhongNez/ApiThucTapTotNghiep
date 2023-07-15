import jwt from 'jsonwebtoken'
import pool from '../configs/ConnectDB';
const auth = {}

auth.tokenData = (req) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return null;

    const token = authorizationHeader.split(' ')[1];
    let result = null;

    jwt.verify(token, process.env.JWT_SECRECT, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            result = data;
        }
    })
    return result;
}

auth.authenUser = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) return res.sendStatus(401)

    const token = authorizationHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    let key = process.env.JWT_SECRECT
    jwt.verify(token, key, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403)
        }
        console.log(data);
        next()
    })
}

//Chức vụ Admin
auth.authenAdmin = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRECT, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log('Phong test:', data.role);
        if (data.role !== 1) return res.sendStatus(403);
        next();
    })
}

auth.authenCreateRoom = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRECT, async (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log('Phong test:', data.ma_quyen);
        let [quyen] = await pool.execute('select * from phan_quyen where ma_nhan_vien=?', [data.id])
        if (quyen && quyen.length > 0) {
            quyen.map((item, index) => {
                if (item.ma_quyen == 2) { next(); }
            })
            return res.status(200).json({ message: 'Chưa được cấp quyền!' })
        }
        else {
            return res.sendStatus(403);
        }

        console.log('Quyen: ', quyen);

    })
}

auth.authenUpdateRoom = (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) return res.sendStatus(401);

        const token = authorizationHeader.split(' ')[1];
        if (!token) return res.sendStatus(401);

        let check = false
        jwt.verify(token, process.env.JWT_SECRECT, async (err, data) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            console.log('Phong test:', data.ma_quyen);
            let [quyen] = await pool.execute('select * from phan_quyen where ma_nhan_vien=?', [data.id])
            if (quyen && quyen.length > 0) {
                console.log('Chạy vào if');
                quyen.map((item, index) => {
                    if (item.ma_quyen == 3) { check = true }
                })
                // return res.status(200).json({ message: 'Chưa được cấp quyền!' })
                // console.log('Ừ sau next()');
                if (check) return next();
                else return res.status(200).json({ message: 'Chưa được cấp quyền!' })
            }
            else {
                return res.sendStatus(403);
            }
            console.log('Ừ sau next()');
            console.log('Quyen: ', quyen);

        })
    } catch (e) {

        console.log(e);
        return res.sendStatus(403);
    }

}

auth.authenDeleteRoom = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    let check = false
    jwt.verify(token, process.env.JWT_SECRECT, async (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log('Phong test:', data.ma_quyen);
        let [quyen] = await pool.execute('select * from phan_quyen where ma_nhan_vien=?', [data.id])
        if (quyen && quyen.length > 0) {
            console.log('Chạy vào if');
            quyen.map((item, index) => {
                if (item.ma_quyen == 4) { check = true }
            })
            // return res.status(200).json({ message: 'Chưa được cấp quyền!' })
            // console.log('Ừ sau next()');
            if (check) return next();
            else return res.status(200).json({ message: 'Chưa được cấp quyền!' })
        }
        else {
            return res.sendStatus(403);
        }
        console.log('Ừ sau next()');
        console.log('Quyen: ', quyen);

    })
}

auth.authenUpdatePrice = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRECT, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log('Phong test:', data.ma_quyen);
        if (data.ma_quyen !== 5) return res.sendStatus(403);
        next();
    })
}
module.exports = auth