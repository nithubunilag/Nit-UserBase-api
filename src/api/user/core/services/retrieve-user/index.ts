import { IdParamPayload, RetrieveUserPayload } from '@/api/user/core/interfaces';
import { Department, EmploymentTimeline, Project, Role, User } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { InferAttributes, WhereOptions } from 'sequelize';

export class RetrieveUser {
    constructor(private readonly dbUser: typeof User, private readonly dbEmployentTimeline: typeof EmploymentTimeline) {}

    handleSingle = async ({ params }: ControllerArgs<IdParamPayload>) => {
        const { id } = params;

        const user = await this.dbUser.findOne({
            where: {
                id,
            },

            include: [
                { model: Department, as: 'department' },
                { model: Role, as: 'role' },
                { model: Project, as: 'projects' },
            ],
        });

        const employmentTimeline = await this.dbEmployentTimeline.findAll({
            attributes: ['id', 'userId', 'action', 'oldValue', 'newValue', 'createdAt'],

            where: {
                userId: id,
            },

            include: [{ model: User, as: 'user' }],
        });

        if (!user) throw new BadRequestError('Invalid User!');

        return {
            code: HttpStatus.OK,
            message: 'User retrieved successfully',
            data: {
                user: user.dataValues,
                employmentTimeline,
            },
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
                include: [
                    { model: Department, as: 'department' },
                    { model: Role, as: 'role' },
                    { model: Project, as: 'projects' },
                ],
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
