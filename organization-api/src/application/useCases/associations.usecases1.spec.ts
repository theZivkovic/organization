
import { IAssociationsRepository } from '../../core/interfaces/associationsRepository';
import { AssociationsUseCases } from './associations.usecases';
import { Association } from '../../core/entities/association';
import { IPlacesRepository } from '../../core/interfaces/placesRepository';
import { Place } from '../../core/entities/place';

describe('CatsController', () => {
    let associationsUsesCases: AssociationsUseCases;
    let associationsRepository: IAssociationsRepository;
    let placesRepository: IPlacesRepository;
    beforeEach(() => {
        associationsRepository = {
            get(userId: string, placeId: string) { return Promise.resolve(null); },
            getForUser(userId: string) { return Promise.resolve(null); },
            getAllForPlaces(placeIds: Array<string>) { return Promise.resolve([]); },
            create(userId: string, placeId: string) { return Promise.resolve({} as Association); },
            delete(userId: string, placeId: string) { return Promise.resolve(); }
        };
        placesRepository = {
            getById(id: string): Promise<Place | null> { return Promise.resolve(null); },
            getAllDescendants(placeLeft: number, placeRight: number) { return Promise.resolve([]) },
            getPlaceAmongDescendants(placeLeft: number, placeRight: number, placeToGetId: string) { return Promise.resolve(null) }
        }
        associationsUsesCases = new AssociationsUseCases(associationsRepository, placesRepository);
    });

    describe('findAll', () => {
        it('should return true', async () => {
            await expect(() => associationsUsesCases.addUserToAPlace('aa', 'bb', 'cc'))
                .rejects
                .toThrow('Managing user is not assigned to any place');
            
        });
    });
});
