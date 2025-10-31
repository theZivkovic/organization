import { Place } from "../models/placeModel";
import { UserPlace } from "../models/userPlaceModel";

export async function seedUserPlaces() {
    const mainPlace = await Place.findOne({ left: 1 }).exec();

    if (await UserPlace.exists({ 
        userEmail: process.env.MAIN_MANAGER_EMAIL as string,
        placeName: mainPlace?.name as string,
    }).exec()) {
        return;
    }

    const mainManagerToMainPlace = new UserPlace({
        userEmail: process.env.MAIN_MANAGER_EMAIL as string,
        placeName: mainPlace?.name as string,
    });

    await mainManagerToMainPlace.save();
    console.log(`Added main manager to main place.`);
}
