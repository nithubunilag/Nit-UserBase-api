import { IdParamPayload, RetrieveUserPayload } from '@/api/user/core/interfaces';
import { User } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { InferAttributes, WhereOptions } from 'sequelize';

export class RetrieveUser {
    constructor(private readonly dbUser: typeof User) {}

    handleSingle = async ({ params }: ControllerArgs<IdParamPayload>) => {
        const { id } = params;

        const user = await this.dbUser.findOne({
            where: {
                id,
            },
        });

        if (!user) throw new BadRequestError('Invalid User!');

        return {
            code: HttpStatus.OK,
            message: 'User retrieved successfully',
            data: user,
        };
    };

    handleAll = async ({ query }: ControllerArgs<RetrieveUserPayload>) => {
        const { department, educationLevel, gender, role, sortBy = 'fullName', sortOrder = 'asc', page = 1, limit = 10 } = query;

        const where: WhereOptions<InferAttributes<User>> = {
            ...(department && { departmentId: department }),
            ...(educationLevel && { educationLevel }),
            ...(gender && { gender }),
            ...(role && { roleId: role }),
        };

        const offset = (page - 1) * limit;

        try {
            const users = await this.dbUser.findAll({
                where,
                order: [[sortBy, sortOrder]],
                offset,
                limit,
            });

            return {
                code: HttpStatus.OK,
                message: 'Users retrieved successfully',
                data: users,
            };
        } catch (error) {
            logger.error('Error retrieving users:', error);

            throw new Error('Error while retrieving Users');
        }
    };
}
