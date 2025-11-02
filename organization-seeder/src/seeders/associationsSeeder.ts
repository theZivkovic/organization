import { User } from "../models/userModel";
import { Place } from "../models/placeModel";
import { Association } from "../models/associationModel";

export async function seedAssociations() {
    const mainPlace = await Place.findOne({ name: 'Srbija' }).exec();
    const mainManager = await User.findOne({ email: process.env.MAIN_MANAGER_EMAIL as string}).exec();

    if (!mainPlace){
        throw new Error('missing place with name: Srbija to seed userPlaces');
    }

    if (!mainManager){
        throw new Error(`missing user with email: ${process.env.MAIN_MANAGER_EMAIL} to seed userPlaces`);
    }

    if (await Association.exists({ 
        userId: mainManager.id,
        placeId: mainPlace.id
    }).exec()) {
        return;
    }

    const mainAssociation = new Association({
        userId: mainManager.id,
        placeId: mainPlace.id
    });

    await mainAssociation.save();
    console.log(`Added main manager to main place.`);
}
