import { Schema, Types, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
    default: Date.now,
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'Post', // Assuming likes refer to Post model objects
}]
});
userSchema.path('likes').set(function(likes) {
  // Ensure the array contains only unique values
  return [...new Set(likes)];
});

// Validation to enforce a maximum of 3 likes
userSchema.path('likes').validate(function(likes) {
  if (likes.length > 3) {
    throw new Error('You can only have a maximum of 3 likes.');
  }
}, 'You can only have a maximum of 3 likes.');
const User = model('User', userSchema);

export default User;
