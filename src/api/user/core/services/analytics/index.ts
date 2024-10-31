import { Department, Project, User } from '@/api/user/core/models';
import { HttpStatus } from '@/core';

export class Analytics {
    constructor(private readonly dbUser: typeof User, private readonly dbProject: typeof Project, private readonly dbDepartment: typeof Department) {}

    handle = async () => {
        const allProjects = await this.dbProject.findAll();
        const allDepartments = await this.dbDepartment.findAll();
        const allUsers = await this.dbUser.findAll();

        return {
            code: HttpStatus.OK,
            message: 'User Deleted Successfully',
            data: {
                projects: allProjects.length,
                departments: allDepartments.length,
                users: allUsers.length,
            },
        };
    };
}
