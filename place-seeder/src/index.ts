import { connect, Mongoose } from 'mongoose';
import { Place } from './models/placeModel';
import placeData from './data/place-data.json';
import { buildPlaceNodesFromData } from './utils/placeConverter';

async function run() {
    let connection: Mongoose | undefined = undefined;
    try {
        const placeNodes = buildPlaceNodesFromData(placeData);

        connection = await connect(process.env.MONGO_URL as string);

        const existingPlaces = await Place.find({ name: { $in: Array.from(placeNodes.keys()) } }).exec();

        const placesToCreate = Array.from(placeNodes.values()).filter(x => !existingPlaces.some(ep => ep.name === x.name));
        const createdPlaces = await Promise.all(placesToCreate.map(async placeToCreate => {
            const newPlace = new Place({ 
                name: placeToCreate.name, 
                type: placeToCreate.type,
                left: placeToCreate.left,
                right: placeToCreate.right });
            await newPlace.save();
            return newPlace;
        }));
        console.log(`Inserted ${createdPlaces.length} new places.`);
    } catch (error) {
        console.error('MongoDB connection or operation error:', error);
    } finally {
        await connection?.disconnect();
    }
}

run()
    .then(() => console.log('Seeding completed'))
    .catch((error) => console.error('Seeding error:', error));