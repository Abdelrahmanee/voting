import mongoose from "mongoose";
import Event from "../../../db/models/event.model.js";
import { AppError, catchAsyncError } from "../../utilies/error.js";
import EventUser from "../../../db/models/EventUser.model.js";

export const checkEventExists = async (req, res, next, eventId) => {
    if (!mongoose.isValidObjectId(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        req.event = event;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const eventIsActive = catchAsyncError(async (req, res, next) => {

    if (new Date() >= req.event.endTime) {
        return res.status(400).json({ message: 'Cannot react an event that has ended' });
    }

    next();
})
export const checkUniqueEventName = catchAsyncError(async (req, res, next) => {

    const { eventName } = req.body
    const isExist = await Event.findOne({ eventName })
    if (isExist)
        throw new AppError("Event name is used it must be unique", 400)

    next();
})

export const checkHasAccess = catchAsyncError(async (req, res, next) => {
    const { eventId } = req.body
    const { _id :userId } = req.user
    const accessedBefore = await EventUser.findOne({ event: eventId, user: userId })
    console.log(accessedBefore);
    
    if (accessedBefore)
        res.status(200).json({ message: "user access this event before" , data : accessedBefore })
    next();
})

