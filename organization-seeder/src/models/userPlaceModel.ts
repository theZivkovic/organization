import { model, Schema } from "mongoose";

interface IUserPlace extends Document {
    userId: string,
    placeId: string;
}

const userPlaceSchema = new Schema<IUserPlace>({
    userId: { type: String, required: true },
    placeId: { type: String, required: true }
});

const UserPlace = model<IUserPlace>('UserPlace', userPlaceSchema);

export { UserPlace };    
export type { IUserPlace };

