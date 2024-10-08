import Event from "../../../db/models/event.model.js";
import EventUser from "../../../db/models/EventUser.model.js";
import { Like } from "../../../db/models/like.model.js";
import Post from "../../../db/models/post.model.js";
import User from "../../../db/models/user.model.js";
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
        makeBy: req.user._id,
        ...(req.body.number_of_allowed_likes && { number_of_allowed_likes: req.body.number_of_allowed_likes })
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
    console.log("createdAccess");

    if (!userId || !eventId) throw new AppError('userId and eventId are required', 400);

    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    if (!event.makeBy) throw new AppError('Event organizer not found', 404);

    const createdAccess = await EventUser.create({
        user: userId,
        event: eventId,
        organizer: event.makeBy,
        hasAccess: true
    });
    console.log(createdAccess);

    if (!createdAccess) throw new AppError('Failed to create access record', 500);

    if (!req.user.events.includes(event._id)) {
        req.user.events.push(event._id);
        await req.user.save();
    }

    const populatedAccess = await createdAccess.populate([
        { path: 'user', model: 'User', select: '-address -ipAddress -events -createdAt -updatedAt -isLoggedOut' },
        { path: 'organizer', model: 'User', select: '-address -ipAddress -events -updatedAt -isLoggedOut' }
    ]);

    res.status(201).json({
        status: "success",
        message: `You can now access ${event.eventName}`,
        data: populatedAccess,
    });
});


export const getEventWithCounts = catchAsyncError(async (req, res, next) => {


    const event = await Event.findById(req.params.eventId)
        .populate('numberOfPosts')
        .populate('posts')
        .populate('numberOfUsersWithAccess') // Count of users with hasAccess: true
        .populate({
            path: 'usersWithAccess',            // List of users with hasAccess: true
            select: 'user'                      // Only select the user field
        });
    console.log(event.numberOfUsersWithAccess);
    console.log(event.usersWithAccess);

    res.status(200).json({ message: "Event details", data: `Event: ${event.eventName}, Users: ${event.numberOfUsersWithAccess}, Posts: ${event.numberOfPosts}` });
})
export const ElHoss = catchAsyncError(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const users = await User.find({ role: 'User' });
    const numberOfUsers = users.length;


    const numberOflikes = await Like.countDocuments()

    const topPosts = await Post.find({ event: req.params.eventId })
        .sort({ numberOfLikes: -1 }) 
        .limit(3);

    const numberOfPosts = await Post.countDocuments({ event: req.params.eventId });

    res.status(200).json({
        timeDifference: event.timeDifference,
        message: "Event details",
        data: {
            eventName: event.eventName,
            numberOfUsers,
            numberOfPosts,
            numberOflikes,
            topPosts 
        }
    });
});