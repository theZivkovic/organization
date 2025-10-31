import { User, UserRole } from "../models/userModel";
import { generateSaltAndHash } from "../utils/passwordHelper";

export async function seedUsers() {
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