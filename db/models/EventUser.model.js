import { model, Schema } from 'mongoose';
import { Types } from 'mongoose';


const eventUserSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: Types.ObjectId,
        ref: 'Event',
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    organizer: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    interactions: {
        likes: {
            type: Number, 
            min:0,
            default: 0,
        }
    },
}, {
    timestamps: true,
    versionKey: false,
});

// Create a compound index for user and event to avoid duplicates
eventUserSchema.index({ user: 1, event: 1 }, { unique: true });

const EventUser = model('EventUser', eventUserSchema);

export default EventUser;
