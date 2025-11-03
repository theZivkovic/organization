import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User } from "./user";

const scryptAsync = promisify(scrypt);

export interface UserWithCredentials extends User {
    passwordHash: string;
    passwordSalt: string;
}

export async function generateSaltAndHash(rawPassword: string): Promise<{ salt: string, hash: string }>{
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(rawPassword, salt, 64)) as Buffer;
    const hash = `${buf.toString("hex")}`;
    return { salt, hash };
}

export async function comparePassword(
    storedPasswordHash: string,
    storedPasswordSalt: string,
    rawPassword: string
  ): Promise<boolean> {
    const hashedPasswordBuf = Buffer.from(storedPasswordHash, "hex");
    const suppliedPasswordBuf = (await scryptAsync(rawPassword, storedPasswordSalt, 64)) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}