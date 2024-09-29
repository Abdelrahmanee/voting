



import Joi from "joi";




export const createEventSchema = Joi.object({
    body: {
        number_of_allowed_likes: Joi.number().integer().min(1).positive().default(1).required(),
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
        }),
        userId: Joi.string().hex().length(24).required()
    },
    query: {},
    params: {}
});

export const checkEventIdParams = Joi.object({
    body: { userId: Joi.string().hex().length(24).required(), },
    params: { eventId: Joi.string().hex().length(24).required(), },
    query: {}
})
