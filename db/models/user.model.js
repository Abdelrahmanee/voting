import { Schema, Types, model } from 'mongoose';
import { ROLES, USERSTATUS } from '../../src/utilies/enums.js';

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
  likes: [{
    type: Types.ObjectId,
    ref: 'Post', // Assuming likes refer to Post model objects
  }],
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
    throw new Error('You can only have a maximum of 1 likes.');
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
