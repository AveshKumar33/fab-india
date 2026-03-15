import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateEmailVerificationToken(userId) {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
}

export async function verifyEmailToken(token) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
}