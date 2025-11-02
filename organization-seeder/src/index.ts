import { connect, Mongoose } from 'mongoose';

import { seedPlaces } from './seeders/placeSeeder';
import { seedUsers } from './seeders/userSeeder';
import { seedAssociations } from './seeders/associationsSeeder';

async function run() {
    let connection: Mongoose | undefined = undefined;
    try {
        connection = await connect(process.env.MONGO_URL as string);
        await Promise.all([
            seedPlaces(),
            seedUsers()
        ]);
        await seedAssociations();
    } catch (error) {
        console.error('MongoDB connection or operation error:', error);
    } finally {
        await connection?.disconnect();
    }
}

run()
    .then(() => console.log('Seeding completed'))
    .catch((error) => console.error('Seeding error:', error));