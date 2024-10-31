import {
    ActivityTimelineType,
    AssignProjectsToUserPayload,
    CreateProjectPayload,
    IdParamPayload,
    RetrieveProjectPayload,
} from '@/api/user/core/interfaces';
import { EmploymentTimeline, Project, User, UserProject } from '@/api/user/core/models';
import { BadRequestError, ConflictError, ControllerArgs, HttpStatus, logger, sequelize } from '@/core';
import { Op } from 'sequelize';

export class ProjectService {
    constructor(
        private readonly dbUser: typeof User,
        private readonly dbProject: typeof Project,
        private readonly dbUserProject: typeof UserProject,
        private readonly dbEmploymentTimeline: typeof EmploymentTimeline,
    ) {}

    create = async ({ input }: ControllerArgs<CreateProjectPayload>) => {
        if (!input) throw new BadRequestError('Invalid input data');

        const { name } = input;

        const existingProject = await this.dbProject.findOne({
            where: {
                name: {
                    [Op.iLike]: name.toLocaleUpperCase(),
                },
            },
        });

        if (existingProject) throw new ConflictError('Project with this name already exists');

        const newProject = await this.dbProject.create(input);

        return {
            data: newProject,
            code: HttpStatus.CREATED,
            message: 'Project Created Successfully',
        };
    };

    findOne = async ({ params }: ControllerArgs<IdParamPayload>) => {
        const { id } = params;

        const project = await this.dbProject.findOne({
            where: {
                id,
            },

            include: [{ model: User, as: 'users' }],
        });

        if (!project) throw new BadRequestError('Invalid Project!');

        return {
            code: HttpStatus.OK,
            message: 'Project retrieved successfully',
            data: project,
        };
    };

    findAll = async ({ query }: ControllerArgs<RetrieveProjectPayload>) => {
        const { sortBy = 'fullName', sortOrder = 'asc', page = 1, limit = 10 } = query;

        const offset = (page - 1) * limit;

        try {
            const projects = await this.dbProject.findAll({
                // order: [[sortBy, sortOrder]],
                // offset,
                // limit,
            });

            return {
                code: HttpStatus.OK,
                message: 'Projects retrieved successfully',
                data: projects,
            };
        } catch (error) {
            logger.error('Error retrieving Projects:', error);

            throw new Error('Error while retrieving Projects');
        }
    };

    assignProjectsToUser = async ({ params, input }: ControllerArgs<AssignProjectsToUserPayload>) => {
        const { id } = params;

        if (!input.projectIds || !Array.isArray(input.projectIds) || input.projectIds.length === 0) {
            throw new BadRequestError('Invalid Payload!');
        }

        const user = await this.dbUser.findOne({
            where: { id },
        });

        if (!user) throw new BadRequestError('User not found!');

        const transaction = await sequelize.transaction();

        try {
            await Promise.all(
                input.projectIds.map(async (projectId) => {
                    const project = await this.dbProject.findOne({
                        where: {
                            id: projectId,
                        },
                    });

                    if (!project) throw new BadRequestError(`Project with id ${projectId} not found!`);

                    const existingAssignment = await this.dbUserProject.findOne({
                        where: {
                            userId: id,
                            projectId,
                        },
                    });

                    if (existingAssignment) {
                        await this.dbUserProject.destroy({
                            where: {
                                userId: id,
                                projectId,
                            },
                        });

                        await this.dbEmploymentTimeline.create({
                            userId: id,
                            action: ActivityTimelineType.PROJECT_DEASSIGNMENT,
                            oldValue: project.name,
                            newValue: '',
                        });
                    }

                    if (!existingAssignment) {
                        await this.dbUserProject.create({
                            userId: id,
                            projectId,
                        });

                        await this.dbEmploymentTimeline.create({
                            userId: id,
                            action: ActivityTimelineType.PROJECT_ASSIGNMENT,
                            oldValue: '',
                            newValue: project.name,
                        });
                    }
                }),
            );

            await transaction.commit();

            return {
                code: HttpStatus.OK,
                message: 'Projects assigned to user successfully',
            };
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    };
}
