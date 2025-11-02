import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAssociationRepository } from "../interfaces/associationRepository";
import { IPlaceRepository } from "../interfaces/placeRepository";
import { IUserRepository } from "../interfaces/userRepository";
import { Place } from "src/core/entities/place";

@Injectable()
export class PlaceCases {

    constructor (
        @Inject(IPlaceRepository) private readonly placeRepository: IPlaceRepository, 
        @Inject(IAssociationRepository) private readonly associationRepository: IAssociationRepository, 
        @Inject(IUserRepository) private readonly userRepository: IUserRepository, ) {
    }

    async getPlacesVisibleByUser(userId: string): Promise<Array<Place>>{
        const userAssociation = await this.associationRepository.getForUser(userId);

        if (!userAssociation){
            throw new NotFoundException(`No associations found for user: ${userId}`)
        }

        const place = await this.placeRepository.getById(userAssociation.placeId);

        if (!place){
            return [];
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place.left, place.right);
        const places = [...placeDescendants, place];

        const associations = await this.associationRepository.getAllForPlaces(places.map(x => x.id));

        const users = await this.userRepository.getAllByIds(associations.map(x => x.userId));

        return places.map(place => ({
            ...place,
            users: associations
                .filter(ass => ass.placeId === place.id)
                .flatMap(ass => users.filter(u => u.id === ass.userId))
        })); 
    }

    getPlaceVisibleByUser(userId: string, placeId: string): Promise<Place | null>{
        return Promise.resolve({} as Place);
    }
}

