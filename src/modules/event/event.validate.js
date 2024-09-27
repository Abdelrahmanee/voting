



import Joi from "joi";




export const createEventSchema = Joi.object({
    body: {

        startTime: Joi.date().required().messages({
            'date.base': 'startTime should be a date.',
            'any.required': 'startTime is required.'
        }),
        endTime: Joi.date().required().messages({
            'date.base': 'endTime should be a date.',
            'any.required': 'endTime is required.'
        }),
        eventName: Joi.string().required().messages({
            'string.base': 'eventName should be a string.',
            'any.required': 'eventName is required.'
        })
    },
    query: {},
    params: {}
});
export const getSpecificEventSchema = Joi.object({
    body: {},
    params: { eventId: Joi.string().hex().length(24).required(), },
    query: {}
})
export const checkEventStartSchema = Joi.object({
    body: {},
    params: { eventId: Joi.string().hex().length(24).required(), },
    query: {}
})
export const checkEventEndSchema = Joi.object({
    body: {},
    params: { eventId: Joi.string().hex().length(24).required(), },
    query: {}
})
