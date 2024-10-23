import type { FileArray } from 'express-fileupload';
import type { ITokenSignedPayload } from '../common';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export interface Request {
            file: FileArray | null | undefined;
            user: ITokenSignedPayload | undefined;
        }
    }
}
