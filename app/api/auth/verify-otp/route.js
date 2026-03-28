import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { OTP } from "@/models/Otp.model";
import { otpSchema } from "@/lib/zod-schemas";
import { response, catchError } from "@/lib/helper-function";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();

        /** Validate request */
        const parsed = otpSchema.safeParse(body);
        if (!parsed.success) {
            return response(false, 400, "Validation failed", {
                errors: parsed.error.errors,
            });
        }

        const { email, otp } = parsed.data;

        /** Find valid OTP */
        const otpRecord = await OTP.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            return response(false, 400, "Invalid or expired OTP");
        }

        /** Find user */
        const user = await User.findOne({ email });

        if (!user) {
            return response(false, 404, "User not found");
        }

        /** Update user email verification status */
        user.isEmailVerified = true;
        await user.save();

        /** Delete used OTP */
        await OTP.deleteOne({ _id: otpRecord._id });

        /** Generate JWT token */
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        /** Set cookie */
        const cookie = serialize("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response(true, 200, "Email verified successfully", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, cookie);

    } catch (error) {
        console.error("OTP verification error:", error);
        return catchError(error, "OTP verification failed");
    }
}
