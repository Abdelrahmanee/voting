


import { Schema, model, Types } from 'mongoose'

const likeSchema = new Schema({
    likedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    postId:{
        type: Types.ObjectId,
        ref: 'Post'
    }

}, { timestamps: true }
)


export const Like = model('Like', likeSchema)