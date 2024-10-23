import type { ControllerArgsTypes } from '@/core';

export interface LoginPayload extends ControllerArgsTypes {
    input: {
        emailAddress: string;
        password: string;
    };
}

export interface ForgotPasswordPayload extends ControllerArgsTypes {
    input: {
        emailAddress: string;
    };
}

export interface ResetPasswordPayload extends ControllerArgsTypes {
    input: {
        otp: string;
        password: string;
        emailAddress: string;
    };
}

export interface ResendVerifyIdentityEmailPayload extends ControllerArgsTypes {
    input: {
        emailAddress: string;
    };
}
