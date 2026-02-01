import { z } from "zod"

/** Reusable password schema */
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")

/** Login schema */
export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
})

/** Forgate password schema */
export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})


/** Register schema */
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be at most 50 characters"),

        email: z.string().email("Please enter a valid email address"),

        password: passwordSchema,

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    })

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Minimum 8 characters")
            .regex(/[A-Z]/, "One uppercase letter required")
            .regex(/[a-z]/, "One lowercase letter required")
            .regex(/[0-9]/, "One number required"),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    })
