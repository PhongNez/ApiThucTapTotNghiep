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


module.exports = {
    createDetailRoom,
    updateDetailRoom

}