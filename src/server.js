import express from "express"
import initAPIRoute from "./route"
const app = express()

require('dotenv').config()
const port = process.env.PORT
var cors = require('cors')

app.use(cors({ credentials: true, origin: true }));
app.use(express.static('./src/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
initAPIRoute(app)
app.get('/', (req, res) => {
    res.send('Hello Phong Cena')
})
app.use((req, res) => {
    res.send('404 NOT FOUND')
})
app.listen(port, () => {
    console.log(`Example app listening on port localhost:${port}`)
})