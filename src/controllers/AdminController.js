import pool from "../configs/ConnectDB";

//LẤy danh sách user 
let getAllUser = async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        if (!id) {
            let [user] = await pool.execute('select a.*,b.ten as ten_lop  from tai_khoan a left join lop b on a.id_lop=b.id ')
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã thành công danh sách người dùng ',
                dataUser: user
            })
        }
        else {
            let [user] = await pool.execute('select a.*,b.ten as ten_lop  from tai_khoan a left join lop b on a.id_lop=b.id where a.id=?', [id])
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã thành công danh sách người dùng ',
                dataUser: user
            })
        }

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

//Cập nhật thông tin người dùng
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
module.exports = {
    getAllUser,
    updateUser
}
