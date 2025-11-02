
import { Association } from "../../core/entities/association";

export interface IAssociationRepository {
    get(userId: string, placeId: string): Promise<Association | null>;
    getForUser(userId: string): Promise<Association | null>;
    getAllForPlaces(placeIds: Array<string>): Promise<Array<Association>>;
    create(userId: string, placeId: string): Promise<Association>;
    delete(userId: string, placeId: string);
}

export const IAssociationRepository = Symbol("IAssociationRepository");