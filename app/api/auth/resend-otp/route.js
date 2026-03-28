import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { OTP } from "@/models/Otp.model";
import { response, catchError, generateOTP } from "@/lib/helper-function";
import { sendEmail } from "@/lib/send-mail";
import { otpEmail } from "@/email/otpEmail";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return response(false, 400, "Email is required");
        }

        /** Find user */
        const user = await User.findOne({ email });

        if (!user) {
            return response(false, 404, "User not found");
        }

        /** Generate new OTP */
        const otp = generateOTP();

        /** Remove old OTP if exists */
        await OTP.deleteMany({ email });

        /** Save new OTP */
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        /** Send OTP email */
        await sendEmail({
            to: email,
            subject: "Email Verification OTP",
            text: `Your OTP is ${otp}`,
            html: otpEmail(otp),
        });

        return response(true, 200, "OTP sent successfully");

    } catch (error) {
        console.error("Resend OTP error:", error);
        return catchError(error, "Failed to resend OTP");
    }
}
