import { catchAsyncError } from "../utilies/error.js";

// Middleware to check if the event has ended
const checkEventEndMiddelware = catchAsyncError(async (req, res, next) => {

    const { eventId } = req.body; // Assuming the eventId is sent in the request body

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the event has ended
    if (new Date() >= event.endTime) {
        return res.status(400).json({ message: 'Cannot react an event that has ended' });
    }

    // If the event is ongoing, proceed to the next middleware
    next();

});
export default checkEventEndMiddelware;
