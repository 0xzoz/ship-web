import bcrypt from "bcrypt";
import crypto from "node:crypto";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
