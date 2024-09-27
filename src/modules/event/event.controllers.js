import Event from "../../../db/models/event.model.js";
import EventUser from "../../../db/models/EventUser.model.js";
import { AppError, catchAsyncError } from "../../utilies/error.js";




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
        makeBy : req.user._id
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
    const timeDiff = await event.timeDifference;

    console.log(timeDiff);
    console.log(event);
    console.log(event.timeDifference);
    
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

export const getSpecificEvent = catchAsyncError(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId)
    if (!event) throw new AppError('Event not found', 404)

    res.status(200).json({ message: "Event info", data: event })
})


export const createEventAccess = catchAsyncError(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { eventId } = req.body;

    if (!userId || !eventId) throw new AppError('userId and eventId are required', 400);

    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    const createdAccess = await EventUser.create({
        user: userId,
        event: eventId,
        organizer: event.makeBy 
    });

    if (!req.user.events.includes(event._id)) {
        req.user.events.push(event._id);
        await req.user.save();
    }

    const populatedAccess = await createdAccess.populate([
        { path: 'user', model: 'User' , select : '-address -ipAddress -events  -createdAt -updatedAt -isLoggedOut' },
        { path: 'organizer', model: 'User' , select : '-address -ipAddress -events -updatedAt -isLoggedOut ' }
    ]);

    res.status(201).json({
        status: "success",
        message: `You can now access ${event.eventName}`,
        data: populatedAccess
    });
});


export const getEventWithCounts = catchAsyncError(async (req, res, next) => {


    const event = await Event.findById(req.params.eventId)
        .populate('numberOfUsers')
        .populate('numberOfPosts')
        .populate('users')
        .populate('posts');
    console.log(event);

    res.status(200).json({ message: "Event details", data: `Event: ${event.eventName}, Users: ${event.numberOfUsers}, Posts: ${event.numberOfPosts}` });
})