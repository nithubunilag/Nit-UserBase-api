import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

import { Project } from './project.model';
import { User } from './user.model';

export class UserProject extends Model<InferAttributes<UserProject>, InferCreationAttributes<UserProject>> {
    declare id: CreationOptional<string>;
    declare userId: ForeignKey<User['id']>;
    declare projectId: ForeignKey<Project['id']>;
    declare roleInProject: CreationOptional<string>;
}

UserProject.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,

            references: {
                model: User,
                key: 'id',
            },
        },
        projectId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Project,
                key: 'projectId',
            },
        },

        roleInProject: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Contributor',
        },
    },
    {
        modelName: 'userProject',
        tableName: 'userProject',
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
);
