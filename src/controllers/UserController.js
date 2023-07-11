import pool from "../configs/ConnectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
import { createJWT } from '../services/jwtAction'

// đăng nhập
let login = async (req, res) => {
    try {
        let data = req.body
        let userData = {}
        //check email User và Admin tồn tại
        let isExist = await checkUserEmail(data.email)
        console.log('Check tồn tại: ', isExist);
        //Check email tồn tại
        if (isExist) {
            const [userDataDb] = await pool.execute('SELECT * FROM tai_khoan where email=?', [data.email])
            // const userDataDb = await Model.account.findOne({ where: { email: data.email } })
            //Check password: So sánh password
            let checkPass = bcrypt.compareSync(data.password, userDataDb[0].mat_khau)

            console.log('Password: ', checkPass);
            if (checkPass) {
                let data = { ...userDataDb[0] }//lấy object
                delete data['mat_khau']// bỏ cái password nhạy cảm
                console.log(data);
                userData.errCode = 0;
                userData.message = 'Đăng nhập thành công';
                userData.data = createJWT(data)
            }
            else {
                userData.errCode = 2;
                userData.message = 'Sai mật khẩu.Vui lòng kiểm tra lại'
            }
        }
        else {
            userData.errCode = 1
            userData.message = 'Tên đăng nhập không tồn tại'
        }
        return res.status(200).json(userData)
    } catch (e) {
        // reject(error)
        console.log(e);
        return res.send('Lỗi server')
    }
}


//đăng ký
let signUp = async (req, res) => {
    try {
        let data = req.body
        let userData = await createNewUser(data)
        return res.status(200).json(userData)
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let createNewUser = async (data) => {
    try {
        console.log(data.email, data.password, data.password2);
        if (!data.email || !data.password || !data.password2) {
            return ({
                errCode: 2,
                message: 'Vui lòng không được bỏ trống thông tin!'
            })
        }
        let check = await checkUserEmail(data.email);
        console.log(check);
        if (check) {
            return ({
                errCode: 1,
                message: 'Email đã được sử dụng. Vui lòng nhập email khác!'
            })
        }
        else {
            if (data.password.trim() != data.password2.trim()) {
                return ({
                    errCode: 2,
                    message: 'Mật khẩu không khớp!'
                })
            }
            else {
                let hash = await hashUserPassword(data.password)
                console.log(hash);

                //INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);
                await pool.execute('insert into tai_khoan(email,mat_khau) values(?,?)', [data.email, hash])

                return ({
                    errCode: 0,
                    message: 'Đăng ký thành công',
                })
            }


        }
    } catch (e) {
        console.log(e);
    }
}

//Check email user tồn tại
let checkUserEmail = async (email) => {
    try {
        // let check = await Model.account.findOne({ where: { email: email } })
        let [check] = await pool.execute('select * from tai_khoan where email=?', [email])
        console.log('check: ', check);

        if (check && check.length > 0) {
            return true
        }
        else {
            return false
        }
    }
    catch (e) {
        console.log(e);
    }
}

let hashUserPassword = async (password) => {

    try {
        let hashPassword = bcrypt.hashSync(password, salt);
        return hashPassword
    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    login,
    signUp
}
