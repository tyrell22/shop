// lib/config.ts
export const jwtConfig = {
  get secret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    return secret;
  },
  expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  cookieName: "auth_token",
  cookieOptions: {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    sameSite: "lax" as const,
  }
};
