import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAssociationRepository } from "../interfaces/associationRepository";
import { IPlaceRepository } from "../interfaces/placeRepository";
import { IUserRepository } from "../interfaces/userRepository";
import { Place } from "src/core/entities/place";
import { UserRole } from "src/core/enums/userRole";

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
            throw new NotFoundException(`Place: ${userAssociation.placeId} not found`)
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

    async getPlacesUsersVisibleByUser(userId: string, roleFilter: UserRole): Promise<Array<Place>>{
        const userAssociation = await this.associationRepository.getForUser(userId);

        if (!userAssociation){
            throw new NotFoundException(`No associations found for user: ${userId}`)
        }

        const place = await this.placeRepository.getById(userAssociation.placeId);

        if (!place) {
            throw new NotFoundException(`Place: ${userAssociation.placeId} not found`)
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place.left, place.right);
        const places = [...placeDescendants, place];

        const associations = await this.associationRepository.getAllForPlaces(places.map(x => x.id));

        const users = await this.userRepository.getAllByIdsWithRole(associations.map(x => x.userId), roleFilter);

        return users; 
    }

    async getPlaceVisibleByUser(userId: string, placeToGetId: string): Promise<Place | null>{
        const userAssociation = await this.associationRepository.getForUser(userId);

        if (!userAssociation){
            throw new NotFoundException(`No associations found for user: ${userId}`)
        }

        const place = await this.placeRepository.getById(userAssociation.placeId);

        if (!place) {
            throw new NotFoundException(`Place: ${userAssociation.placeId} not found`)
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place.left, place.right);
        const places = [...placeDescendants, place];

        if (!places.some(x => x.id === placeToGetId)){
            throw new NotFoundException(`Place: ${placeToGetId} not found`);
        }

        const placeToGet = await this.placeRepository.getById(placeToGetId);

        if (!placeToGet){
            throw new NotFoundException(`Place: ${placeToGet} not found`);
        }

        const associations = await this.associationRepository.getAllForPlaces([placeToGet.id]);
        const users = await this.userRepository.getAllByIds(associations.map(x => x.userId));

        return {
            ...placeToGet,
            users: associations
                .filter(ass => ass.placeId === placeToGet.id)
                .flatMap(ass => users.filter(u => u.id === ass.userId))
        };
    }

    async getPlaceUsersVisibleByUser(userId: string, placeToGetId: string, roleFilter: UserRole): Promise<Array<Place>>{
        const userAssociation = await this.associationRepository.getForUser(userId);

        if (!userAssociation){
            throw new NotFoundException(`No associations found for user: ${userId}`)
        }

        const place = await this.placeRepository.getById(userAssociation.placeId);

        if (!place) {
            throw new NotFoundException(`Place: ${userAssociation.placeId} not found`)
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place.left, place.right);
        const places = [...placeDescendants, place];

        if (!places.some(x => x.id === placeToGetId)){
            throw new NotFoundException(`Place: ${placeToGetId} not found`);
        }

        const placeToGet = await this.placeRepository.getById(placeToGetId);

        if (!placeToGet){
            throw new NotFoundException(`Place: ${placeToGet} not found`);
        }

        const associations = await this.associationRepository.getAllForPlaces([placeToGet.id]);
        const users = await this.userRepository.getAllByIdsWithRole(associations.map(x => x.userId), roleFilter);

        return users;
    }
}

