"use client"
import { Eye, EyeOff } from "lucide-react"
import React, { useState } from "react"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"
import { showToast } from "@/lib/showToast"
import Logo from "@/public/assets/images/logo-black.png"
import { loginSchema } from "@/lib/zod-schemas"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ButtonLoading from "@/components/Application/ButtonLoading"
import OTPVerification from "@/components/Application/OTPVerification"
import {
    Field,
    FieldGroup,
    FieldLabel, FieldError
} from "@/components/ui/field"

import { WEBSITE_REGISTER, WEBSITE_FORGOT_PASSWORD } from "@/routes/WebsitePanelRoute"

const LoginPage = () => {

    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const {
        formState: { isSubmitting },
    } = form

    const [loading, setLoading] = useState(false)
    const [otpVerifiactionLoading, setOtpVerifiactionLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showOTPVerification, setShowOTPVerification] = useState(false)
    const [otpEmail, setOtpEmail] = useState("")


    const onSubmit = async (values) => {
        try {
            setLoading(true)

            const response = await axios.post("/api/auth/login", values)

            const { data } = response

            if (!data.success) {
                // Handle OTP verification case
                if (data.message.includes("Email not verified") || data.message.includes("OTP sent")) {
                    setOtpEmail(values.email)
                    setShowOTPVerification(true)
                    showToast("info", data.message)
                    return
                }
                throw new Error(data.message)
            }

            showToast("success", data.message)

            form.reset()

            /** redirect after login */
            router.push("/")

        } catch (error) {
            /** Handle 403 response for unverified email */
            if (error?.response?.status === 403) {
                const errorData = error?.response?.data
                console.log('403 Error data:', errorData)

                if (errorData?.message.includes("Email not verified") || errorData?.message.includes("OTP sent")) {
                    console.log('Setting OTP verification from error handler - email:', values.email)
                    console.log('Before state update - showOTPVerification:', showOTPVerification)
                    setOtpEmail(values.email)
                    setShowOTPVerification(true)
                    console.log('After state update - showOTPVerification:', showOTPVerification)
                    showToast("info", errorData.message)
                    return
                }
            }

            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong"

            showToast("error", message)
        } finally {
            setLoading(false)
        }
    }

    const handleOTPVerification = async (otpValues) => {
        try {
            setOtpVerifiactionLoading(true)

            const { data } = await axios.post("/api/auth/verify-otp", otpValues)

            if (!data.success) {
                throw new Error(data.message)
            }

            showToast("success", data.message)
            setShowOTPVerification(false)
            form.reset()

            /** redirect after successful verification */
            router.push("/")

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                error.message ||
                "OTP verification failed"

            showToast("error", message)
        } finally {
            setOtpVerifiactionLoading(false)
        }
    }

    const handleBackToLogin = () => {
        setShowOTPVerification(false)
        setOtpEmail("")
        form.reset()
    }

    // Show OTP Verification component
    console.log('showOTPVerification:', showOTPVerification, 'otpEmail:', otpEmail)
    if (showOTPVerification) {
        console.log('Rendering OTP Verification component')
        return (
            <OTPVerification
                email={otpEmail}
                onSubmit={handleOTPVerification}
                loading={otpVerifiactionLoading}
            />
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[450px]">
                <CardContent className="space-y-6 pt-6">

                    {/* Logo */}
                    <div className="flex justify-center">
                        <Image src={Logo} alt="Logo" className="h-10 w-auto" />
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Login to your account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and password below
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        <FieldGroup>

                            {/* Email */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Email</FieldLabel>

                                        <Input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(e.target.value.toLowerCase())
                                            }
                                        />

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Password */}
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>

                                        <div className="flex items-center justify-between">
                                            <FieldLabel>Password</FieldLabel>

                                            <Link
                                                href={WEBSITE_FORGOT_PASSWORD}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Forgot?
                                            </Link>
                                        </div>

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
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}

                                    </Field>
                                )}
                            />

                        </FieldGroup>

                        {/* Submit */}
                        <ButtonLoading
                            type="submit"
                            text="Login"
                            loading={loading}
                            className="w-full"
                        />

                        {/* Register */}
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                href={WEBSITE_REGISTER}
                                className="text-primary font-medium hover:underline"
                            >
                                Create account
                            </Link>
                        </p>

                    </form>

                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage