import express from "express";
import auth from './auth'
let router = express.Router();
import path from 'path'

const initAPIRoute = (app) => {

    auth(router)
    return app.use('/api/v1/', router)
}

export default initAPIRoute