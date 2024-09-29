





import Joi from "joi";


export const createUserSchema = Joi.object({
    body: {
        name: Joi.string().min(3).max(24).required(),
        address: Joi.object().unknown(true),
        phone: Joi.string().pattern(new RegExp('^(0(11|10|12|15)[0-9]{8})$')).required()

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
    body: { phone: Joi.string().pattern(new RegExp('^(0(11|10|12|15)[0-9]{8})$')).required() },
    params: {},
    query: {}
})