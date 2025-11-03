import { IPlacesRepository } from "../../src/core/interfaces/placesRepository";
import { Place } from "../../src/core/entities/place";

export class MockPlacesRepository implements IPlacesRepository {

    private places: Array<Place>;
    constructor(places: Array<Place>) {
        this.places = places;
    }
    getById(id: string): Promise<Place | null> {
        return Promise.resolve(this.places.find(x => x.id === id) ?? null);
    }
    getAllDescendants(placeLeft: number, placeRight: number): Promise<Place[]> {
        return Promise.resolve(this.places.filter(x => x.left > placeLeft && x.right < placeRight));
    }
    async getPlaceAmongDescendants(placeLeft: number, placeRight: number, placeToGetId: string) {
        const allDescendants = await this.getAllDescendants(placeLeft, placeRight);
        return Promise.resolve(allDescendants.find(x => x.id === placeToGetId) ?? null);
    }
}