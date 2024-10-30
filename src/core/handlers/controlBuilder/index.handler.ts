import { HttpStatus, logger } from '@/core';
import type { AnyFunction, ExpressCallbackFunction } from '@/core/types';
import type { NextFunction, Request, Response } from 'express';
import { ControllerHandlerOptions, ValidationSchema } from './index.interface';
import { authenticateRequest, parseIncomingRequest, validateIncomingRequest } from './index.utils';

/**
 * Handles HTTP requests by providing methods for authentication, authorization, validation, and controller execution.
 */
export class ControllerHandler {
    /**
     * Creates a middleware function to handle the request and execute the controller function.
     *
     * it parses the controller arguments from the request.
     * then it valiates the request data against the provided schema.
     * afterwards, it executes the controller function and handle its response.
     *
     * @param {AnyFunction} controllerFn The controller function to execute.
     * @param {ValidationSchema} [schema={}] The schema to validate the request data against.
     * @param {ControllerHandlerOptions} options Configuration options for handling the request.
     * @returns {ExpressCallbackFunction} The Express middleware function.
     */
    handle = (controllerFn: AnyFunction, schema: ValidationSchema | undefined = {}, options: ControllerHandlerOptions): ExpressCallbackFunction => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (options?.isPrivate) await authenticateRequest(req);

                const controllerArgs = parseIncomingRequest(req);

                if (schema) validateIncomingRequest(schema, controllerArgs);

                const controllerResult = await controllerFn(controllerArgs);

                if (!controllerResult) {
                    res.status(HttpStatus.OK).send({ status: true });

                    return;
                }

                const { code, headers, ...data } = controllerResult;

                const newHeaders = { ...headers, 'Access-Control-Allow-Origin': 'http://localhost:3000', 'Access-Control-Allow-Credentials': 'true' };

                console.log(newHeaders);

                res.set(newHeaders)
                    .status(code ?? HttpStatus.OK)
                    .send(data);
            } catch (error) {
                logger.error(`Controller-Handler Error: ${error}`);

                next(error);
            }
        };
    };
}
