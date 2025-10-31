
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function generateSaltAndHash(rawPassword: string): Promise<{ salt: string, hash: string }>{
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(rawPassword, salt, 64)) as Buffer;
    const hash = `${buf.toString("hex")}`;
    return { salt, hash };
}