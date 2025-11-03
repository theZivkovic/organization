
// import { IAssociationsRepository } from 'src/core/interfaces/associationsRepository';
// import { AssociationsUseCases } from './associations.usecases';
// import { PlaceUseCases } from './places.usecases';
// import { Association } from 'src/core/entities/association';


// describe('CatsController', () => {
//   let associationsUsesCases: AssociationsUseCases;
//   let associationsRepository: IAssociationsRepository;
//     let placesUseCases: PlaceUseCases;

//   beforeEach(() => {
//     associationsRepository = {
//         get(userId: string, placeId: string): Promise<Association | null> { return Promise.resolve(null); },
//         getForUser(userId: string): Promise<Association | null> { return Promise.resolve(null); },
//         getAllForPlaces(placeIds: Array<string>): Promise<Array<Association>> { return Promise.resolve([]); },
//         create(userId: string, placeId: string): Promise<Association> { return Promise.resolve({} as Association); },
//         delete(userId: string, placeId: string) { return Promise.resolve(); }
//     }
//     placesUseCases = {

//     }
//     associationsUsesCases = new AssociationsUseCases(associationsRepository, placesUseCases);
//     catsController = new CatsController(catsService);
//   });

//   describe('findAll', () => {
//     it('should return true', async () => {
//       expect(1).toEqual(1);
//     });
//   });
// });
