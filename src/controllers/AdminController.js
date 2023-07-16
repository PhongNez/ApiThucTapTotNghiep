import pool from "../configs/ConnectDB";

//LẤy danh sách user 
let getAllUser = async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        if (!id) {
            let [user] = await pool.execute('select a.*,b.ten as ten_lop  from tai_khoan a left join lop b on a.id_lop=b.id where a.id>1')
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

const addRole = async (req, res) => {
    try {
        let { themPhong, suaPhong, xoaPhong, ma_nhan_vien, idSuaPhong, idThemPhong, idXoaPhong } = req.body
        console.log(themPhong, suaPhong, xoaPhong, ma_nhan_vien, idSuaPhong, idThemPhong, idXoaPhong);
        if (idSuaPhong && !suaPhong) {
            console.log('delete sua');
            await pool.execute('delete from phan_quyen where id=?', [idSuaPhong])
        }
        if (idXoaPhong && !xoaPhong) {
            console.log('delete them');
            await pool.execute('delete from phan_quyen where id=?', [idXoaPhong])
        }
        if (idThemPhong && !themPhong) {
            console.log('delete xoa');
            await pool.execute('delete from phan_quyen where id=?', [idThemPhong])
        }
        if (!idThemPhong && themPhong) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [themPhong, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [themPhong, ma_nhan_vien])
        }
        if (!idXoaPhong && xoaPhong) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xoaPhong, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xoaPhong, ma_nhan_vien])
        }
        if (!idSuaPhong && suaPhong) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [suaPhong, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [suaPhong, ma_nhan_vien])
        }
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã cập nhật quyền thành công'
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

//LẤy danh sách user 
let getRoleUser = async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        // if (!id) {
        let [user] = await pool.execute('select a.id,b.id as id_phan_quyen,b.ma_quyen,b.ma_nhan_vien,b.ma_man_hinh from tai_khoan a left join phan_quyen b on a.id=b.ma_nhan_vien where a.id=?', [id])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            dataRole: user
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
module.exports = {
    getAllUser,
    updateUser,
    addRole,
    getRoleUser
}
