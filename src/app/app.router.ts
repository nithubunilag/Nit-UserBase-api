import { authRouter } from '@/api/auth/router/auth.router';
import { userRouter } from '@/api/user/core';
import { HttpStatus } from '@/core';
import { Router } from 'express';

export const appRouter = Router();

appRouter.use('/auth', authRouter); // DONE

appRouter.use('/user', userRouter);

appRouter.get('/health', (_, res) => {
    res.status(HttpStatus.OK).json({
        message: 'Api up',
        version: '1.0',
    });
});
