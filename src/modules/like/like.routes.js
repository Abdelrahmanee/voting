import { Router } from "express";
import { likeOrUnlike } from "./like.controllers.js";

const likeRouter = Router()


likeRouter
    .post('/handle-like', likeOrUnlike)


export default likeRouter