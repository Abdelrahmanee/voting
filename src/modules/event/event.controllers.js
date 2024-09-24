import Event from "../../../db/models/event.model.js";
import { catchAsyncError } from "../../utilies/error.js";




// Controller to create a new time entry (startTime and endTime)
export const createEvent = catchAsyncError(async (req, res) => {
    const { eventName, startTime, endTime } = req.body;

    // Validate that startTime is before endTime
    if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({
            message: 'Start time must be before end time.'
        });
    }

    // Create new event entry
    const newEvent = new Event({
        eventName,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
    });

    // Save the new event entry
    await newEvent.save();

    return res.status(201).json({
        message: 'Event created successfully',
        data: newEvent
    });

});


export const checkEventStart = catchAsyncError(async (req, res) => {
    const { eventId } = req.params;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Calculate time left to start
    const timeLeft = event.timeLeftToStart;

    // Update event status if it has started
    if (new Date() >= event.startTime) {
        event.status = 'proceeding'; // Assuming you have a status field
        await event.save();
    }

    return res.status(200).json({
        message: 'Event retrieved successfully',
        timeLeft,
        status: event.status
    });

});


export const checkEventEnd = catchAsyncError(async (req, res) => {
    const { eventId } = req.params;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Calculate time difference
    const timeDiff = event.timeDifference;

    // Update event status if it has ended
    if (new Date() >= event.endTime) {
        event.status = 'completed'; // Assuming you have a status field
        await event.save();
    }

    return res.status(200).json({
        message: 'Event retrieved successfully',
        timeDiff,
        status: event.status
    });

});

