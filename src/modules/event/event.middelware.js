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
    const { eventId } = req.body;
    const { _id: userId } = req.user;

    // Check if the user has accessed this event before
    const accessedBefore = await EventUser.findOne({ event: eventId, user: userId });

    // If the user has accessed the event, proceed with population and response
    if (accessedBefore) {
        const populatedAccess = await accessedBefore.populate([
            { path: 'user', model: 'User', select: '-address -ipAddress -events -createdAt -updatedAt -isLoggedOut' },
            { path: 'organizer', model: 'User', select: '-address -ipAddress -events -updatedAt -isLoggedOut' }
        ]);
        console.log("hellow");

        return res.status(200).json({ message: "User has accessed this event before", data: populatedAccess });
    }

    next();
});


export const checkEventTimes = catchAsyncError(async (req, res, next) => {

    const { startTime, endTime } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const currentTime = new Date();
    console.log(start);
    

    if (start < currentTime) return res.status(400).json({ message: 'Invalid event times. start time must be after current time' });

    if (end <= startTime) {
        return res.status(400).json({ message: 'Invalid event times. End time must be after start time.' });
    }

    next();


})