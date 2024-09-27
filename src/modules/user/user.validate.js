





import Joi from "joi";


export const createUserSchema = Joi.object({
    body: {
        name: Joi.string().min(2).max(24).required(),
        address: Joi.object().unknown(),
        phone: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    },
    params: {},
    query: {},
    file: Joi.object({}).unknown(true)
})

export const userInfoSchema = Joi.object({
    body: { userId: Joi.string().hex().length(24).required(), },
    params: {},
    query: {}
})

export const loginSchema = Joi.object({
    body: {phone: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))},
    params: {},
    query: {}
})