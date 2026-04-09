import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { resetPasswordSchema } from "@/lib/zod-schemas";
import { response, catchError } from "@/lib/helper-function";
import { sendEmail } from "@/lib/send-mail";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { token, password, email } = body;

        const parsed = resetPasswordSchema.safeParse({ password, confirmPassword: password });
        if (!parsed.success) {
            return response(false, 400, "Invalid password format", { errors: parsed.error.errors });
        }

        /** Find user by reset token and verify email */
        const user = await User.findOne({
            email: email.toLowerCase(),
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return response(false, 400, "Invalid or expired token");
        }

        /** Check if email is verified */
        if (!user.isEmailVerified) {
            return response(false, 400, "Please verify your email first");
        }

        /** Update password */
        user.password = password;

        // Clear old reset token
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        // Send password reset notification email
        try {
            await sendEmail({
                to: email,
                subject: 'Your Password Has Been Reset',
                text: `Your password has been successfully reset. If you didn't make this change, please contact support immediately.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Password Reset Successful</h2>
                        <p>Hello,</p>
                        <p>Your password has been successfully reset for your account.</p>
                        <p>If you didn't make this change, please contact support immediately.</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 10px 0 0 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <p>Thank you!</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send password reset notification:', emailError);
            // Continue even if email fails
        }

        return response(true, 200, "Password reset successfully");

    } catch (error) {
        console.error("Reset password error:", error);
        return catchError(error, "Password reset failed");
    }
}
