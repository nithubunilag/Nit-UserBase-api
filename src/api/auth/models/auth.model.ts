import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class Auth extends Model<InferAttributes<Auth>, InferCreationAttributes<Auth>> {
    declare id: CreationOptional<string>;
    declare emailAddress: CreationOptional<string>;
    declare password: string | null;
    declare providerId: CreationOptional<string>;
    declare provider: CreationOptional<string>;
}

Auth.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        providerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        modelName: 'auth',
        tableName: 'auth',
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
);
