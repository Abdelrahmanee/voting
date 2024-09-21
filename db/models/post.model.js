import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema({
    owner: {
        type: String
    },
    photo: {
        type: String
    },
    numberOfLikes:{type : Number ,default : 0 , min : 0},
});

const Post = model('Post', postSchema);

export default Post;
