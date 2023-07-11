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
                await pool.execute('UPDATE phong SET ten = ?, mo_ta= ?,  id_danh_muc= ?, id_day= ?,trang_thai= ? WHERE id = ?', [ten, mo_ta, id_danh_muc, id_day, trang_thai, id])
                return res.status(200).json({
                    errCode: 0,
                    message: 'Cập nhật phòng thành công'
                })
            }
            else {
                if (req.file && req.file.filename) {
                    let anh = req.file.filename
                    await pool.execute('UPDATE phong SET ten = ?,anh=?, mo_ta= ?,  id_danh_muc= ?, id_day= ?,trang_thai= ? WHERE id = ?', [ten, anh, mo_ta, id_danh_muc, id_day, trang_thai, id])
                    return res.status(200).json({
                        errCode: 0,
                        message: 'Cập nhật phòng thành công'
                    })
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

        let [room] = await pool.execute('select *,a.id as id_phong,a.ten as ten_phong,b.ten as ten_day,c.ten as ten_danh_muc from phong a,day b,danh_muc c where a.id_day =b.id and a.id_danh_muc=c.id')
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

module.exports = {
    createRoom,
    updateRoom,
    getRoom
}