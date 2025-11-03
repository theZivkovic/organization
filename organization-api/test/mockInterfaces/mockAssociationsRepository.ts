import { Association } from "../../src/core/entities/association";
import { IAssociationsRepository } from "../../src/core/interfaces/associationsRepository";

export class MockAssociationsRepository implements IAssociationsRepository {

    private associations: Array<Association>;
    constructor(associations: Array<Association>) {
        this.associations = associations;
    }

    get(userId: string, placeId: string): Promise<Association | null> {
        return Promise.resolve(this.associations.find(x => x.userId === userId && x.placeId === placeId) ?? null);
    }
    getForUser(userId: string): Promise<Association | null> {
        return Promise.resolve(this.associations.find(x => x.userId === userId) ?? null);
    }
    getAllForPlaces(placeIds: Array<string>): Promise<Array<Association>> {
        return Promise.resolve(this.associations.filter(x => placeIds.includes(x.placeId)));
    }
    create(userId: string, placeId: string): Promise<Association> {
        const newAssoc = { userId, placeId};
        this.associations.push(newAssoc);
        return Promise.resolve(newAssoc);
    }
    delete(userId: string, placeId: string) {
        const index = this.associations.indexOf({ userId, placeId });
        this.associations.splice(index, 1);
        return Promise.resolve();
    }

}