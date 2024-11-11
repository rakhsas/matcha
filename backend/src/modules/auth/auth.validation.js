import Joi from "joi";


export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    // password: Joi.string().min(8).max(12)
    // .regex(/[A-Z]/, 'upper-case')
    // .regex(/[a-z]/, 'lower-case')
    // .regex(/[^\w]/, 'special character')
    // .regex(/[0-9]/, "number")
    // .required(),
});