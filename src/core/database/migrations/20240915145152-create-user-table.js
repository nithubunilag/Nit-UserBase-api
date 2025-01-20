'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable('user', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },

            fullName: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            dateOfBirth: {
                type: Sequelize.DATE,
            },

            gender: {
                type: Sequelize.ENUM('male', 'female'),
                allowNull: false,
            },

            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            emailAddress: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            emergencyContact: {
                type: Sequelize.STRING,
            },

            currentAddress: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            permanentAddress: {
                type: Sequelize.STRING,
            },
            ownIdData: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },

            linkedinProfile: {
                type: Sequelize.STRING,
            },

            educationLevel: {
                type: Sequelize.ENUM('High School', 'B.Sc.', 'Masters', 'Ph.D.', 'Diploma', 'Associate Degree', 'Others'),
            },
            otp: {
                type: Sequelize.INTEGER({ length: 6 }),
            },
            otpExp: {
                type: Sequelize.DATE,
            },

            roleId: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'role',
                    key: 'id',
                },
            },
            departmentId: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'department',
                    key: 'id',
                },
            },

            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('user', ['emailAddress'], {
            unique: true,
            name: 'users_email_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */

        await queryInterface.removeIndex('user', 'users_email_unique');

        await queryInterface.dropTable('user', {
            cascade: true,
        });
    },
};
