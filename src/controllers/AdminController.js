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

let collectMoney = async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        let { tien_phai_dong, tien_da_dong, con_no, da_thu, id_nguoi_thue, ghi_chu } = req.body
        console.log(tien_phai_dong, tien_da_dong, con_no, da_thu, id_nguoi_thue, ghi_chu);
        tien_phai_dong = Number(tien_phai_dong)
        tien_da_dong = Number(tien_da_dong)
        con_no = Number(con_no)
        da_thu = Number(da_thu)
        if (da_thu < 1) {
            return res.status(200).json({
                errCode: 1,
                message: 'Số tiền thu phải lớn hơn 1',
            })
        }
        let sum = da_thu + tien_da_dong
        console.log(sum);
        if (sum > tien_phai_dong) {
            return res.status(200).json({
                errCode: 2,
                message: 'Số tiền đóng đã vượt quá tiền phải đóng',
            })
        }
        con_no = tien_phai_dong - sum
        // if (!id) {
        let [user] = await pool.execute('insert into lich_su_thu_tien_phong(tien_phai_dong,tien_da_dong,con_no,da_thu,id_nguoi_thue,ghi_chu) values(?,?,?,?,?,?)', [tien_phai_dong, sum, con_no, da_thu, id_nguoi_thue, ghi_chu])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getCollectMoney = async (req, res) => {
    try {
        let id = req.query.id

        let [getTienDong] = await pool.execute('select * from lich_su_thu_tien_phong  where id_nguoi_thue=?  group by ngay_thu desc', [id])
        console.log(getTienDong);
        // if (!id) {
        // let [user] = await pool.execute('insert into lich_su_thu_tien_phong(tien_phai_dong,tien_da_dong,con_no,da_thu,id_nguoi_thue) values(?,?,?,?,?)', [tien_phai_dong, tien_da_dong, con_no, da_thu, id_nguoi_thue])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            dataThuTien: getTienDong
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}
module.exports = {
    getAllUser,
    updateUser,
    addRole,
    getRoleUser,
    collectMoney,
    getCollectMoney
}
