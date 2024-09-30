
import Joi from "joi";


export const addPostSchema = Joi.object({
    body: {
        userId: Joi.string().hex().length(24).required(),
        owner: Joi.string().min(2).required(),
    },
    params: { eventId: Joi.string().hex().length(24).required() },
    query: {},
    file: Joi.object({}).unknown(true)
})

export const updatePostSchema = Joi.object({
    body: {
        userId: Joi.string().hex().length(24).required(),
        // owner: Joi.string().min(2).required(),
    },
    params: {
        postId: Joi.string().hex().length(24).required(),
        eventId: Joi.string().hex().length(24).required()
    },
    query: {}
})
export const deletePostSchema = Joi.object({
    body: {
        userId: Joi.string().hex().length(24).required(),
    },
    params: {
        postId: Joi.string().hex().length(24).required(),
        eventId: Joi.string().hex().length(24).required()
    },
    query: {}
})
export const getSpecificPostSchema = Joi.object({
    body: {
        userId: Joi.string().hex().length(24).required(),
    },
    params: {
        postId: Joi.string().hex().length(24).required(),
        eventId: Joi.string().hex().length(24).required()
    },
    query: {}
})
export const allPostsSchema = Joi.object({
    body: {
        userId: Joi.string().hex().length(24).required(),
    },
    params: {
        eventId: Joi.string().hex().length(24).required()
    },
    query: {}
})