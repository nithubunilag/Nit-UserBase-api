'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'role',
            [
                {
                    id: uuidv4(),
                    name: 'student',
                    description: 'A student role',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'employee',
                    description: 'An employee role',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'volunteer',
                    description: 'A volunteer role',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'intern',
                    description: 'An intern role',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('role', null);
    },
};
