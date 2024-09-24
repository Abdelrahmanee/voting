import { Router } from "express";
import { validate } from "../../middelwares/validation.middelware.js";
import { createEventSchema } from "./event.validate.js";
import { checkEventEnd, checkEventStart, createEvent } from "./event.controllers.js";
import { isEventActive } from "../../middelwares/checkEvent.middelware.js";
import { likeOrUnlike } from "../like/like.controllers.js";


const eventRouter = Router()



eventRouter.post('/create-event', validate(createEventSchema), createEvent);

eventRouter.get('/:eventId/check-start', checkEventStart);
eventRouter.get('/:eventId/check-end', checkEventEnd);

eventRouter.post('/:eventId/handle-like', isEventActive, likeOrUnlike);

export default eventRouter