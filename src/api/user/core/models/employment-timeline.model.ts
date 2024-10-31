import { ActivityTimelineType } from '@/api/user/core/interfaces';
import { User } from '@/api/user/core/models';
import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class EmploymentTimeline extends Model<InferAttributes<EmploymentTimeline>, InferCreationAttributes<EmploymentTimeline>> {
    declare id: CreationOptional<number>;
    declare userId: ForeignKey<User['id']>;
    declare action: ActivityTimelineType;
    declare oldValue: string;
    declare newValue: string;

    public user?: User;
}

EmploymentTimeline.init(
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

        action: {
            type: DataTypes.ENUM(...Object.values(ActivityTimelineType)),
            allowNull: false,
        },

        oldValue: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        newValue: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'employmentTimeline',
        tableName: 'employmentTimeline',
        timestamps: true,
        freezeTableName: true,
    },
);
