import connectDB from "@/lib/mongoose";
import { User } from "@/models/User";
import { resetPasswordSchema } from "@/lib/zod-schemas";

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const { token, password, confirmPassword } = body;

        const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
        if (!parsed.success) {
            return new Response(JSON.stringify({ errors: parsed.error.errors }), { status: 400 });
        }

        /** Find user by reset token */
        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
        }

        /** Update password */
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return new Response(JSON.stringify({ message: "Password reset successfully" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
