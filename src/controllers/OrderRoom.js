import pool from "../configs/ConnectDB";

//Tạo phòng
let createOrderRoom = async (req, res) => {
    try {
        let { id_tai_khoan, id_phong, so_thang, checkMonthYear, sl_giuong } = req.body
        console.log(id_tai_khoan, id_phong, so_thang, checkMonthYear);

        if (!so_thang || !checkMonthYear) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        else {
            if (checkMonthYear == 'year') {
                so_thang = so_thang * 12;
            }
            let [check] = await pool.execute('SELECT * FROM `thue_phong` WHERE id_tai_khoan=? and trang_thai<3 group by ngay_dk_thue DESC LIMIT 1', [id_tai_khoan])
            let [so_luong] = await pool.execute('SELECT count(*) as soluong FROM thue_phong WHERE trang_thai<3 and id_phong=?', [id_phong])
            if (so_luong && so_luong[0].soluong === sl_giuong) {
                return res.status(200).json({
                    errCode: 3,
                    message: 'Không thể thuê vì phòng đã có đủ người. Bạn có thể thuê phòng khác xin cảm ơn'
                })
            }
            if (check && check.length > 0) {
                console.log(check);
                return res.status(200).json({
                    errCode: 2,
                    message: 'Bạn đã thuê hoặc đang thuê phòng nên không thể thuê tiếp!'
                })
            }
            let [data] = await pool.execute('insert into thue_phong(id_tai_khoan,id_phong,so_thang,trang_thai) VALUES(?,?,?,1)', [id_tai_khoan, id_phong, so_thang])
            console.log(data.insertId);
            if (data && data.insertId) {
                await pool.execute('insert into lich_su_thue_phong(id_thue_phong,trang_thai) values(?,1)', [data.insertId])
            }

            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã thêm thành công '
            })
        }


    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getHistoryOrder = async (req, res) => {
    try {
        let id = req.query.id
        if (!id) {
            // let [history] = await pool.execute('select c.*,d.ten as ten_phong from (select a.*,b.id as id_lich_su,b.trang_thai as trang_thai_lich_su,b.ngay_thay_doi from thue_phong a,lich_su_thue_phong b where a.id=b.id_thue_phong ) c left join phong d on c.id_phong=d.id')
            let [history] = await pool.execute('select a.*,b.gia from(select c.*,d.email,d.ten as ten_tai_khoan from (select a.*,b.ten as ten_phong from thue_phong a left join phong b on a.id_phong=b.id ) c,tai_khoan d where c.id_tai_khoan=d.id) a,(Select a.*,b.ten as ten_danh_muc,c.ten as ten_day,d.sl_giuong from(SELECT t1.*,t2.id as id_ctpt,t2.gia,t2.hieu_luc_tu,t2.id_loai_phong,t2.hieu_luc_den FROM phong t1 left JOIN (SELECT c1.* FROM chi_tiet_phong_thue c1 LEFT JOIN chi_tiet_phong_thue c2 ON c1.id_phong = c2.id_phong AND c1.hieu_luc_tu < c2.hieu_luc_tu WHERE c2.id_phong IS NULL ) t2 ON t1.id = t2.id_phong ) a left join danh_muc b on a.id_danh_muc=b.id left join day c on a.id_day=c.id  left join loai_phong d on a.id_loai_phong=d.id  ) b where a.id_phong=b.id  order by a.ngay_dk_thue desc')
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã lấy danh sách thành công',
                history
            })
        }
        else {
            // let [history] = await pool.execute('select c.*,d.ten as ten_phong from (select a.*,b.id as id_lich_su,b.trang_thai as trang_thai_lich_su,b.ngay_thay_doi from thue_phong a,lich_su_thue_phong b where a.id=b.id_thue_phong ) c left join phong d on c.id_phong=d.id where id_tai_khoan=?', [id])
            let [history] = await pool.execute('select c.*,d.email,d.ten as ten_tai_khoan from (select a.*,b.ten as ten_phong from thue_phong a left join phong b on a.id_phong=b.id where a.id_tai_khoan=?) c,tai_khoan d where c.id_tai_khoan=d.id order by c.ngay_dk_thue desc', [id])

            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã lấy danh sách thành công',
                history
            })
        }

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}


