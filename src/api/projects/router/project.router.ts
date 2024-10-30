import { Router } from 'express';

export const projectRouter = Router();

// projectRouter
//     .route('/')
//     .post(
//         ControlBuilder.builder()
//             .setValidator(createUserSchema)
//             .setHandler(createUserHandler.handle)
//             .isPrivate()
//             .handle(),
//     )
//     .get(
//         ControlBuilder.builder()
//             .setValidator(getUserSchema)
//             .setHandler(retrieveUserHandler.handleAll)
//             .isPrivate()
//             .handle(),
//     )