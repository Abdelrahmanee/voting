import { Router } from "express";
import { likeOrUnlike } from "./like.controllers.js";
import checkEventEndMiddelware from "../../middelwares/checkEvent.middelware.js";

const likeRouter = Router()


likeRouter
    .post('/handle-like', checkEventEndMiddelware, likeOrUnlike)


export default likeRouter