'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const password = process.env.DEFAULT_SYSTEM_ADMIN_PASSWORD;

        if (!password) {
            throw new Error('SYSADMIN_PASSWORD environment variable is not set');
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        // await queryInterface.bulkInsert(
        //     'auth',
        //     [
        //         {
        //             id: uuidv4(),
        //             emailAddress: 'davidokunoye003@gmail.com',
        //             password: hashedPassword,
        //             provider: "local",
        //             createdAt: new Date(),
        //             updatedAt: new Date(),
        //         },
        //     ],
        //     {},
        // );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('auth', null);
    },
};
