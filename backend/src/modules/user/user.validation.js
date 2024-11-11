// src/validations/userValidation.js
import Joi from "joi";

export const createUserSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).max(12)
    .regex(/[A-Z]/, 'upper-case')
    .regex(/[a-z]/, 'lower-case')
    .regex(/[^\w]/, 'special character')
    .regex(/[0-9]/, "number")
    .required(),
    
});

export const updateUserSchema = Joi.object({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email(),
    username: Joi.string().min(3),
});
