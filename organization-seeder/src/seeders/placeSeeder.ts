import { Place } from 'src/models/placeModel';
import placeData from '../data/place-data.json';
import { buildPlacesFromData } from '../utils/placeConverter';

export async function seedPlaces() {
    const placeNodes = buildPlacesFromData(placeData);
    const existingPlaces = await Place.find({ name: { $in: Array.from(placeNodes.keys()) } }).exec();

    const placesToCreate = Array.from(placeNodes.values()).filter(x => !existingPlaces.some(ep => ep.name === x.name));
    const createdPlaces = await Promise.all(placesToCreate.map(async placeToCreate => {
        const newPlace = new Place({
            name: placeToCreate.name,
            type: placeToCreate.type,
            left: placeToCreate.left,
            right: placeToCreate.right
        });
        await newPlace.save();
        return newPlace;
    }));
    console.log(`Inserted ${createdPlaces.length} new places.`);
}