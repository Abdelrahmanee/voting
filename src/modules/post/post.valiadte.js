
import Joi from "joi";


export const addPostSchema = Joi.object({
    body: {
        owner: Joi.string().required().messages({
            'string.base': 'owner should be a string.',
            'any.required': 'owner is required.'
        })
    },
    params: {},
    query: {},
    file: Joi.object({}).unknown(true)
})

export const updatePostSchema = Joi.object({
    body: {
        owner: Joi.string().required(),
    },
    params: { id: Joi.string().hex().length(24).required() },
    query: {}
})
export const deletePostSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex().length(24).required() },
    query: {}
})
export const getSpecificPostSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex().length(24).required() },
    query: {}
})