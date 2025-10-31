import { model, Schema } from "mongoose";


interface IUserPlace extends Document {
    userEmail: string,
    placeName: string;
}

const userPlaceSchema = new Schema<IUserPlace>({
    userEmail: { type: String, required: true },
    placeName: { type: String, required: true }
});

const UserPlace = model<IUserPlace>('UserPlace', userPlaceSchema);

export { UserPlace };    
export type { IUserPlace };

