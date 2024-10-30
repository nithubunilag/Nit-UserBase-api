import { Department, EmploymentTimeline, Role, User } from '../models';
import { CreateUser } from './create-user';
import { DeleteUser } from './delete-user';
import { DepartmentService } from './department-service';
import { PromoteUser } from './promote-user';
import { RetrieveUser } from './retrieve-user';
import { RoleService } from './role-service';
import { UpdateUser } from './update-user';

export const deleteUserHandler = new DeleteUser(User);
export const roleServiceHandler = new RoleService(Role);
export const retrieveUserHandler = new RetrieveUser(User, EmploymentTimeline);
export const createUserHandler = new CreateUser(User, Role);
export const updateUserHandler = new UpdateUser(User, Role);
export const departmentService = new DepartmentService(Department);
export const promoteUserHandler = new PromoteUser(User, EmploymentTimeline, Role, Department);
