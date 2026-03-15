import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json(
        {
            success,
            message,
            data,
        },
        { status: statusCode }
    );
};

export const catchError = (error, customMessage = "Internal Server Error") => {
    let statusCode = 500;
    let message = customMessage;
    let data = {};

    // MongoDB duplicate key error
    if (error?.code === 11000) {
        const keys = Object.keys(error.keyPattern || {}).join(", ");
        message = `Duplicate fields: ${keys}. These values must be unique.`;
        statusCode = 400;
    }

    // Nodemailer / SMTP auth error
    else if (error?.code === "EAUTH") {
        message = "Email service authentication failed";
        statusCode = 502;
    }

    // Validation errors (Zod / custom)
    else if (error?.name === "ZodError") {
        message = "Validation failed";
        statusCode = 400;
        data.errors = error.errors;
    }

    // Default JS Error
    else if (error instanceof Error) {
        message = error.message || customMessage;
    }

    // Dev-only debug info
    if (process.env.NODE_ENV === "development") {
        data.debug = {
            message: error?.message,
            stack: error?.stack,
            code: error?.code,
        };
    }

    return response(false, statusCode, message, data);
};

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}