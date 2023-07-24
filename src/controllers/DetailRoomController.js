import pool from "../configs/ConnectDB";

//Tạo  chi tiết phòng
let createDetailRoom = async (req, res) => {
    try {
        let { gia, id_phong, id_loai_phong } = req.body
        if (!id_phong || !gia || !id_loai_phong) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        else {
            await pool.execute('insert into chi_tiet_phong_thue(id_phong, gia, id_loai_phong ) values(?,?,?)', [id_phong, gia, id_loai_phong])
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

let updateDetailRoom = async (req, res) => {
    try {
        let { gia, id_loai_phong, id } = req.body
        if (!gia || !id_loai_phong) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        else {
            console.log(gia, id_loai_phong, id);
            await pool.execute('UPDATE chi_tiet_phong_thue SET  gia= ?,  id_loai_phong= ? WHERE id = ?', [gia, id_loai_phong, id])
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã cập nhật thành công '
            })

        }
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}
const getHistoryPriceRoom = async (req, res) => {
    try {
        let [history] = await pool.execute('Select a.*,b.ten as ten_danh_muc,c.ten as ten_day,d.sl_giuong from(SELECT t1.*,t2.id as id_ctpt,t2.gia,t2.hieu_luc_tu,t2.id_loai_phong,t2.hieu_luc_den FROM phong t1 left JOIN (SELECT c1.* FROM chi_tiet_phong_thue c1 LEFT JOIN chi_tiet_phong_thue c2 ON c1.id_phong = c2.id_phong AND c1.hieu_luc_tu < c2.hieu_luc_tu WHERE c2.id_phong IS NULL ) t2 ON t1.id = t2.id_phong ) a left join danh_muc b on a.id_danh_muc=b.id left join day c on a.id_day=c.id  left join loai_phong d on a.id_loai_phong=d.id where a.trang_thai=1 ')

        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã cập nhật danh mục thành công ',
            history
        })
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

const getDetailHistoryPriceRoom = async (req, res) => {
    try {
        let id = req.query.id
        let [history] = await pool.execute('select a.*,b.ten as ten_danh_muc from (SELECT a.*,b.ten as ten_phong,b.id_danh_muc,c.sl_giuong FROM `chi_tiet_phong_thue` a left join phong b on a.id_phong=b.id left join loai_phong c on a.id_loai_phong=c.id ) a left join danh_muc b on a.id_danh_muc=b.id where a.id_phong=? group by a.hieu_luc_tu desc', [id])

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

module.exports = {
    createDetailRoom,
    updateDetailRoom,
    getHistoryPriceRoom,
    getDetailHistoryPriceRoom

}