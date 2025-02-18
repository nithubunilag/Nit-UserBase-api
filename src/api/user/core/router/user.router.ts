import { ControlBuilder } from '@/core';
import { Router } from 'express';
import { createUserHandler, deleteUserHandler,projectService, departmentService, promoteUserHandler, retrieveUserHandler, roleServiceHandler, updateUserHandler } from '../services/';
import {
    assignProjectsToUserSchema,
    createDepartmentSchema,
    createProjectSchema,
    createRoleSchema,
    createUserSchema,
    createUsersFromCSVSchema,
    getProjectSchema,
    getUserSchema, idParamsSchema, promoteUserSchema, updateDepartmentSchema, updateRoleSchema, updateUserSchema
} from './schema';

export const userRouter = Router();


/***********  ROLES  ***********/
userRouter
    .route('/roles')
    .post(
        ControlBuilder.builder()
            .setValidator(createRoleSchema)
            .setHandler(roleServiceHandler.create)
            .isPrivate()
            .handle(),
    )
    .get(
        ControlBuilder.builder()
            .setHandler(roleServiceHandler.findAll)
            .isPrivate()
            .handle(),
    )
    .put(
        ControlBuilder.builder()
            .setValidator(updateRoleSchema)
            .setHandler(roleServiceHandler.update)
            .isPrivate()
            .handle(),
    )

/***********  DEPARTMENT  ***********/
userRouter
    .route('/departments')
    .post(
        ControlBuilder.builder()
            .setValidator(createDepartmentSchema)
            .setHandler(departmentService.create)
            .isPrivate()
            .handle(),
    )
    .get(
        ControlBuilder.builder()
            .setHandler(departmentService.findAll)
            .isPrivate()
            .handle(),
    )
    .put(
        ControlBuilder.builder()
            .setValidator(updateDepartmentSchema)
            .setHandler(departmentService.update)
            .isPrivate()
            .handle(),
    )
/***********  PROJECT  ***********/
userRouter
    .route('/projects')
    .post(
        ControlBuilder.builder()
            .setValidator(createProjectSchema)
            .setHandler(projectService.create)
            .isPrivate()
            .handle(),
    )
    .get(
        ControlBuilder.builder()
            .setValidator(getProjectSchema)
            .setHandler(projectService.findAll)
            .isPrivate()
            .handle(),
    )

userRouter
    .route('/projects/:id')
    .get(
        ControlBuilder.builder()
            .setValidator(idParamsSchema)
            .setHandler(projectService.findOne)
            .isPrivate()
            .handle(),
    )


/***********  USER  ***********/
userRouter
    .route('/')
    .post(
        ControlBuilder.builder()
            .setValidator(createUserSchema)
            .setHandler(createUserHandler.handle)
            .isPrivate()
            .handle(),
    )
    .get(
        ControlBuilder.builder()
            .setValidator(getUserSchema)
            .setHandler(retrieveUserHandler.handleAll)
            .isPrivate()
            .handle(),
    )

userRouter.post(
    '/csv',
    ControlBuilder.builder()
        .setHandler(createUserHandler.handleCSV)
        .setValidator(createUsersFromCSVSchema)
        .isPrivate()
        .handle(),
);


userRouter
    .route('/:id')
    .get(
        ControlBuilder.builder()
            .setHandler(retrieveUserHandler.handleSingle)
            .setValidator(idParamsSchema)
            .isPrivate()
            .handle(),
    )
    .put(
        ControlBuilder.builder()
            .setHandler(updateUserHandler.handle)
            .setValidator(updateUserSchema)
            .isPrivate()
            .handle(),
    )
    .delete(
        ControlBuilder.builder()
            .setHandler(deleteUserHandler.handle)
            .setValidator(idParamsSchema)
            .isPrivate()
            .handle(),
    );

userRouter.patch(
    '/:id/promote',
    ControlBuilder.builder()
        .setHandler(promoteUserHandler.handle)
        .setValidator(promoteUserSchema)
        .isPrivate()
        .handle(),
);

userRouter.post(
    '/:id/assign-projects',
    ControlBuilder.builder()
        .setHandler(projectService.assignProjectsToUser)
        .setValidator(assignProjectsToUserSchema)
        .isPrivate()
        .handle(),
);



