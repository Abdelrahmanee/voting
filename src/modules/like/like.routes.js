import { Router } from "express";
import { likeOrUnlike } from "./like.controllers.js";
const likeRouter = Router({ mergeParams: true });  // Ensures eventId is passed

likeRouter.patch('/handle-like', likeOrUnlike);

export default likeRouter;