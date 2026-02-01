"use client"

import { Eye, EyeOff } from "lucide-react"
import React, { useState } from "react"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

import Logo from "@/public/assets/images/logo-black.png"
import { loginSchema } from "@/lib/zod-schemas"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ButtonLoading from "@/components/Application/buttonLoading"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"

import {
    WEBSITE_REGISTER,
    WEBSITE_FORGOT_PASSWORD,
} from "@/routes/WebsitePanelRoute"

const LoginPage = () => {
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

    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (values) => {
        console.log("Login values:", values)
        await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return (<div className="flex min-h-screen items-center justify-center">
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
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                        loading={isSubmitting}
                        className="w-full"
                    />

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                            </span>
                        </div>
                    </div>

                    {/* Register */}
                    <p className="text-center text-sm text-muted-foreground">
                        Don’t have an account?{" "}
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
