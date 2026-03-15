import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/jwt";
import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";

export async function POST(req) {
    try {
        const body = await req.json();
        const token = body?.token;

        if (!token) {
            return NextResponse.json(
                { error: "Verification token is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        /** Verify JWT */
        const decoded = await verifyEmailToken(token);

        if (!decoded?.userId) {
            return NextResponse.json(
                { error: "Invalid token payload" },
                { status: 400 }
            );
        }

        /** Find user */
        const user = await User.findOne({
            _id: decoded.userId,
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired verification link" },
                { status: 400 }
            );
        }

        /** If already verified */
        if (user.isVerified) {
            return NextResponse.json(
                { message: "Email already verified" },
                { status: 200 }
            );
        }

        /** Update user */
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Email verification error:", error);

        return NextResponse.json(
            { error: "Verification failed. Please try again." },
            { status: 500 }
        );
    }
}