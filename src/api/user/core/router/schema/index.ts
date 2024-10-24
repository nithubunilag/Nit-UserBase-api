import { ValidationSchema } from '@/core';
import Joi from 'joi';
import { EducationalLevel, UserGender } from '../../interfaces';

export const idParamsSchema: ValidationSchema = {
    paramsSchema: Joi.object().keys({
        id: Joi.string().uuid().required(),
    }),
};

export const userValidationSchema = Joi.object({
    fullName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    roleId: Joi.string().uuid().required(),
    gender: Joi.string()
        .valid(...Object.values(UserGender))
        .required(),
    departmentId: Joi.string().uuid().optional(),
    dateOfBirth: Joi.date().optional(),
    phoneNumber: Joi.string().optional(),
    emergencyContact: Joi.string().optional(),
    currentAddress: Joi.string().optional(),
    permanentAddress: Joi.string().optional(),
    linkedinProfile: Joi.string().optional().uri(),
    educationLevel: Joi.string()
        .valid(...Object.values(EducationalLevel))
        .optional(),
});

export const createUserSchema: ValidationSchema = {
    inputSchema: Joi.alternatives().try(userValidationSchema, Joi.array().items(userValidationSchema)),
};

export const getUserSchema: ValidationSchema = {
    querySchema: Joi.object().keys({
        role: Joi.string().optional(),
        gender: Joi.string()
            .valid(...Object.values(UserGender))
            .optional(),
        educationLevel: Joi.string()
            .valid(...Object.values(EducationalLevel))
            .optional(),
        department: Joi.string().optional(),

        // Sorting
        sortBy: Joi.string().valid('fullName', 'createdAt').optional(),
        sortOrder: Joi.string().valid('asc', 'desc').optional(),

        // Pagination
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).optional(),
    }),
};

export const updateUserSchema: ValidationSchema = {
    inputSchema: Joi.object({
        fullName: Joi.string().optional(),
        emailAddress: Joi.string().email().optional(),
        gender: Joi.string()
            .valid(...Object.values(UserGender))
            .optional(),
        dateOfBirth: Joi.date().optional(),
        phoneNumber: Joi.string().optional(),
        emergencyContact: Joi.string().optional(),
        currentAddress: Joi.string().optional(),
        permanentAddress: Joi.string().optional(),
        linkedinProfile: Joi.string().optional().uri(),
        educationLevel: Joi.string()
            .valid(...Object.values(EducationalLevel))
            .optional(),
    }).required(),

    paramsSchema: Joi.object({
        id: Joi.string().uuid().required(),
    }).required(),
};

export const promoteUserSchema: ValidationSchema = {
    inputSchema: Joi.object({
        roleId: Joi.string().uuid().required(),
        departmentId: Joi.string().uuid().optional(),
    }).required(),

    paramsSchema: Joi.object({
        id: Joi.string().uuid().required(),
    }).required(),
};

export const createRoleSchema: ValidationSchema = {
    inputSchema: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
    }).required(),
};

export const updateRoleSchema: ValidationSchema = {
    inputSchema: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
    }).required(),

    paramsSchema: Joi.object({
        id: Joi.string().uuid().required(),
    }).required(),
};

export const createDepartmentSchema: ValidationSchema = {
    inputSchema: Joi.object({
        name: Joi.string().required(),
    }).required(),
};

export const updateDepartmentSchema: ValidationSchema = {
    inputSchema: Joi.object({
        name: Joi.string().required(),
    }).required(),

    paramsSchema: Joi.object({
        id: Joi.string().uuid().required(),
    }).required(),
};
