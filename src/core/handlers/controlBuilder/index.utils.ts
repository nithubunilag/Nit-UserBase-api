import { authUtil } from '@/api/auth/utils';
import { UnAuthorizedError, UnProcessableError, config, joiValidate, logger } from '@/core';
import type { FileObject, FileObjects } from '@/core/types';
import type { Request } from 'express';
import type { FileArray } from 'express-fileupload';
import { ControllerArgsTypes, ValidationSchema } from './index.interface';

export const parseIncomingRequest = (req: Request): ControllerArgsTypes => {
    return {
        input: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        user: req.user,
        files: parseFileContents(req.files),
        request: req,
    };
};

const parseFileContents = (files: FileArray | null | undefined): FileObjects | null => {
    if (!files) return null;

    const fileObjects: FileObjects = {};

    for (const key in files) {
        const file = files[key] as FileObject;

        fileObjects[key] = file;
    }

    return fileObjects;
};

/**
 * Validate the request data against the provided schema.
 * @param {ValidationSchema} schema The schema definitions for query, params, and input.
 * @param {ParsedRequestContext} controllerArgs The parsed controller arguments.
 * @private
 */
export const validateIncomingRequest = (schema: ValidationSchema, controllerArgs: ControllerArgsTypes) => {
    const { querySchema, paramsSchema, inputSchema } = schema;

    const { input, params, query } = controllerArgs;

    try {
        if (inputSchema) joiValidate(inputSchema, input);
        if (querySchema) joiValidate(querySchema, query);
        if (paramsSchema) joiValidate(paramsSchema, params);
    } catch (error: any) {
        throw new UnProcessableError(error.message.replaceAll('"', ''));
    }
};

export const authenticateRequest = async (req: Request): Promise<void> => {
    if (req.user?.id) return;

    try {
        // const accessToken = req.cookies?.accessToken;

        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            throw new UnAuthorizedError('Unauthorized: No access token provided');
        }

        const data = await authUtil.extractTokenDetails(accessToken, config.auth.accessTokenSecret);

        if (!data) {
            throw new UnAuthorizedError('Unauthorized: Invalid token data');
        }

        req.user = data;
    } catch (error: any) {
        logger.error(`Authentication Error: ${error.message}`);

        throw new UnAuthorizedError('Unauthorized: Authentication failed');
    }
};
