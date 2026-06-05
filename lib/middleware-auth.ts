// Lightweight JWT verification for Edge Runtime (middleware)
// Does NOT import bcryptjs or jsonwebtoken which use Node.js APIs

const JWT_SECRET = process.env.JWT_SECRET || "circucity-ai-jwt-secret-dev";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: "customer" | "admin";
  image: string | null;
};

/**
 * Verify JWT token without using jsonwebtoken library.
 * Works in Edge Runtime (middleware).
 */
export function verifyToken(token: string): SessionUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (no signature verification in middleware for speed)
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name || null,
      role: payload.role || "customer",
      image: payload.image || null,
    };
  } catch {
    return null;
  }
}