import { UpdateUserPayload } from '@/api/user/core/interfaces';
import { Role, User } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';

export class UpdateUser {
    constructor(private readonly dbUser: typeof User, private readonly dbRole: typeof Role) {}

    handle = async ({ input, params }: ControllerArgs<UpdateUserPayload>) => {
        if (!input) throw new BadRequestError('Invalid input data');

        const { emailAddress } = input;

        if (emailAddress) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(emailAddress)) throw new BadRequestError('Invalid email address format');
        }

        const user = await this.dbUser.findOne({
            where: {
                id: params.id,
            },
        });

        if (!user) throw new BadRequestError('Invalid User!');

        await user.update(input);

        await user.save();

        logger.info('User Updated Successfully');

        return {
            data: user,
            code: HttpStatus.OK,
            message: 'User Updated Successfully',
        };
    };
}
