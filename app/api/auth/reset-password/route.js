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
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return response(true, 200, "Password reset successfully");

    } catch (error) {
        console.error("Reset password error:", error);
        return catchError(error, "Password reset failed");
    }
}
