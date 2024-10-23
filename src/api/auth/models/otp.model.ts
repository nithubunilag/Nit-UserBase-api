import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Auth } from './auth.model';

export class OTP extends Model<InferAttributes<OTP>, InferCreationAttributes<OTP>> {
    declare id: CreationOptional<string>;
    declare authId: ForeignKey<Auth['id']>;
    declare otp: number;
    declare otpExp: Date;
}

OTP.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        authId: {
            type: DataTypes.UUID,
            allowNull: false,

            references: {
                model: Auth,
                key: 'id',
            },
        },
        otp: {
            type: DataTypes.INTEGER({ length: 6 }),
            allowNull: false,
        },
        otpExp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        tableName: 'otp',
        modelName: 'otp',
        timestamps: true,
    },
);
