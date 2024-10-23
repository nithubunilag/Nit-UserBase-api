import { LoginPayload } from '@/api/auth/interfaces';
import { Auth } from '@/api/auth/models';
import { authUtil, OTPService } from '@/api/auth/utils';
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

    login = async ({ input, request }: ControllerArgs<LoginPayload>) => {
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

        return {
            data: authUser,
            code: HttpStatus.OK,
            message: 'Logged in Successfully',
            headers: {
                'Set-Cookie': [`accessToken=${accessToken}; Path=/; HttpOnly`],
            },
        };
    };
}
