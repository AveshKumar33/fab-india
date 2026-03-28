import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { registerSchema } from "@/lib/zod-schemas";
import { generateEmailVerificationToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/send-mail";
import { response, catchError } from "@/lib/helper-function";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return response(false, 400, "Validation failed", {
        errors: parsed.error.errors,
      });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(false, 400, "Email already registered");
    }


    const user = await User.create({
      name,
      email,
      password,
    });

    const token = await generateEmailVerificationToken(
      user._id.toString()
    );

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

    return response(
      true,
      201,
      "Registration successful. Please verify your email."
    );
  } catch (err) {
    console.error("Register error:", err);
    return catchError(err, "Registration failed");
  }
}