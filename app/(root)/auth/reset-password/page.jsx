"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"

import Logo from "@/public/assets/images/logo-black.png"
import { resetPasswordSchema } from "@/lib/zod-schemas"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ButtonLoading from "@/components/Application/buttonLoading"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

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

    const onSubmit = async (values) => {
        if (!token) {
            console.error("Reset token missing")
            return
        }

        console.log("Reset password:", {
            token,
            password: values.password,
        })

        /** call backend API here */
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
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword
