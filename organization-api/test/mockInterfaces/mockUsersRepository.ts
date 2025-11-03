import { UserWithCredentials } from "../../src/core/entities/userWithCredentials";
import { UserRole } from "../../src/core/enums/userRole";
import { User } from "../../src/core/entities/user";
import { IUsersRepository } from "../../src/core/interfaces/usersRepository";
import { NotImplementedException } from "@nestjs/common";

export class MockUsersRepository implements IUsersRepository {

    private users: Array<UserWithCredentials>;
    constructor(users: Array<UserWithCredentials>) {
        this.users = users;
    }
    getByEmail(email: string): Promise<User | null> {
        return Promise.resolve(this.users.find(x => x.email === email) ?? null);
    }
    getByEmailWithCredentials(email: string): Promise<UserWithCredentials | null> {
        return Promise.resolve(this.users.find(x => x.email === email) ?? null);
    }
    getById(id: string): Promise<User | null> {
        return Promise.resolve(this.users.find(x => x.id === id) ?? null);
    }
    getAllByIds(ids: Array<string>): Promise<Array<User>> {
        return Promise.resolve(this.users.filter(x => ids.includes(x.id)));
    }
    getAllByIdsWithRole(ids: Array<string>, role: UserRole): Promise<Array<User>> {
        return Promise.resolve(this.users.filter(x => ids.includes(x.id) && x.role === role));
    }
    create(request: Partial<User>): Promise<User> {
        throw new NotImplementedException();
    }
    update(id: string, request: Partial<UserWithCredentials>): Promise<User> {
        throw new NotImplementedException();
    }

    
    
}