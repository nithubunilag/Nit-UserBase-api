import { appRouter } from '@/app';
import { corsOptions, errorHandler, notFoundHandler } from '@/core';
import { API_SUFFIX } from '@/core/common';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';

export const app = express();

// Use the built-in middleware to parse JSON bodies. This allows you to handle JSON payloads.
app.use(express.json());

// Use cookie-parser middleware to parse cookies attached to the client request object.
app.use(cookieParser());

// Use file-upload middleware to handle file uploads.
// Files are stored in temporary files instead of memory for efficient large file handling.
app.use(
    fileUpload({
        useTempFiles: true,
    }),
);

// Enable Cross-Origin Resource Sharing (CORS) with predefined options.
app.use(cors(corsOptions));

// Serve static files located in the 'public' directory.
// This directory will now be publicly accessible via HTTP.
app.use(express.static('public'));

// Use middleware to parse URL-encoded bodies with the querystring library.
// 'extended: false' opts to use the classic encoding.
app.use(express.urlencoded({ extended: false }));

// Mount the API routes under '/api/v1'. All routes inside appRouter will be prefixed with '/api/v1'.
app.use(API_SUFFIX, appRouter);

app.set('trust proxy', true);

app.use(notFoundHandler.handle);
app.use(errorHandler.handle);
