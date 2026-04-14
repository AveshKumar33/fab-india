"use client"
import { Eye, EyeOff } from "lucide-react"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { loginUser, verifyOTP, resendOTP, clearError, setOTPRequired } from "@/redux/slices/authSlice"
import { WEBSITE_REGISTER, WEBSITE_FORGOT_PASSWORD } from "@/routes/WebsitePanelRoute"
import { ADMIN_DASHBOARD } from "../../../../routes/AdminPanelRoute"
import { WEBSITE_USER_DASHBOARD } from "../../../../routes/WebsitePanelRoute"

const LoginPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const auth = useAppSelector((state) => state.auth)

    const [showPassword, setShowPassword] = useState(false)
    const [showOTPVerification, setShowOTPVerification] = useState(false)
    const [otpEmail, setOtpEmail] = useState("")

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

    /** Handle auth state changes */
    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            showToast("success", "Login successful!")
            form.reset()
            router.push("/")
        }

        if (auth.otpRequired) {
            setOtpEmail(auth.otpEmail)
            setShowOTPVerification(true)
            showToast("info", "OTP sent to your email")
        }

        if (auth.error) {
            showToast("error", auth.error)
            dispatch(clearError())
        }
    }, [auth, router, form, dispatch])

    const onSubmit = async (values) => {
        const { payload } = await dispatch(loginUser({ email: values.email, password: values.password }))
        if (searchParams.get("callback")) {
            router.push(searchParams.get("callback"))
        } else {
            console.log('auth.user.data:', payload?.data?.user?.role)
            payload?.data?.user?.role === "admin" ? router.push(ADMIN_DASHBOARD) : router.push(WEBSITE_USER_DASHBOARD)
        }
    }

    const handleOTPVerification = async (otpValues) => {
        dispatch(verifyOTP({ email: otpValues.email, otp: otpValues.otp }))
    }

    const handleBackToLogin = () => {
        setShowOTPVerification(false)
        setOtpEmail("")
        form.reset()
    }

    /** Show OTP Verification component */
    console.log('showOTPVerification:', showOTPVerification, 'otpEmail:', otpEmail)
    if (showOTPVerification) {
        console.log('Rendering OTP Verification component')
        return (
            <OTPVerification
                email={otpEmail}
                onSubmit={handleOTPVerification}
                loading={auth.isLoading}
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
                            loading={auth.isLoading}
                            className="w-full"
                        />

                        {/* Links Container */}
                        <div className="flex flex-col gap-2 text-center text-sm">
                            <span className="text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    href={WEBSITE_REGISTER}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Create account
                                </Link>
                            </span>
                        </div>

                    </form>

                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage