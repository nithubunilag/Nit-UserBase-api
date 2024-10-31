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

        await queryInterface.createTable('userProject', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },

            userId: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'user',
                    key: 'id',
                },
            },

            projectId: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'project',
                    key: 'id',
                },
            },

            roleInProject: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Contributor',
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
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */

        await queryInterface.dropTable('userProject', {
            cascade: true,
        });
    },
};
