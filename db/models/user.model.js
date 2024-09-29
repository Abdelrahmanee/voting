import { Schema, Types, model } from 'mongoose';
import { ROLES, USERSTATUS } from '../../src/utilies/enums.js';
import { AppError } from '../../src/utilies/error.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER
  },
  ipAddress: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isLoggedOut: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(USERSTATUS),
    default: USERSTATUS.OFFLINE
  },
  events: [{
    type: Types.ObjectId,
    ref: 'Event',
    default: [],
  }],
  likes: {
    type: [Types.ObjectId],
    ref: 'LikedItem',
    validate: {
      validator: async function (likes) {

        const eventId = this.eventIdToValidate;

        if (!eventId) {
          throw new AppError('No event specified for validation.' , 400);
        }

        if (!this.events.includes(eventId)) {
          throw new AppError('The specified event is not associated with this user.', 400);
        }

        const event = await Event.findById(eventId);
        if (!event) {
          throw new AppError('Event not found.', 404);
        }

        const maxLikes = event.number_of_allowed_likes;

        if (likes.length > maxLikes) {
          throw new AppError(`You can only have a maximum of ${maxLikes} likes for this event.`, 400);
        }

        return true;
      },
      message: function (props) {
        return `You have exceeded the maximum allowed likes for the selected event.`;
      }
    }
  },
}, { timestamps: true });




userSchema.path('events').set(function (events) {
  return [...new Set(events)];
});

userSchema.path('likes').set(function (likes) {
  return [...new Set(likes)];
});


// Validation to enforce a maximum of 3 likes
userSchema.path('likes').validate(function (likes) {
  if (likes.length > 1) {
    throw new AppError('You can only have a maximum of 1 likes.');
  }
}, 'You can only have a maximum of 1 likes.');

userSchema.virtual('accessedEvents', {
  ref: 'EventUser',
  localField: '_id',
  foreignField: 'user',
  justOne: false, // We expect multiple events per user
});




const User = model('User', userSchema);

export default User;
