import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema({
    owner: {
        type: Types.ObjectId,
        ref:'User',
        required:true
    },
    photo: {
        type: String
    },
    event: {
        type: Types.ObjectId,
        ref: 'Event',
    },
    numberOfLikes: { type: Number, default: 0, min: [0, 'Number of likes cannot be less than 0'] },
});

const Post = model('Post', postSchema);

export default Post;
