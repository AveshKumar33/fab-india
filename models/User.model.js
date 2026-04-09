const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserRole = {
    USER: "user",
    ADMIN: "admin",
    VENDOR: "vendor",
};

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^\S+@\S+\.\S+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },

        phone: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            default: null,
            trim: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },

        emailVerificationToken: {
            type: String,
        },

        emailVerificationExpires: {
            type: Date,
        },

        resetToken: {
            type: String,
        },

        resetTokenExpiry: {
            type: Date,
        },
    },
    { timestamps: true }
);

/** FIXED PASSWORD HASHING */
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/** Compare password */
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User =
    mongoose.models.User || mongoose.model("User", UserSchema, "users");

module.exports = { User, UserRole };
