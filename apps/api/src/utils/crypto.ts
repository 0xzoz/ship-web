import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
