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
    type: [Types.ObjectId], // Array of ObjectIds, referencing Post
    ref: 'Post',
    validate: {
      validator: async function (likes) {
        // 'this' refers to the current user document
        if (!this.eventIdToValidate)
          return
        const eventId = this.eventIdToValidate;  // Assuming this field will be set externally

        if (!eventId) {
          throw new Error('No event specified for validation.');
        }

        // Check if the user is associated with this event
        if (!this.events.includes(eventId)) {
          throw new Error('The specified event is not associated with this user.');
        }

        // Find the event by its ID
        const event = await Event.findById(eventId);
        if (!event) {
          throw new Error('Event not found.');
        }

        // Check the max allowed likes for the event
        const maxLikes = event.number_of_allowed_likes;
        console.log(maxLikes);
        
        if (likes.length > maxLikes) {
          throw new Error(`You can only have a maximum of ${maxLikes} likes for this event.`);
        }

        return true;
      },
      message: function (props) {
        return `You have exceeded the maximum allowed likes for the selected event.`;
      }
    }
  }
}, { timestamps: true });




userSchema.path('events').set(function (events) {
  return [...new Set(events)];
});

userSchema.path('likes').set(function (likes) {
  return [...new Set(likes)];
});



userSchema.virtual('accessedEvents', {
  ref: 'EventUser',
  localField: '_id',
  foreignField: 'user',
  justOne: false, 
});




const User = model('User', userSchema);

export default User;
