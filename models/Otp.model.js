import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        otp: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/** MongoDB TTL index (auto delete expired OTP) */
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP =
    mongoose.models.OTP || mongoose.model("OTP", otpSchema);