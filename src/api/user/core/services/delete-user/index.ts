import { IdParamPayload } from '@/api/user/core/interfaces';
import { User } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus } from '@/core';

export class DeleteUser {
    constructor(private readonly dbUser: typeof User) {}

    handle = async ({ params }: ControllerArgs<IdParamPayload>) => {
        if (!params) throw new BadRequestError('Invalid Payload!');

        const result = await this.dbUser.destroy({
            where: { id: params.id },
        });

        if (result === 0) throw new BadRequestError('Invalid User');

        return {
            code: HttpStatus.NO_CONTENT,
            message: 'User Deleted Successfully',
        };
    };
}
