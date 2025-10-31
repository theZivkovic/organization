import { model, Schema } from "mongoose";

enum UserRole {
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

interface IUser extends Document {
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string;
    passwordSalt: string,
    role: UserRole
}

const placeSchema = new Schema<IUser>({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: UserRole, default: UserRole.EMPLOYEE }
});

const User = model<IUser>('User', placeSchema);

export { User, UserRole };    
export type { IUser };

