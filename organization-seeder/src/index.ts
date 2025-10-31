import { connect, Mongoose } from 'mongoose';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Place } from './models/placeModel';
import placeData from './data/place-data.json';
import { buildPlacesFromData } from './utils/placeConverter';
import { User, UserRole } from './models/userModel';
import { UserPlace } from './models/userPlaceModel';

const scryptAsync = promisify(scrypt);

async function seedPlaces() {
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

async function seedUsers() {
    const { salt, hash } = await generateSaltAndHash(process.env.MAIN_MANAGER_RAW_PASSWORD as string);

    const mainManager = new User({
        email: process.env.MAIN_MANAGER_EMAIL as string,
        passwordHash: hash,
        passwordSalt: salt,
        firstName: process.env.MAIN_MANAGER_FIRST_NAME as string,
        lastName: process.env.MAIN_MANAGER_LAST_NAME as string,
        role: UserRole.MANAGER
    });
    await mainManager.save();
    console.log(`Inserted main manager.`);
}

async function seedUserPlaces() {
    const mainPlace = await Place.findOne({ left: 1 }).exec();

    const mainManagerToMainPlace = new UserPlace({
        userEmail: process.env.MAIN_MANAGER_EMAIL as string,
        placeName: mainPlace?.name as string,
    });

    await mainManagerToMainPlace.save();
    console.log(`Added main manager to main place.`);
}

async function generateSaltAndHash(rawPassword: string): Promise<{ salt: string, hash: string }>{
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(rawPassword, salt, 64)) as Buffer;
    const hash = `${buf.toString("hex")}`;
    return { salt, hash };
}

async function run() {
    let connection: Mongoose | undefined = undefined;
    try {
        connection = await connect(process.env.MONGO_URL as string);
        await Promise.all([
            seedPlaces(),
            seedUsers()
        ]);
        await seedUserPlaces();
    } catch (error) {
        console.error('MongoDB connection or operation error:', error);
    } finally {
        await connection?.disconnect();
    }
}

run()
    .then(() => console.log('Seeding completed'))
    .catch((error) => console.error('Seeding error:', error));