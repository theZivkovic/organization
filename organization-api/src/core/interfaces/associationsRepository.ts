
import { Association } from "../entities/association";

export interface IAssociationsRepository {
    get(userId: string, placeId: string): Promise<Association | null>;
    getForUser(userId: string): Promise<Association | null>;
    getAllForPlaces(placeIds: Array<string>): Promise<Array<Association>>;
    create(userId: string, placeId: string): Promise<Association>;
    delete(userId: string, placeId: string);
}

export const IAssociationsRepository = Symbol("IAssociationsRepository");