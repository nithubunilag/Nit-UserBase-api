import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { EducationalLevel, UserGender } from '../interfaces';
import { Department } from './department.model';
import { Project } from './project.model';
import { Role } from './role.model';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare fullName: string;
    declare emailAddress: string;
    declare gender: UserGender;
    declare dateOfBirth: CreationOptional<Date>;
    declare phoneNumber: CreationOptional<string>;
    declare ownIdData: CreationOptional<string>;
    declare emergencyContact: CreationOptional<string>;
    declare currentAddress: CreationOptional<string>;
    declare permanentAddress: CreationOptional<string>;
    declare linkedinProfile: CreationOptional<string>;
    declare educationLevel: CreationOptional<EducationalLevel>;
    declare roleId: ForeignKey<Role['id']>;
    declare departmentId: ForeignKey<Department['id']>;
    declare otp: CreationOptional<number>;
    declare otpExp: CreationOptional<Date>;

    public role?: Role;
    public department?: Department;
    public projects?: Project[];
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
        },

        gender: {
            type: DataTypes.ENUM(...Object.values(UserGender)),
            allowNull: false,
        },

        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        emergencyContact: {
            type: DataTypes.STRING,
        },

        currentAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        permanentAddress: {
            type: DataTypes.STRING,
        },
        ownIdData: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },

        linkedinProfile: {
            type: DataTypes.STRING,
        },

        educationLevel: {
            type: DataTypes.ENUM(...Object.values(EducationalLevel)),
        },
        otp: {
            type: DataTypes.INTEGER({ length: 6 }),
        },
        otpExp: {
            type: DataTypes.DATE,
        },

        roleId: {
            type: DataTypes.UUID,
            allowNull: false,

            references: {
                model: Role,
                key: 'id',
            },
        },

        departmentId: {
            type: DataTypes.UUID,
            allowNull: true,

            references: {
                model: Department,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'user',
        tableName: 'user',
        timestamps: true,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['emailAddress'],
            },
        ],
    },
);