let checkHistoryOrder = async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        let [history] = await pool.execute('SELECT * FROM `thue_phong` WHERE id_tai_khoan=? and trang_thai=2 group by ngay_dk_thue DESC LIMIT 1', [id])
        console.log(history);
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã lấy danh sách thành công',
            history
        })

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}
let btnXacNhan = async (req, res) => {
    try {
        let id = req.query.id
        let [data] = await pool.execute('update thue_phong set trang_thai=2 where id=?', [id])
        let [insert] = await pool.execute('insert into lich_su_thue_phong(id_thue_phong,trang_thai) VALUES(?,?)', [id, 2])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã lấy đã cập nhật thành công',
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let btnHuy = async (req, res) => {
    try {
        let id = req.query.id
        let [data] = await pool.execute('update thue_phong set trang_thai=3 where id=?', [id])
        let [insert] = await pool.execute('insert into lich_su_thue_phong(id_thue_phong,trang_thai) VALUES(?,?)', [id, 3])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã lấy đã cập nhật thành công',
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

const btnXoa = async (req, res) => {
    try {
        let id = req.query.id
        let [history] = await pool.execute('delete from lich_su_thue_phong where id_thue_phong=?', [id])
        if (history) {
            let [data] = await pool.execute('delete from thue_phong where trang_thai = 1  and id=?', [id])
        }

        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã xóa phòng thành công',
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

const getDetailOrderRoom = async (req, res) => {
    try {
        let id = req.query.id
        let [history] = await pool.execute('SELECt * from lich_su_thue_phong WHERE ID_THUE_PHONG = ?', [id])

        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã xóa phòng thành công',
            history
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

const changeOrderRoom = async (req, res) => {
    try {
        // let id = req.query.id
        let { id_phong, id_tai_khoan, sl_giuong, phong_moi } = req.body
        console.log(id_phong, id_tai_khoan);
        let [check] = await pool.execute('SELECT * FROM `thue_phong` WHERE id_tai_khoan=? and trang_thai=2 and id_phong=? group by ngay_dk_thue DESC LIMIT 1', [id_tai_khoan, id_phong])

        let [checkId] = await pool.execute('SELECT a.*,b.ten as ten_phong FROM `thue_phong` a,phong b WHERE id_tai_khoan=? and a.trang_thai=2 and a.id_phong=b.id group by ngay_dk_thue DESC LIMIT 1', [id_tai_khoan])
        // console.log('>>Check phong xua: ', checkId[0].ten_phong, 'Phong moi:', phong_moi);
        // console.log(check, checkId[0].id);
        //Kiểm tra phòng đã đủ người
        let [so_luong] = await pool.execute('SELECT count(*) as soluong FROM thue_phong WHERE trang_thai<3 and id_phong=?', [id_phong])
        if (so_luong && so_luong[0].soluong === sl_giuong) {
            return res.status(200).json({
                errCode: 3,
                message: 'Không thể chuyển qua vì phòng đã có đủ người. Bạn có thể chuyển phòng khác xin cảm ơn'
            })
        }
        if (check && check.length > 0) {
            console.log(check);
            return res.status(200).json({
                errCode: 2,
                message: 'Bạn không thể chuyển qua phòng hiện tại!'
            })
        }
        if (checkId && checkId[0] && checkId[0].id) {
            let [history] = await pool.execute('update thue_phong set id_phong=? where trang_thai = 2  and id= ?', [id_phong, checkId[0].id])
            let [insert] = await pool.execute('insert into lich_su_thue_phong(id_thue_phong,phong_xua,phong_moi,trang_thai) VALUES(?,?,?,?)', [checkId[0].id, checkId[0].ten_phong, phong_moi, 5])
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã chuyển phòng thành công',
                history
            })
        }

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let btnDaHoanThanh = async (req, res) => {
    try {
        let id = req.query.id
        let [data] = await pool.execute('update thue_phong set trang_thai=4 where id=?', [id])
        let [insert] = await pool.execute('insert into lich_su_thue_phong(id_thue_phong,trang_thai) VALUES(?,?)', [id, 4])
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã lấy đã cập nhật thành công',
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

module.exports = {
    createOrderRoom,
    getHistoryOrder,
    btnXacNhan,
    btnHuy,
    btnXoa,
    getDetailOrderRoom,
    changeOrderRoom,
    checkHistoryOrder,
    btnDaHoanThanh
}