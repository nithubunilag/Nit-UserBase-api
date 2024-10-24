import type { ControllerArgsTypes, RequestFileContents } from '@/core';
import { EducationalLevel, UserGender, UserPayload } from './module.types';

export interface IdParamPayload extends ControllerArgsTypes {
    params: {
        id: string;
    };
}

export interface CreateRolePayload extends ControllerArgsTypes {
    input: {
        name: string;
        description?: string;
    };
}
export interface UpdateRolePayload extends ControllerArgsTypes {
    input: Partial<{
        name: string;
        description: string;
    }>;

    params: {
        id: string;
    };
}

export interface CreateDepartmentPayload extends ControllerArgsTypes {
    input: {
        name: string;
    };
}
export interface UpdateDepartmentPayload extends ControllerArgsTypes {
    input: Partial<{
        name: string;
    }>;

    params: {
        id: string;
    };
}

export interface RetrieveUserPayload extends ControllerArgsTypes {
    query: {
        role: string | undefined;
        gender: UserGender | undefined;
        educationLevel: EducationalLevel | undefined;
        department: string | undefined;

        // sorting parameters
        sortBy: 'fullName' | 'createdAt' | undefined;
        sortOrder: 'asc' | 'desc' | undefined;

        // pagination parameters
        page: number | undefined;
        limit: number | undefined;
    };
}

export interface CreateUserPayload extends ControllerArgsTypes {
    input: UserPayload | UserPayload[];
}

export interface CreateUsersFromCSVPayload extends ControllerArgsTypes {
    query: {
        roleId: string;
    };
    files: {
        csv: RequestFileContents;
    };
}

export interface UpdateUserPayload extends ControllerArgsTypes {
    input: Partial<Omit<UserPayload, 'departmentId' | 'roleId'>>;

    params: {
        id: string;
    };
}

export interface PromoteUserPayload extends ControllerArgsTypes {
    input: Partial<{
        roleId: string;
        departmentId: string;
    }>;

    params: {
        id: string;
    };
}
