import express from "express";
import auth from './auth'
import room from "./room";
import detailRoom from './detailRoom'
import admin from "./admin";
import orderRoom from './orderRoom'
let router = express.Router();

const initAPIRoute = (app) => {

    admin(router)
    auth(router)
    room(router)
    detailRoom(router)
    orderRoom(router)
    return app.use('/api/v1/', router)
}

export default initAPIRoute