

let login = (req, res) => {
    try {
        return res.status(200).json({
            message: 'Hello login'
        })
    } catch (e) {
        console.log(e);
    }
}



module.exports = {
    login
}
