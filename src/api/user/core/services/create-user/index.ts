import { CreateUserPayload, CreateUsersFromCSVPayload, UserPayload } from '@/api/user/core/interfaces';
import { Role, User } from '@/api/user/core/models';
import { userValidationSchema } from '@/api/user/core/router/schema';
import { BadRequestError, ConflictError, ControllerArgs, HttpStatus, logger, sequelize } from '@/core';
import csvToJson from 'convert-csv-to-json';

export class CreateUser {
    constructor(private readonly dbUser: typeof User, private readonly dbRole: typeof Role) {}

    handle = async ({ input }: ControllerArgs<CreateUserPayload>) => {
        if (!input) throw new BadRequestError('Invalid input data');

        const users = Array.isArray(input) ? input : [input];

        for (const user of users) {
            const { emailAddress, roleId } = user;

            if (!emailAddress) throw new BadRequestError('Email address is required');

            if (!roleId) throw new BadRequestError('Role ID is required');

            // Check if email address is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailAddress)) throw new BadRequestError('Invalid email address format');

            const existingUser = await this.dbUser.findOne({
                where: {
                    emailAddress,
                },
            });

            if (existingUser) throw new ConflictError('User with this email already exists');

            const role = await this.dbRole.findOne({
                where: {
                    id: roleId,
                },
            });

            if (!role) throw new BadRequestError('Invalid Role!');

            const newUser = await this.dbUser.create(user);

            logger.info('User Created Successfully');

            if (!Array.isArray(input)) {
                return {
                    data: newUser,
                    code: HttpStatus.CREATED,
                    message: 'User Created Successfully',
                };
            }
        }

        return {
            data: users,
            code: HttpStatus.CREATED,
            message: 'Users Created Successfully',
        };
    };

    handleCSV = async ({ files, query }: ControllerArgs<CreateUsersFromCSVPayload>) => {
        if (!query || !files.csv || Array.isArray(files.csv)) {
            throw new BadRequestError('Invalid input data');
        }

        const { roleId } = query;

        if (!roleId) {
            throw new BadRequestError('Role ID is required');
        }

        const role = await this.dbRole.findOne({ where: { id: roleId } });

        if (!role) {
            throw new BadRequestError('Invalid Role!');
        }

        let users: UserPayload[];

        try {
            users = csvToJson.fieldDelimiter(',').getJsonFromCsv(files.csv.tempFilePath);
        } catch (error: any) {
            throw new BadRequestError('Error parsing CSV file');
        }

        const createdUsers: User[] = [];
        const transaction = await sequelize.transaction();

        try {
            for (const user of users) {
                const { error, value } = userValidationSchema.validate(user);

                if (error) {
                    throw new BadRequestError(`Invalid User Data: ${error.message}`);
                }

                const existingUser = await this.dbUser.findOne({
                    where: { emailAddress: value.emailAddress },
                });

                if (existingUser) {
                    // throw new ConflictError(`User with Email ${existingUser.emailAddress} already exists`);
                    logger.info(`User with Email ${existingUser.emailAddress} already exists`);
                    continue;
                }

                const newUser = await this.dbUser.create(value, { transaction });
                logger.info(`User with ID ${newUser.emailAddress} created successfully`);
                createdUsers.push(newUser);
            }

            await transaction.commit();

            return {
                data: createdUsers,
                code: HttpStatus.CREATED,
                message: 'Users Created Successfully',
            };
        } catch (error: any) {
            transaction.rollback();

            logger.error(error?.message);

            throw new Error(error?.message ?? 'Internal Server Error');
        }
    };
}
