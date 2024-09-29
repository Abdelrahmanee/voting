import { Schema, Types, model } from 'mongoose';

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'proceeding', 'completed', 'canceled'],
        default: 'upcoming'
    },
    makeBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    number_of_allowed_likes : {
        type: Number,
        min: 1,
        default: 1,
        required: true
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

eventSchema.virtual('timeDifference').get(function () {
    const timeDiff = this.endTime - this.startTime;

    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    const timeLeft = this.timeLeftToStart;
    let timeMessage = '';

    if (months > 0) {
        timeMessage += `${months} month${months > 1 ? 's' : ''}, `;
    }
    if (weeks > 0) {
        timeMessage += `${weeks} week${weeks > 1 ? 's' : ''}, `;
    }
    if (days > 0) {
        timeMessage += `${days} day${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0) {
        timeMessage += `${hours} hour${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        timeMessage += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    timeMessage += `${seconds} second${seconds !== 1 ? 's' : ''}`; // Always show seconds

    // Check if timeLeftToStart has a value
    if (timeLeft && timeLeft !== 'Event has started or passed') {
        return `${timeMessage} (Time left to start: ${timeLeft})`;
    }

    return timeMessage;
});


// Virtual field to calculate the remaining time to start the event
eventSchema.virtual('timeLeftToStart').get(function () {
    const currentTime = new Date();
    const timeLeft = this.startTime - currentTime;

    if (timeLeft <= 0) {
        return 'Event has started or passed';
    }

    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
});


eventSchema.virtual('numberOfPosts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'event',
    count: true,
});



eventSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'event',
});

eventSchema.virtual('numberOfUsersWithAccess', {
    ref: 'EventUser',
    localField: '_id',
    foreignField: 'event',
    count: true,
    match: { hasAccess: true }
});

eventSchema.virtual('usersWithAccess', {
    ref: 'EventUser',
    localField: '_id',
    foreignField: 'event',
    justOne: false, // Multiple users expected
    match: { hasAccess: true }, // Filters by hasAccess: true
});


const Event = model('Event', eventSchema);

export default Event;
