import { Auth } from '@/api/auth/';
import { ControllerArgs, HttpStatus, UnAuthorizedError } from '@/core';

export class GetAuthUser {
    constructor(private readonly dbAuth: typeof Auth) {}

    handle = async ({ user }: ControllerArgs) => {
        if (!user) throw new UnAuthorizedError('Unauthorized');

        const currentUser = await this.dbAuth.findOne({
            where: {
                id: user.id,
            },
        });

        if (!currentUser) throw new UnAuthorizedError('Invalid User');

        return {
            code: HttpStatus.OK,
            data: currentUser,
            message: 'User Found successfully',
        };
    };
}
