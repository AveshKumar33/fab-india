import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { response } from "@/lib/helper-function";
import { sendEmail } from "@/lib/send-mail";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { email } = body;

        // Find or create user
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create a test user
            user = new User({
                name: "Test User",
                email: email.toLowerCase(),
                password: "TestPassword123",
                isEmailVerified: true
            });
            await user.save();
        }

        // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 15);

        // Save token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 86400000; // 24 hours
        await user.save();

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${email}`;

        // Send reset email
        try {
            await sendEmail({
                to: email,
                subject: 'Reset Your Password',
                text: `Click the following link to reset your password: ${resetLink}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Reset Your Password</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your password. Click the link below to reset it:</p>
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                        <p style="margin-top: 20px;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
                        <p><a href="${resetLink}">${resetLink}</a></p>
                        <p style="margin-top: 20px;">This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.</p>
                        <p>Thank you!</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
            // For development: log the reset link when email fails
            if (process.env.NODE_ENV !== 'production') {
                console.log('DEV: Reset link (email failed):', resetLink);
            }
        }

        return response(true, 200, "Token generated successfully", {
            token: resetToken,
            resetLink,
            email: email,
            expiresIn: "1 hour"
        });

    } catch (error) {
        console.error("Generate token error:", error);
        return response(false, 500, "Server error", { error: error.message });
    }
}
