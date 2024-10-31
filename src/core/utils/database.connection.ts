import { Department } from '@/api/user/core/models/department.model';
import { EmploymentTimeline } from '@/api/user/core/models/employment-timeline.model';
import { Project } from '@/api/user/core/models/project.model';
import { Role } from '@/api/user/core/models/role.model';
import { User } from '@/api/user/core/models/user.model';
import { UserProject } from '@/api/user/core/models/userProjects.model';
import { logger, sequelize } from '@/core';
import { Model } from 'sequelize';

export const initializeDbConnection = async () => {
    try {
        await sequelize.authenticate();

        // await sequelize.sync();

        setupAssociations();

        logger.info('Connection has been established successfully.');
    } catch (error) {
        console.log(error);

        throw error;
    }
};

const setupAssociations = () => {
    if (!(User?.prototype instanceof Model) || !(Project?.prototype instanceof Model)) {
        throw new Error('Models must be initialized before setting up associations');
    }

    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

    User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

    User.belongsToMany(Project, {
        through: UserProject,
        foreignKey: 'userId',
        otherKey: 'projectId',
        as: 'projects',
    });

    Project.belongsToMany(User, {
        through: UserProject,
        foreignKey: 'projectId',
        otherKey: 'userId',
        as: 'users',
    });

    EmploymentTimeline.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};
