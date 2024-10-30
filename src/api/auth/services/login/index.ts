import { LoginPayload } from '@/api/auth/interfaces';
import { Auth } from '@/api/auth/models';
import { authUtil } from '@/api/auth/utils';
import { BadRequestError, compareHashedData, config, ControllerArgs, HttpStatus, logger } from '@/core';
import { Op } from 'sequelize';

export class Login {
    constructor(private readonly dbAuth: typeof Auth) {}

    /**
     * Handles user login, performs necessary validations, and generates tokens for authentication.
     *
     * @param {ControllerArgs<LoginDTO>} params - The input parameters for user login.
     * @returns {Promise<ApiResponse>} The API response containing authentication tokens and user data.
     * @throws {BadRequestError} Thrown if login credentials are invalid or user email is not verified.
     */

    login = async ({ input }: ControllerArgs<LoginPayload>) => {
        if (!input) throw new BadRequestError(`Invalid login credentials`);

        const { emailAddress, password } = input;

        const authUser = await this.dbAuth.findOne({
            where: {
                [Op.or]: [{ emailAddress }],
                provider: 'local',
            },
        });

        if (!authUser) throw new BadRequestError('Invalid login credentials');

        if (authUser.password) {
            const isPasswordValid = await compareHashedData(password, authUser.password);

            if (!isPasswordValid) throw new BadRequestError('Invalid login credentials');
        }

        const tokenPayload = {
            id: authUser.id,
        };

        const accessToken = authUtil._generateToken({
            data: tokenPayload,
            expiresIn: config.auth.accessTokenExpiresIn,
            secret: config.auth.accessTokenSecret,
        });


        if (!accessToken) throw new BadRequestError('Authentication failed');

        logger.info('Logged In Successfully');
        // Access to XMLHttpRequest at 'https://5487-105-112-204-181.ngrok-free.app/api/v1/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

        return {
            data: {
                user: authUser,
                accessToken,
            },
            code: HttpStatus.OK,
            message: 'Logged in Successfully',
            // headers: {
            //     'Set-Cookie': [`accessToken=${accessToken}; Path=/; HttpOnly; Secure; Max-Age=${15 * 60}; SameSite=Lax `],
            //     'Access-Control-Allow-Origin': 'http://localhost:3000'
            // },
        };
    };
}
