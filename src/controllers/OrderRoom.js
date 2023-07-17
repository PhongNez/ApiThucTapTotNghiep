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

module.exports = {
    createOrderRoom,

}