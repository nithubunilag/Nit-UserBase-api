import { CreateUserPayload } from '@/api/user/core/interfaces';
import { Role, User } from '@/api/user/core/models';
import { BadRequestError, ConflictError, ControllerArgs, HttpStatus, logger } from '@/core';

export class CreateUser {
    constructor(private readonly dbUser: typeof User, private readonly dbRole: typeof Role) {}

    handle = async ({ input }: ControllerArgs<CreateUserPayload>) => {
        if (!input) throw new BadRequestError('Invalid input data');

        const { emailAddress, roleId } = input;

        if (!emailAddress) throw new BadRequestError('Email address is required');

        if (!roleId) throw new BadRequestError('Role ID is required');

        // Check if email address is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) throw new BadRequestError('Invalid email address format');

        const existingUser = await this.dbUser.findOne({
            where: {
                emailAddress,
            },
        });

        if (existingUser) throw new ConflictError('User with this email already exists');

        const role = await this.dbRole.findOne({
            where: {
                id: roleId,
            },
        });

        if (!role) throw new BadRequestError('Invalid Role!');

        const newUser = await this.dbUser.create(input);

        logger.info('User Created Successfully');

        return {
            data: newUser,
            code: HttpStatus.CREATED,
            message: 'User Created Successfully',
        };
    };
}
