"use client"

import React from "react"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import Logo from "@/public/assets/images/logo-black.png"
import { forgotPasswordSchema } from "@/lib/zod-schemas"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ButtonLoading from "@/components/Application/ButtonLoading"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"
import { showToast } from "@/lib/showToast"
import Link from "next/link"

const ForgotPassword = () => {
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const {
        formState: { isSubmitting },
    } = form

    const onSubmit = async (values) => {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link')
            }

            showToast("success", "Reset link sent! Check your email.")

        } catch (error) {
            showToast("error", error.message || "Failed to send reset link")
        }
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
                        <h1 className="text-2xl font-bold">Forgot Password?</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and we’ll send you a reset link
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FieldGroup>
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
                        </FieldGroup>

                        <ButtonLoading
                            type="submit"
                            text="Send Reset Link"
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

export default ForgotPassword
