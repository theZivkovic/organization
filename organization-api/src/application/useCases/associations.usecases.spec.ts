
import { IAssociationsRepository } from '../../core/interfaces/associationsRepository';
import { AssociationsUseCases } from './associations.usecases';
import { IPlacesRepository } from '../../core/interfaces/placesRepository';
import { MockAssociationsRepository } from '../../../test/mockInterfaces/mockAssociationsRepository';
import { MockPlacesRepository } from '../../../test/mockInterfaces/mockPlacesRepository';
import { PlaceType } from '../../core/enums/placeType';
import { IUsersRepository } from '../../core/interfaces/usersRepository';
import { MockUsersRepository } from '../../../test/mockInterfaces/mockUsersRepository';
import { UserRole } from '../../core/enums/userRole';

describe('Associations Use Cases', () => {

    let associationsUsesCases: AssociationsUseCases;
    let associationsRepository: IAssociationsRepository;
    let usersRepository: IUsersRepository;
    let placesRepository: IPlacesRepository;

    beforeEach(() => {
        associationsRepository = new MockAssociationsRepository([
            { userId: 'userA', placeId: 'placeA'},
            { userId: 'userD', placeId: 'placeX' },
            { userId: 'userE', placeId: 'placeB' }
        ]);

        /* (left, right) indexes represent the entering and exiting index of a round-trip traversal of the tree
        * more info here: https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-nested-sets/
        *   A(1,2)
        *   ├─ B(2,5)
        *   |  └─ D(3,4)    
        *   ├─ C(6,7)
        */

        placesRepository = new MockPlacesRepository([
            { id: 'placeA', name: 'A', type: PlaceType.OFFICE, left: 1, right: 8 },
            { id: 'placeB', name: 'B', type: PlaceType.OFFICE, left: 2, right: 5 },
            { id: 'placeC', name: 'C', type: PlaceType.STORE, left: 6, right: 7 },
            { id: 'placeD', name: 'D', type: PlaceType.STORE, left: 3, right: 4 },
        ]);

        usersRepository = new MockUsersRepository([
            { id: 'userA', role: UserRole.MANAGER, firstName: 'A', lastName: 'A', email: 'a@example.com', passwordHash: '', passwordSalt: ''},
            { id: 'userB', role: UserRole.EMPLOYEE, firstName: 'B', lastName: 'B', email: 'b@example.com', passwordHash: '', passwordSalt: ''},
            { id: 'userC', role: UserRole.MANAGER, firstName: 'C', lastName: 'C', email: 'c@example.com', passwordHash: '', passwordSalt: ''},
            { id: 'userD', role: UserRole.MANAGER, firstName: 'C', lastName: 'C', email: 'c@example.com', passwordHash: '', passwordSalt: ''},
            { id: 'userE', role: UserRole.MANAGER, firstName: 'E', lastName: 'E', email: 'e@example.com', passwordHash: '', passwordSalt: ''}
        ]);
        associationsUsesCases = new AssociationsUseCases(associationsRepository, placesRepository, usersRepository);
    });

    it('should throw an error if userToAdd is not found', async () => {
        await expect(() => associationsUsesCases.addUserToAPlace('userA', 'userX', 'placeA'))
            .rejects
            .toThrow('User to add: userX not found');
        
    });

    it('should throw an error if managingUserId is not found', async () => {
        await expect(() => associationsUsesCases.addUserToAPlace('userX', 'userB', 'placeA'))
            .rejects
            .toThrow('Managing user: userX not found');
        
    });

    it('should throw an error if managingUserId is not associated to any place', async () => {
        await expect(() => associationsUsesCases.addUserToAPlace('userC', 'userB', 'placeA'))
            .rejects
            .toThrow('Managing user: userC is not assigned to any place');
    });

    it('should throw an error if managingUserId is associated to a place that does not exist', async () => {
        await expect(() => associationsUsesCases.addUserToAPlace('userD', 'userB', 'placeA'))
            .rejects
            .toThrow('Place: placeX not found');
    });

    it('should throw an error if managingUserId is not allowed to see the place', async () => {
        await expect(() => associationsUsesCases.addUserToAPlace('userE', 'userB', 'placeA'))
            .rejects
            .toThrow('Managing user is not allowed to add users to this place');
    });

    it('should throw an error if userToAdd is already present in another place', async () => {
        await expect(() => associationsUsesCases.addUserToAPlace('userA', 'userE', 'placeA'))
            .rejects
            .toThrow('User already works at place: placeB, please unnasign them first');
    });

    it('should allow a user to add user to a place it can see', async () => {
        return associationsUsesCases.addUserToAPlace('userE', 'userB', 'placeB').then(data => {
            expect(data).toBeTruthy();
        });
    });
});
