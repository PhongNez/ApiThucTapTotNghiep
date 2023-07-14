import jwt from 'jsonwebtoken'

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

    jwt.verify(token, process.env.JWT_SECRECT, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log('Phong test:', data.ma_quyen);
        if (data.ma_quyen !== 2) return res.sendStatus(403);
        next();
    })
}

auth.authenUpdateRoom = (req, res, next) => {
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
        if (data.ma_quyen !== 3) return res.sendStatus(403);
        next();
    })
}

auth.authenDeleteRoom = (req, res, next) => {
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
        if (data.ma_quyen !== 4) return res.sendStatus(403);
        next();
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