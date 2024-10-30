import { User } from '@/api/user/core';
import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { Project } from './project.model';

export class UserProject extends Model<InferAttributes<UserProject>, InferCreationAttributes<UserProject>> {
    declare userProjectId: CreationOptional<string>;
    declare userId: string;
    declare projectId: string;
    declare roleInProject: CreationOptional<string>;
    declare assignedAt: CreationOptional<Date>;
}

UserProject.init(
    {
        userProjectId: {
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

        assignedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        modelName: 'userProject',
        tableName: 'userProject',
        sequelize,
        timestamps: false,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'projectId'],
            },
        ],
    },
);
