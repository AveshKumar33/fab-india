import connectDB from "@/lib/mongoose";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/zod-schemas";
import { generateEmailVerificationToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/send-email";
import { emailVerificationLink } from "@/lib/email-templates";

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();

        /** Validate request */
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.errors,
                }),
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        /** Find user */
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid email or password",
                }),
                { status: 401 }
            );
        }

        /** Check password */
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid email or password",
                }),
                { status: 401 }
            );
        }

        /** If email not verified */
        if (!user.isEmailVerified) {
            const token = await generateEmailVerificationToken(user._id.toString());

            user.emailVerificationToken = token;
            user.emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000);

            await user.save();

            const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

            await sendEmail({
                to: user.email,
                subject: "Verify your email",
                text: `Verify your email: ${verifyLink}`,
                html: emailVerificationLink(verifyLink),
            });

            return new Response(
                JSON.stringify({
                    success: false,
                    message:
                        "Email not verified. A new verification link has been sent to your email.",
                }),
                { status: 403 }
            );
        }

        /** TODO: Generate JWT token here (recommended) */
        // const token = generateAuthToken(user);

        /** Login success */
        return new Response(
            JSON.stringify({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            }),
            { status: 200 }
        );

    } catch (err) {
        console.error("Login error:", err);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Server error",
            }),
            { status: 500 }
        );
    }
}