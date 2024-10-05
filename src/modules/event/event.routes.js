import { Router } from "express";
import { validate } from "../../middelwares/validation.middelware.js";
import { checkEventIdParams, createEventSchema } from "./event.validate.js";
import { checkEventEnd, checkEventStart, createEvent, createEventAccess, ElHoss, getEventWithCounts, getSpecificEvent } from "./event.controllers.js";
import postRouter from "../post/post.routes.js";
import likeRouter from "../like/like.routes.js";
import { checkEventExists, checkEventTimes, checkHasAccess, checkUniqueEventName, eventIsActive } from "./event.middelware.js";
import { authenticate, authorize } from "../../middelwares/auth.middelwares.js";
import { ROLES } from "../../utilies/enums.js";


const eventRouter = Router()

eventRouter.post('/create-event', authenticate, authorize([ROLES.ADMIN]), validate(createEventSchema), checkUniqueEventName, checkEventTimes ,createEvent);

eventRouter.param('eventId', checkEventExists);

eventRouter.post('/create-access', authenticate, authorize(), checkHasAccess, createEventAccess)

// eventRouter.get('/event-details/:eventId', authenticate, authorize(), getEventWithCounts); //لسا
eventRouter.post('/event-details/:eventId', authenticate, authorize(), ElHoss); //لسا
eventRouter.post('/:eventId', authenticate, authorize(), validate(checkEventIdParams), getSpecificEvent);
eventRouter.post('/:eventId/check-start', authenticate, authorize([ROLES.ADMIN]), validate(checkEventIdParams), checkEventStart);
eventRouter.post('/:eventId/check-end', authenticate, authorize([ROLES.ADMIN]), validate(checkEventIdParams), checkEventEnd);


eventRouter.use('/:eventId/posts', postRouter);

eventRouter.use('/:eventId/likes', authenticate, authorize(), eventIsActive, likeRouter);


export default eventRouter