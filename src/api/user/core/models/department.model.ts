import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { User } from './user.model';

export class Department extends Model<InferAttributes<Department>, InferCreationAttributes<Department>> {
    declare id: CreationOptional<string>;
    declare name: string;
}

Department.init(
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
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'department',
        tableName: 'department',
        timestamps: false,
        freezeTableName: true,
    },
);
