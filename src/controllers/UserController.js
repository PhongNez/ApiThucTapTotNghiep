import pool from "../configs/ConnectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
import { createJWT } from '../services/jwtAction'
import auth from '../middleware/auth'
import mail from "../services/mail"
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
        let { data } = req.body
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

//LẤy danh sách user 
let getRoleFromToken = async (req, res) => {
    try {
        console.log('Phong hello');
        let id = auth.tokenData(req).id
        console.log(id);
        // if (!id) {
        let [user] = await pool.execute('select a.id,b.id as id_phan_quyen,b.ma_quyen,b.ma_nhan_vien,b.ma_man_hinh from tai_khoan a join phan_quyen b on a.id=b.ma_nhan_vien where a.id=?', [id])
        let [dataUser] = await pool.execute('select * from tai_khoan where id=?', [id])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            dataRole: user,
            dataUser
        })
        // }
        // else {
        //     let [user] = await pool.execute('select a.*,b.ten as ten_lop,c.id as id_phan_quyen,c.ma_quyen,c.ma_nhan_vien,c.ma_man_hinh  from tai_khoan a left join lop b on a.id_lop=b.id  left join phan_quyen c on a.id = c.ma_nhan_vien where a.id=?', [id])
        //     return res.status(200).json({
        //         errCode: 0,
        //         message: 'Chúc mừng đã thành công danh sách người dùng ',
        //         dataUser: user
        //     })
        // }

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let changePassword = async (req, res) => {
    try {
        let id_account = await auth.tokenData(req).id
        // const userData = await Model.account.findOne({ where: { id: id_account } })
        let { oldPassword, currentPassword, newPassword } = req.body

        let [user] = await pool.execute('select * from tai_khoan where id=?', [id_account])
        console.log(oldPassword, currentPassword, newPassword, id_account, user[0].mat_khau);
        //Check password: So sánh password
        let checkPass = bcrypt.compareSync(oldPassword, user[0].mat_khau)
        console.log(checkPass);
        if (checkPass) {
            //Nhập 1 password cũ, 1 password mới
            let hashPasswordFromBcrypt = ''// mã hóa password mới

            console.log(currentPassword, newPassword, id_account);

            if (currentPassword.trim() != newPassword.trim()) {
                return res.status(200).json({
                    errCode: 1,
                    message: 'Mật khẩu không khớp!'
                })
            }
            //if(oldPassword == )
            else if (currentPassword.trim() != '' && newPassword.trim() != '') {
                currentPassword = currentPassword.trim()
                hashPasswordFromBcrypt = await hashUserPassword(currentPassword)
                currentPassword = hashPasswordFromBcrypt

                await pool.execute('update tai_khoan set mat_khau=? where id=?', [currentPassword, id_account])
                return res.status(200).json({
                    errCode: 0,
                    message: 'Đổi mật khẩu thành công!'
                })
            }
            else {
                return res.status(200).json({
                    errCode: 2,
                    message: 'Vui lòng không được bỏ trống mật khẩu!'
                })
            }
        }
        else {
            return res.status(200).json({
                errCode: 3,
                message: 'Mật khẩu không hợp lệ. Vui lòng nhập lại!'
            })
        }

    } catch (error) {
        console.log(error);
    }
}

let updateUser = async (req, res) => {
    try {
        let { ten, mssv, sdt, id_lop, dia_chi } = req.body
        let id = req.query.id
        console.log(id);
        console.log(ten, mssv, sdt, id_lop, dia_chi);
        if (!ten || !mssv || !sdt || !id_lop || !dia_chi) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        else {
            let [user] = await pool.execute('UPDATE tai_khoan SET ten = ?, mssv = ?,sdt=?,id_lop=?,dia_chi=? WHERE id=?', [ten, mssv, sdt, id_lop, dia_chi, id])
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã cập nhật người dùng  thành công'
            })
        }

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

//Quên mật khẩu
let forgotPassword = async (req, res) => {
    try {
        let { email } = req.body

        if (!email) {
            return res.status(200).json({
                message: 'Vui lòng nhập email!'
            })
        }

        let exist = await checkUserEmail(email)
        console.log('>>>Check exist: ', exist);

        if (exist) {
            //Tạo 1 mã code gồm 6 số
            let code = mail.createCode()

            //Lấy id_account của email
            let id_account = await getIdFromEmail(email)
            console.log('>>>>Check id_Account: ', id_account);
            //Gửi mail đi
            mail.sendVerification(email, code)

            // code = await UserController.hashUserPassword(code)
            // console.log('>>>>>>>>>>>>>>>Check code :', code);

            // let id_verification = await insertVerification(id_account, code)
            // console.log(id_verification);
            let xac_thuc = await pool.execute('insert into xac_thuc(ma_code,id_tai_khoan) values(?,?)', [code, id_account])
            console.log(xac_thuc);

            //Xóa mã code trong db
            // autoDeleteCode(id_verification)
            if (xac_thuc) {
                // setTimeout(() => autoDeleteCode(id_account), 5000)
            }


            return res.status(200).json({
                errCode: 0,
                message: 'Đã gửi mã xác nhận đến email của bạn'
            })
        }
        else {
            return res.status(200).json({
                errCode: 1,
                message: 'Tài khoản không tồn tại trong hệ thống'
            })
        }

    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}

let autoDeleteCode = async (id_account) => {
    let deleteCode = await pool.execute('delete from xac_thuc where id_tai_khoan =?', [id_account])
}

//Lấy id từ email
let getIdFromEmail = async (email) => {
    try {
        // let check = await Model.account.findOne({ where: { email: email } })
        let [check] = await pool.execute('select * from tai_khoan where email=?', [email])
        console.log('check: ', check);

        if (check && check[0] && check.length > 0) {
            console.log('ID ', check[0].id);
            return check[0].id
        }
        // else {
        //     return false
        // }
    }
    catch (e) {
        console.log(e);
    }
}

let newPasswordForgot = async (req, res) => {
    try {
        let { email } = req.body

        if (!email) {
            return res.status(200).json({
                message: 'Vui lòng nhập email!'
            })
        }

        let exist = await checkUserEmail(email)
        console.log('>>>Check exist: ', exist);

        if (exist) {
            //Tạo 1 mã code gồm 6 số
            let code = mail.createCode()

            //Lấy id_account của email
            let id_account = await getIdFromEmail(email)
            console.log('>>>>Check id_Account: ', id_account);
            let [getCode] = await pool.execute('select * from xac_thuc where id_tai_khoan=? group by ngay desc', [id_account])
            console.log(getCode[0]);


            return res.status(200).json({
                errCode: 0,
                message: 'Đã gửi mã xác nhận đến email của bạn'
            })
        }
        else {
            return res.status(200).json({
                errCode: 1,
                message: 'Tài khoản không tồn tại trong hệ thống'
            })
        }


    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}
module.exports = {
    login,
    signUp,
    getRoleFromToken,
    changePassword,
    updateUser,
    forgotPassword,
    newPasswordForgot
}
