import { User } from "src/core/entities/user";
import { UserRole } from "src/core/enums/userRole";

export interface IUserRepository {
    getByEmail(email: string): Promise<User | null>;
    getById(id: string): Promise<User | null>;
    getAllByIds(ids: Array<string>): Promise<Array<User>>;
    getAllByIdsWithRole(ids: Array<string>, role: UserRole): Promise<Array<User>>;
    create(request: Partial<User>): Promise<User>;
    update(id: string, request: Partial<User>): Promise<User>
}

export const IUserRepository = Symbol("IPlaceRepository");