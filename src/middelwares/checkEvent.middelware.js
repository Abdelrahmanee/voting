import Event from "../../db/models/event.model.js";
import { catchAsyncError } from "../utilies/error.js";

export const eventIsActive = catchAsyncError(async (req, res, next, eventId) => {

    console.log("EventId" + eventId);

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (new Date() >= event.endTime) {
        return res.status(400).json({ message: 'Cannot react an event that has ended' });
    }
    next();

});



