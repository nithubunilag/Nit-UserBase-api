import { CreateDepartmentPayload, IdParamPayload, UpdateDepartmentPayload } from '@/api/user/core/interfaces';
import { Department } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus } from '@/core';
import { Op } from 'sequelize';

export class DepartmentService {
    constructor(private readonly dbDepartment: typeof Department) {}

    create = async ({ input }: ControllerArgs<CreateDepartmentPayload>) => {
        const { name } = input;

        const department = await this.dbDepartment.findOrCreate({
            where: {
                name: {
                    [Op.iLike]: name.toLocaleUpperCase(),
                },
            },
            defaults: {
                name: name,
            },
        });

        return {
            code: HttpStatus.CREATED,
            data: department,
            message: 'Department created successfully',
        };
    };

    findAll = async () => {
        const departments = await this.dbDepartment.findAll({
            attributes: ['id', 'name', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']],
        });

        return {
            code: HttpStatus.OK,
            data: departments,
            message: 'Departments Found successfully',
        };
    };

    findOne = async ({ params }: ControllerArgs<IdParamPayload>) => {
        const { id } = params;

        const department = await this.dbDepartment.findOne({
            where: {
                id,
            },
        });

        if (!department) throw new BadRequestError('Department Not Found');

        return {
            code: HttpStatus.OK,
            data: department,
            message: 'Department Found successfully',
        };
    };

    update = async ({ input, params }: ControllerArgs<UpdateDepartmentPayload>) => {
        const { id } = params;

        if (!input.name) throw new BadRequestError('Invalid Payload!');

        const department = await this.dbDepartment.findOne({
            where: { id },
        });

        if (!department) throw new BadRequestError('Department not found!');

        await this.dbDepartment.update(input, { where: { id } });

        const updatedDepartment = { ...department.dataValues, ...input };

        return {
            code: HttpStatus.OK,
            data: updatedDepartment,
            message: 'Department updated successfully',
        };
    };
}
