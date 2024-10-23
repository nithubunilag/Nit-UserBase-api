import { HttpStatus } from '@/core';
import { AppMessages } from '@/core/common';
import type { NextFunction, Request, Response } from 'express';

export class Logout {
    constructor() {}

    handle = (req: Request, res: Response, next: NextFunction) => {
        req.user = undefined;

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(HttpStatus.NO_CONTENT).send({ message: AppMessages.SUCCESS.LOGOUT });
    };
}
