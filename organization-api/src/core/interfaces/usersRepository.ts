import { User } from "src/core/entities/user";
import { UserRole } from "src/core/enums/userRole";
import { UserWithCredentials } from "../entities/userWithCredentials";

export interface IUsersRepository {
    getByEmail(email: string): Promise<User | null>;
    getByEmailWithCredentials(email: string): Promise<UserWithCredentials | null>;
    getById(id: string): Promise<User | null>;
    getAllByIds(ids: Array<string>): Promise<Array<User>>;
    getAllByIdsWithRole(ids: Array<string>, role: UserRole): Promise<Array<User>>;
    create(request: Partial<User>): Promise<User>;
    update(id: string, request: Partial<UserWithCredentials>): Promise<User>
}

export const IUsersRepository = Symbol("IUserRepository");