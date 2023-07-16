import pool from "../configs/ConnectDB";

//Tạo phòng
let createRoom = async (req, res) => {
    try {
        let { ten, mo_ta, id_danh_muc, id_day, trang_thai } = req.body
        if (!req.file || !ten || !mo_ta || !id_danh_muc || !id_day || !trang_thai) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        else {
            if (req.file && req.file.filename) {
                let anh = req.file.filename
                console.log(ten, mo_ta, id_danh_muc, id_day, trang_thai, anh);
                await pool.execute('insert into phong( ten,anh, mo_ta, id_danh_muc, id_day, trang_thai) values(?,?,?,?,?,?)', [ten, anh, mo_ta, id_danh_muc, id_day, trang_thai])
                return res.status(200).json({
                    errCode: 0,
                    message: 'Chúc mừng đã thêm thành công '
                })
            }

        }
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

//Sửa phòng 
let updateRoom = async (req, res) => {
    try {
        let { ten, mo_ta, id_danh_muc, id_day, trang_thai, id } = req.body
        if (!ten || !mo_ta || !id_danh_muc || !id_day || !trang_thai) {
            return res.status(200).json({
                errCode: 1,
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        else {
            if (!req.file) {
                try {
                    await pool.execute('UPDATE phong SET ten = ?, mo_ta= ?,  id_danh_muc= ?, id_day= ?,trang_thai= ? WHERE id = ?', [ten, mo_ta, id_danh_muc, id_day, trang_thai, id])
                    return res.status(200).json({
                        errCode: 0,
                        message: 'Cập nhật phòng thành công'
                    })
                } catch (error) {
                    return res.status(200).json({
                        errCode: 2,
                        message: 'Không được trùng tên'
                    })
                }


            }
            else {
                if (req.file && req.file.filename) {
                    let anh = req.file.filename
                    try {
                        await pool.execute('UPDATE phong SET ten = ?,anh=?, mo_ta= ?,  id_danh_muc= ?, id_day= ?,trang_thai= ? WHERE id = ?', [ten, anh, mo_ta, id_danh_muc, id_day, trang_thai, id])
                        return res.status(200).json({
                            errCode: 0,
                            message: 'Cập nhật phòng thành công'
                        })
                    } catch (error) {
                        return res.status(200).json({
                            errCode: 2,
                            message: 'Không được trùng tên'
                        })
                    }

                }
            }
        }
    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getRoom = async (req, res) => {
    try {

        // let [room] = await pool.execute('select *,a.id as id_phong,a.ten as ten_phong,b.ten as ten_day,c.ten as ten_danh_muc from phong a,day b,danh_muc c where a.id_day =b.id and a.id_danh_muc=c.id')
        let [room] = await pool.execute('Select a.*,b.ten as ten_danh_muc,c.ten as ten_day,d.sl_giuong from(SELECT t1.*,t2.id as id_ctpt,t2.gia,t2.hieu_luc_tu,t2.id_loai_phong,t2.hieu_luc_den FROM phong t1 left JOIN (SELECT c1.* FROM chi_tiet_phong_thue c1 LEFT JOIN chi_tiet_phong_thue c2 ON c1.id_phong = c2.id_phong AND c1.hieu_luc_tu < c2.hieu_luc_tu WHERE c2.id_phong IS NULL ) t2 ON t1.id = t2.id_phong ) a left join danh_muc b on a.id_danh_muc=b.id left join day c on a.id_day=c.id  left join loai_phong d on a.id_loai_phong=d.id  ')
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã lấy danh sách phòng thành công ',
            dataRoom: room
        })

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let getOrderRoom = async (req, res) => {
    try {

        // let [room] = await pool.execute('select *,a.id as id_phong,a.ten as ten_phong,b.ten as ten_day,c.ten as ten_danh_muc from phong a,day b,danh_muc c where a.id_day =b.id and a.id_danh_muc=c.id')
        let [room] = await pool.execute('Select a.*,b.ten as ten_danh_muc,c.ten as ten_day,d.sl_giuong from(SELECT t1.*,t2.id as id_ctpt,t2.gia,t2.hieu_luc_tu,t2.id_loai_phong,t2.hieu_luc_den FROM phong t1 left JOIN (SELECT c1.* FROM chi_tiet_phong_thue c1 LEFT JOIN chi_tiet_phong_thue c2 ON c1.id_phong = c2.id_phong AND c1.hieu_luc_tu < c2.hieu_luc_tu WHERE c2.id_phong IS NULL ) t2 ON t1.id = t2.id_phong ) a left join danh_muc b on a.id_danh_muc=b.id left join day c on a.id_day=c.id  left join loai_phong d on a.id_loai_phong=d.id where a.trang_thai=1 ')
        return res.status(200).json({
            errCode: 0,
            message: 'Chúc mừng đã lấy danh sách phòng thành công ',
            dataRoom: room
        })

    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}

let deleteRoom = async (req, res) => {
    try {
        let id = req.query.id
        console.log(id);
        try {
            await pool.execute('delete from phong where id=?', [id])
            return res.status(200).json({
                errCode: 0,
                message: 'Chúc mừng đã xóa phòng thành công '
            })
        } catch (error) {
            return res.status(200).json({
                errCode: 1,
                message: 'Không được xóa vì ảnh hưởng rất nhiều'
            })
        }


    } catch (e) {
        console.log(e);
        return res.send('Lỗi server')
    }
}
module.exports = {
    createRoom,
    updateRoom,
    getRoom,
    deleteRoom,
    getOrderRoom
}