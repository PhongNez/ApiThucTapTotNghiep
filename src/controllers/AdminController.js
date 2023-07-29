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
        let { idXemLichSuThuePhong, xemLichSuThuePhong } = req.body
        let { idXemThuTien, xemThuTien } = req.body
        let { idXemThuTienDien, xemThuTienDien } = req.body
        let { idXemDoanhThu, xemDoanhThu } = req.body

        console.log(themPhong, suaPhong, xoaPhong, ma_nhan_vien, idSuaPhong, idThemPhong, idXoaPhong);
        console.log(idXemLichSuThuePhong, xemLichSuThuePhong);
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

        //6 Xem lịch sử phòng
        if (idXemLichSuThuePhong && !xemLichSuThuePhong) {
            console.log('delete xoa');
            await pool.execute('delete from phan_quyen where id=?', [idXemLichSuThuePhong])
        }
        if (!idXemLichSuThuePhong && xemLichSuThuePhong) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemLichSuThuePhong, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemLichSuThuePhong, ma_nhan_vien])
        }
        //6 Xem lịch sử phòng

        //7 Xem thu tiền
        if (idXemThuTien && !xemThuTien) {
            console.log('delete xoa');
            await pool.execute('delete from phan_quyen where id=?', [idXemThuTien])
        }
        if (!idXemThuTien && xemThuTien) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemThuTien, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemThuTien, ma_nhan_vien])
        }
        //7 Xem thu tiền

        //8 Xem thu tiền điện
        if (idXemThuTienDien && !xemThuTienDien) {
            console.log('delete xoa');
            await pool.execute('delete from phan_quyen where id=?', [idXemThuTienDien])
        }
        if (!idXemThuTienDien && xemThuTienDien) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemThuTienDien, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemThuTienDien, ma_nhan_vien])
        }
        //8 Xem thu tiền điện

        //9 Xem thu tiền điện
        if (idXemDoanhThu && !xemDoanhThu) {
            console.log('delete xoa');
            await pool.execute('delete from phan_quyen where id=?', [idXemDoanhThu])
        }
        if (!idXemDoanhThu && xemDoanhThu) {
            console.log('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemDoanhThu, ma_nhan_vien]);
            await pool.execute('insert phan_quyen (ma_quyen,ma_nhan_vien) values(?,?)', [xemDoanhThu, ma_nhan_vien])
        }
        //9 Xem thu tiền điện


        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã cấp quyền thành công'
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

let collectElec = async (req, res) => {
    try {
        let { id_phong, so_luong, chi_so_cu, chi_so_moi, don_gia, thang } = req.body

        console.log(id_phong, so_luong, chi_so_cu, chi_so_moi, don_gia, thang);
        if (!id_phong || !so_luong || !chi_so_cu || !chi_so_moi || !don_gia || !thang) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng nhập đầy đủ thông tin'
            })
        }

        if (thang <= 0 || thang > 12) {
            return res.status(200).json({
                errCode: 3,
                message: 'Tháng chưa hợp lệ'
            })
        }

        if (chi_so_cu > chi_so_moi) {
            return res.status(200).json({
                errCode: 2,
                message: 'Chỉ số mới phải lớn hơn hoặc bằng chỉ số củ'
            })
        }

        so_luong = Number(so_luong)
        chi_so_cu = Number(chi_so_cu)
        chi_so_moi = Number(chi_so_moi)
        don_gia = Number(don_gia)
        thang = Number(thang)
        console.log(id_phong, so_luong, chi_so_cu, chi_so_moi, don_gia, thang);
        let tieu_thu = chi_so_moi - chi_so_cu
        let so_kw_dm = so_luong * 8
        let so_kw_vuot_dm = tieu_thu - so_kw_dm
        let thanh_tien = so_kw_vuot_dm * don_gia
        let ngay = `2023-${thang}-01`
        console.log(ngay);
        let [user] = await pool.execute('insert into lich_su_dien(id_phong,chi_so_cu, chi_so_moi,tieu_thu,so_kw_dinh_muc,so_kw_vuot_dinh_muc,don_gia_1_kw,thanh_tien,ngay, so_luong, trang_thai) values(?,?,?,?,?,?,?,?,?,?,?)',
            [id_phong, chi_so_cu, chi_so_moi, tieu_thu, so_kw_dm, so_kw_vuot_dm, don_gia, thanh_tien, ngay, so_luong, 1])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng '
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getCollectElec = async (req, res) => {
    try {
        let [history] = await pool.execute('select a.*,b.ten as ten_phong from lich_su_dien a left join phong b on a.id_phong=b.id')
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            history
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let btnCollectElec = async (req, res) => {
    try {
        let id = req.query.id
        let [history] = await pool.execute('update lich_su_dien set trang_thai=2 where id=?', [id])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            history
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getDoanhThu = async (req, res) => {
    try {
        let id = req.query.id
        let [doanh_thu] = await pool.execute('SELECT YEAR(ngay_thu) AS nam, MONTH(ngay_thu) AS thang, SUM(da_thu) AS doanh_thu_thang FROM lich_su_thu_tien_phong GROUP BY YEAR(ngay_thu), MONTH(ngay_thu) ORDER BY YEAR(ngay_thu), MONTH(ngay_thu)')
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            doanh_thu
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getDoanhThuDien = async (req, res) => {
    try {
        let id = req.query.id
        let [doanh_thu_dien] = await pool.execute('SELECT YEAR(ngay) AS nam, MONTH(ngay) AS thang, SUM(thanh_tien) AS doanh_thu_thang FROM lich_su_dien where trang_thai=2  GROUP BY YEAR(ngay), MONTH(ngay)   ORDER BY YEAR(ngay), MONTH(ngay)')
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã thành công danh sách người dùng ',
            doanh_thu_dien
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
    getCollectMoney,
    collectElec,
    getCollectElec,
    btnCollectElec,
    getDoanhThu,
    getDoanhThuDien
}
