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
            let [history] = await pool.execute('select a.*,b.ten as ten_phong from thue_phong a left join phong b on a.id_phong=b.id')
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã lấy danh sách thành công',
                history
            })
        }
        else {
            // let [history] = await pool.execute('select c.*,d.ten as ten_phong from (select a.*,b.id as id_lich_su,b.trang_thai as trang_thai_lich_su,b.ngay_thay_doi from thue_phong a,lich_su_thue_phong b where a.id=b.id_thue_phong ) c left join phong d on c.id_phong=d.id where id_tai_khoan=?', [id])
            let [history] = await pool.execute('select a.*,b.ten as ten_phong from thue_phong a left join phong b on a.id_phong=b.id where id_tai_khoan=?', [id])

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
        let { id_phong, id_tai_khoan } = req.body
        console.log(id_phong, id_tai_khoan);
        let [check] = await pool.execute('SELECT * FROM `thue_phong` WHERE id_tai_khoan=? and trang_thai<3 and id_phong=? group by ngay_dk_thue DESC LIMIT 1', [id_tai_khoan, id_phong])
        let [checkId] = await pool.execute('SELECT * FROM `thue_phong` WHERE id_tai_khoan=? and trang_thai<3 group by ngay_dk_thue DESC LIMIT 1', [id_tai_khoan])
        console.log(check, checkId[0].id);
        if (check && check.length > 0) {
            console.log(check);
            return res.status(200).json({
                errCode: 2,
                message: 'Bạn không thể chuyển qua phòng hiện tại!'
            })
        }
        if (checkId && checkId[0] && checkId[0].id) {
            let [history] = await pool.execute('update thue_phong set id_phong=? where trang_thai = 2  and id= ?', [id_phong, checkId[0].id])
            let [insert] = await pool.execute('insert into lich_su_thue_phong(id_thue_phong,trang_thai) VALUES(?,?)', [checkId[0].id, 5])
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

module.exports = {
    createOrderRoom,
    getHistoryOrder,
    btnXacNhan,
    btnHuy,
    btnXoa,
    getDetailOrderRoom,
    changeOrderRoom
}