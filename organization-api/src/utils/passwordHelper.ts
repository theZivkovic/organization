import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function comparePassword(
    storedPasswordHash: string,
    storedPasswordSalt: string,
    rawPassword: string
  ): Promise<boolean> {
    const hashedPasswordBuf = Buffer.from(storedPasswordHash, "hex");
    const suppliedPasswordBuf = (await scryptAsync(rawPassword, storedPasswordSalt, 64)) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  }