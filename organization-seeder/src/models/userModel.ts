import { model, Schema } from "mongoose";

interface IUser extends Document {
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string;
}

const placeSchema = new Schema<IUser>({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
});

const User = model<IUser>('User', placeSchema);

export { User };    
export type { IUser };

