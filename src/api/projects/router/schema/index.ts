import { ValidationSchema } from '@/core';
import Joi from 'joi';

export const loginSchema: ValidationSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export const forgotPasswordSchema: ValidationSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string().required(),
    }),
};

export const resetPasswordSchema: ValidationSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string().required(),
        otp: Joi.string().length(4).required(),
        password: Joi.string().required(),
    }),
};
