import nodemailer from "nodemailer";

/**
 * Send an email using Nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 */


export async function sendEmail({ to, subject, text, html }) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        const err = new Error("SMTP credentials are missing");
        err.code = "SMTP_CONFIG_MISSING";
        throw err;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter.sendMail({
        from: `"Your App Name" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: html || `<p>${text}</p>`,
    });
}

