import { CreateRolePayload, IdParamPayload, UpdateRolePayload } from '@/api/user/core/interfaces';
import { Role } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus } from '@/core';
import { Op } from 'sequelize';

export class RoleService {
    constructor(private readonly dbRole: typeof Role) {}

    create = async ({ input }: ControllerArgs<CreateRolePayload>) => {
        const { name } = input;

        const roleResponse = await this.dbRole.findOrCreate({
            where: {
                name: {
                    [Op.iLike]: name.toLocaleUpperCase(),
                },
            },
            defaults: {
                name: name,
                description: input.description,
            },
        });

        return {
            code: HttpStatus.CREATED,
            data: roleResponse,
            message: 'Role created successfully',
        };
    };

    findAll = async () => {
        const roles = await this.dbRole.findAll();

        return {
            code: HttpStatus.OK,
            data: roles,
            message: 'Role Found successfully',
        };
    };

    findOne = async ({ params }: ControllerArgs<IdParamPayload>) => {
        const { id } = params;

        const role = await this.dbRole.findOne({
            where: {
                id,
            },
        });

        if (!role) throw new BadRequestError('Role Not Found');

        return {
            code: HttpStatus.OK,
            data: role,
            message: 'Role Found successfully',
        };
    };

    update = async ({ input, params }: ControllerArgs<UpdateRolePayload>) => {
        const { id } = params;

        if (!input.description && !input.name) throw new BadRequestError('Invalid Payload!');

        const role = await this.dbRole.findOne({
            where: { id },
        });

        if (!role) throw new BadRequestError('Role not found.');

        await this.dbRole.update(input, { where: { id } });

        const updatedRole = { ...role.dataValues, ...input };

        return {
            code: HttpStatus.OK,
            data: updatedRole,
            message: 'Role updated successfully',
        };
    };
}
