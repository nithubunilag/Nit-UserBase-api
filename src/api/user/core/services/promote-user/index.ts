import { ActivityTimelineType, PromoteUserPayload } from '@/api/user/core/interfaces';
import { Department, EmploymentTimeline, Role, User } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus } from '@/core';

export class PromoteUser {
    constructor(
        private readonly dbUser: typeof User,
        private readonly dbEmploymentTimeline: typeof EmploymentTimeline,
        private readonly dbRole: typeof Role,
        private readonly dbDepartment: typeof Department,
    ) {}

    handle = async ({ params, input }: ControllerArgs<PromoteUserPayload>) => {
        if (!params || !input || (!input.departmentId && !input.roleId)) {
            throw new BadRequestError('Invalid Payload!');
        }

        const [user, department, role] = await Promise.all([
            this.dbUser.findOne({
                where: { id: params.id },
                include: [
                    { model: Department, as: 'department' },
                    { model: Role, as: 'role' },
                ],
            }),

            input.departmentId ? this.dbDepartment.findOne({ where: { id: input.departmentId } }) : null,

            input.roleId ? this.dbRole.findOne({ where: { id: input.roleId } }) : null,
        ]);

        if (!user) throw new BadRequestError('Invalid User');

        if (input.departmentId && !department) throw new BadRequestError('Invalid Department!');

        if (input.roleId && !role) throw new BadRequestError('Invalid Role!');

        const timelineEntries = [];

        if (input.departmentId) {
            timelineEntries.push({
                action: ActivityTimelineType.DEPARTMENT_CHANGE,
                oldValue: user.department?.name ?? user.departmentId,
                newValue: department!.name,
                userId: user.id,
            });

            user.departmentId = input.departmentId;
        }

        if (input.roleId) {
            timelineEntries.push({
                action: ActivityTimelineType.ROLE_CHANGE,
                oldValue: user.role?.name ?? user.roleId,
                newValue: role!.name,
                userId: user.id,
            });

            user.roleId = input.roleId;
        }

        await Promise.all([this.dbEmploymentTimeline.bulkCreate(timelineEntries), user.save()]);

        return {
            code: HttpStatus.OK,
            data: user,
            message: 'User Promoted Successfully',
        };
    };
}
