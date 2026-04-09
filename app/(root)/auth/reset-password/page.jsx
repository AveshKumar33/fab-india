"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"

import Logo from "@/public/assets/images/logo-black.png"
import { resetPasswordSchema, otpSchema } from "@/lib/zod-schemas"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ButtonLoading from "@/components/Application/ButtonLoading"
import OTPVerification from "@/components/Application/OTPVerification"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { verifyOTP, resendOTP, clearError } from "@/redux/slices/authSlice"
import { showToast } from "@/lib/showToast"
import Link from "next/link"

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showOTPVerification, setShowOTPVerification] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const dispatch = useAppDispatch()
    const auth = useAppSelector((state) => state.auth)

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const {
        formState: { isSubmitting },
    } = form

    // Handle auth state changes
    useEffect(() => {
        if (email) {
            setUserEmail(email)
            setShowOTPVerification(true)
            showToast("info", "Please verify your email with OTP to reset password")
        }
    }, [email])

    // Handle successful OTP verification for password reset
    useEffect(() => {
        if (auth.isAuthenticated && showOTPVerification) {
            setShowOTPVerification(false)
            showToast("success", "Email verified! Now you can reset your password.")
        }
    }, [auth.isAuthenticated, showOTPVerification])

    // Handle auth errors
    useEffect(() => {
        if (auth.error) {
            showToast("error", auth.error)
            dispatch(clearError())
        }
    }, [auth.error, dispatch])

    const onSubmit = async (values) => {
        if (!token) {
            showToast("error", "Reset token missing")
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: values.password,
                    email: userEmail,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed')
            }

            showToast("success", "Password reset successfully!")
            // Redirect to login page
            window.location.href = '/auth/login'

        } catch (error) {
            showToast("error", error.message || "Password reset failed")
        }
    }

    const handleOTPVerification = async (otpValues) => {
        dispatch(verifyOTP({ email: userEmail, otp: otpValues.otp }))
    }

    const handleBackToReset = () => {
        setShowOTPVerification(false)
    }

    // Show OTP Verification component
    if (showOTPVerification) {
        return (
            <OTPVerification
                email={userEmail}
                onSubmit={handleOTPVerification}
                loading={auth.isLoading}
                onBack={handleBackToReset}
                title="Verify Email for Password Reset"
                description="Enter the 6-digit code sent to your email to continue with password reset"
            />
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[420px]">
                <CardContent className="space-y-6 pt-6">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Image src={Logo} alt="Logo" className="max-w-[150px]" />
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold">Reset Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FieldGroup>
                            {/* New Password */}
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>New Password</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="********"
                                                {...field}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Confirm Password */}
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Confirm Password</FieldLabel>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <ButtonLoading
                            type="submit"
                            text="Reset Password"
                            loading={isSubmitting}
                            className="w-full"
                        />
                    </form>

                    {/* Back to Login */}
                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/auth/login"
                            className="text-primary font-medium hover:underline"
                        >
                            Back to Login
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword
