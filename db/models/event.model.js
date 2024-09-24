import { Schema, Types, model } from 'mongoose';

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['upcoming', 'proceeding', 'completed', 'canceled'],
        default: 'upcoming'
    },
    makeBy: {
        type: String,
        default: 'Hossam'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field to calculate the time difference between startTime and endTime
eventSchema.virtual('timeDifference').get(function() {
    const timeDiff = this.endTime - this.startTime;
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    
    // Check if timeLeftToStart has a value
    const timeLeft = this.timeLeftToStart;
    if (timeLeft && timeLeft !== 'Event has started or passed') {
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds (Time left to start: ${timeLeft})`;
    }
    
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
});

// Virtual field to calculate the remaining time to start the event
eventSchema.virtual('timeLeftToStart').get(function() {
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

const Event = model('Event', eventSchema);

export default Event;
