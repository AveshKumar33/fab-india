"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import Logo from "@/public/assets/images/logo-black.png"
import { registerSchema } from "@/lib/zod-schemas"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ButtonLoading from "@/components/Application/buttonLoading"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"

import { WEBSITE_LOGIN } from "@/routes/WebsitePanelRoute"

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const {
        formState: { isSubmitting },
    } = form

    const onSubmit = async (values) => {
        console.log("Register values:", values)
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[450px]">
                <CardContent className="space-y-6 pt-6">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Image src={Logo} alt="Logo" className="max-w-[150px]" />
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Fill in the details below to register
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FieldGroup>
                            {/* Name */}
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Name</FieldLabel>
                                        <Input placeholder="John Doe" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

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
                                        <FieldLabel>Password</FieldLabel>
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

                            {/* Confirm Password */}
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Confirm Password</FieldLabel>
                                        <Input type="password" placeholder="********" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <ButtonLoading
                            type="submit"
                            text="Create Account"
                            loading={isSubmitting}
                            className="w-full"
                        />

                        {/* Navigation */}
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href={WEBSITE_LOGIN}
                                className="text-primary font-medium hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register
