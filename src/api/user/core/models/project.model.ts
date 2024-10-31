import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { ProjectStatus } from '../interfaces';
import { User } from './user.model';

export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare description: CreationOptional<string>;
    declare status: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare users?: User[];
}

Project.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ProjectStatus)),
            allowNull: false,
            defaultValue: 'active',
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        modelName: 'project',
        tableName: 'project',
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
);

