import { ControlBuilder } from '@/core';
import { Router } from 'express';
import { forgotPasswordHandler, getAuthUserHandler, loginHandler, logoutHandler, resetPasswordHandler } from '../services';
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from './schema';

export const authRouter = Router();

authRouter
    .get('/logout', logoutHandler.handle)

    .post(
        '/login',
        ControlBuilder.builder()
            .setValidator(loginSchema)
            .setHandler(loginHandler.login)
            .handle(),
    )

    .get(
        '/user',
        ControlBuilder.builder()
            .setHandler(getAuthUserHandler.handle)
            .isPrivate()
            .handle(),
    )

    .post(
        '/forgot-password',
        ControlBuilder.builder()
            .setValidator(forgotPasswordSchema)
            .setHandler(forgotPasswordHandler.handle)
            .handle(),
    )

    .post(
        '/reset-password',
        ControlBuilder.builder()
            .setValidator(resetPasswordSchema)
            .setHandler(resetPasswordHandler.handle)
            .handle(),
    )
  