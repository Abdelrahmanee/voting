import { Router } from "express";
import { validate } from "../../middelwares/validation.middelware.js";
import { checkEventIdParams, createEventSchema } from "./event.validate.js";
import { checkEventEnd, checkEventStart, createEvent, createEventAccess, getEventWithCounts, getSpecificEvent } from "./event.controllers.js";
import postRouter from "../post/post.routes.js";
import likeRouter from "../like/like.routes.js";
import { checkEventExists, checkHasAccess, checkUniqueEventName, eventIsActive } from "./event.middelware.js";
import { authenticate, authorize } from "../../middelwares/auth.middelwares.js";
import { ROLES } from "../../utilies/enums.js";


const eventRouter = Router()
// راييق فشخ

eventRouter.post('/create-event', authenticate, authorize([ROLES.ADMIN]), validate(createEventSchema), checkUniqueEventName, createEvent);

eventRouter.param('eventId', checkEventExists);

eventRouter.post('/create-access', authenticate, authorize(), checkHasAccess, createEventAccess)

eventRouter.get('/event-details/:eventId', authenticate, authorize(), getEventWithCounts); //لسا
eventRouter.get('/:eventId', authenticate, authorize(), validate(checkEventIdParams), getSpecificEvent);
eventRouter.get('/:eventId/check-start', authenticate, authorize([ROLES.ADMIN]), validate(checkEventIdParams), checkEventStart);
eventRouter.get('/:eventId/check-end', authenticate, authorize([ROLES.ADMIN]), validate(checkEventIdParams), checkEventEnd);


eventRouter.use('/:eventId/posts', postRouter);

eventRouter.use('/:eventId/likes', authenticate, authorize(), eventIsActive, likeRouter);


export default eventRouter