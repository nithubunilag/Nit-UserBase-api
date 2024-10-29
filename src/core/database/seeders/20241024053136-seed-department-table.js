'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'department',
            [
                {
                    id: uuidv4(),
                    name: 'Frontend Development',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Backend Development',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'UI/UX Design',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Development Operations',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Data Science',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Quality Assurance',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Mobile Development',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Machine Learning',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Cloud Engineering',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Cybersecurity',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Content Department',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: 'Marketing Department',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('department', null);
    },
};
