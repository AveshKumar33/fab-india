import connectDB from "@/lib/mongoose";
import { User } from "@/models/User";
import { forgotPasswordSchema } from "@/lib/zod-schemas";

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const parsed = forgotPasswordSchema.safeParse(body);

        if (!parsed.success) {
            return new Response(
                JSON.stringify({ errors: parsed.error.errors }),
                { status: 400 }
            );
        }

        const { email } = parsed.data;
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "If this email exists, a reset link will be sent" }),
                { status: 200 }
            );
        }

        /** Here you would generate a reset token and send email */
        const resetToken = Math.random().toString(36).substring(2, 15);

        /** Save token to user (optional) or a separate collection  */
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; /** 1 hour */
        await user.save();

        console.log(`Send reset link to ${email}: /reset-password/${resetToken}`);

        return new Response(
            JSON.stringify({ message: "If this email exists, a reset link will be sent" }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
