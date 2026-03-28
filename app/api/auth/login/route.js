import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { OTP } from "@/models/Otp.model";
import { loginSchema } from "@/lib/zod-schemas";
import { sendEmail } from "@/lib/send-mail";
import { response, catchError, generateOTP } from "@/lib/helper-function";
import { otpEmail } from "@/email/otpEmail";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();

        /** Validate request */
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return response(false, 400, "Validation failed", {
                errors: parsed.error.errors,
            });
        }

        const { email, password } = parsed.data;

        /** Find user */
        const user = await User.findOne({ email });

        if (!user) {
            return response(false, 401, "Invalid email or password");
        }
        console.log('user avesh', user);

        /** Check password */
        console.log("Entered password:", password);
        console.log("Stored password:", user.password);

        const isMatch = await user.comparePassword(password);

        console.log("Password match:", isMatch);

        if (!isMatch) {
            return response(false, 401, "Invalid email or password");
        }

        /** If email not verified → send OTP */
        if (!user.isEmailVerified) {
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

            return response(
                false,
                403,
                "Email not verified. OTP sent to your email."
            );
        }

        /** TODO: Generate JWT token */
        // const token = generateAuthToken(user);

        /** Login success */
        return response(true, 200, "Login successful", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        return catchError(error, "Login failed");
    }
}