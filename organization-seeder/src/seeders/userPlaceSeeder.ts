import { User } from "../models/userModel";
import { Place } from "../models/placeModel";
import { UserPlace } from "../models/userPlaceModel";

export async function seedUserPlaces() {
    const mainPlace = await Place.findOne({ name: 'Srbija' }).exec();
    const mainManager = await User.findOne({ email: process.env.MAIN_MANAGER_EMAIL as string}).exec();

    console.log('!!!', mainManager, mainPlace);
    if (!mainPlace){
        throw new Error('missing place with name: Srbija to seed userPlaces');
    }

    if (!mainManager){
        throw new Error(`missing user with email: ${process.env.MAIN_MANAGER_EMAIL} to seed userPlaces`);
    }

    if (await UserPlace.exists({ 
        userId: mainManager.id,
        placeId: mainPlace.id
    }).exec()) {
        return;
    }

    const mainManagerToMainPlace = new UserPlace({
        userId: mainManager.id,
        placeId: mainPlace.id
    });

    await mainManagerToMainPlace.save();
    console.log(`Added main manager to main place.`);
}
