import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema } from '@/lib/zod-schemas'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, REGEXP_ONLY_DIGITS } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/Application/ButtonLoading'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import Image from 'next/image'
import Logo from '@/public/assets/images/logo-black.png'
import {
    Field,
    FieldGroup,
    FieldLabel, FieldError
} from '@/components/ui/field'

const OTPVerification = ({
    email,
    onSubmit,
    loading,
    onBack,
    title = "Verify your email",
    description = "Enter the 6-digit code sent to your email"
}) => {

    const [resendLoading, setResendLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const inputRefs = useRef([])

    const handlePaste = (e, field) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pastedData.length === 6) {
            field.onChange(pastedData)
            // Focus last input
            setTimeout(() => {
                inputRefs.current[5]?.focus()
            }, 0)
        }
    }

    const form = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
            email: email
        }
    })

    const handleSubmit = (values) => {
        onSubmit(values)
    }

    const handleInputChange = (index, value, field) => {
        const newValue = field.value || '';
        const updatedValue = newValue.split('');
        updatedValue[index] = value.slice(-1);
        field.onChange(updatedValue.join(''));

        // Auto-focus next input
        if (value && index < 5) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 0);
        }
    }

    const handleKeyDown = (index, e, field) => {
        // Handle backspace
        if (e.key === 'Backspace' && !field.value?.[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const handleResendOTP = async () => {
        try {
            setResendLoading(true)

            const response = await axios.post("/api/auth/resend-otp", { email })

            if (response.data.success) {
                showToast("success", "OTP resent successfully")
                // Start countdown timer
                setResendTimer(60)
                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
            } else {
                showToast("error", response.data.message || "Failed to resend OTP")
            }
        } catch (error) {
            showToast("error", error?.response?.data?.message || "Failed to resend OTP")
        } finally {
            setResendLoading(false)
        }
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
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description} {email}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        <FieldGroup>
                            {/* Hidden Email Field */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <Input type="hidden" {...field} />
                                )}
                            />

                            {/* OTP Input */}
                            <Controller
                                name="otp"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Verification Code</FieldLabel>

                                        <div className="flex justify-center gap-3 my-6" onPaste={(e) => handlePaste(e, field)}>
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <Input
                                                    key={index}
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                    type="text"
                                                    maxLength={1}
                                                    className="w-16 h-16 text-2xl font-bold border-2 border-gray-300 rounded-xl bg-white text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                    value={field.value?.[index] || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(-1)
                                                        const newValue = field.value || '';
                                                        const updatedValue = newValue.split('');
                                                        updatedValue[index] = value;
                                                        field.onChange(updatedValue.join(''));

                                                        // Auto-focus next input
                                                        if (value && index < 5) {
                                                            setTimeout(() => {
                                                                inputRefs.current[index + 1]?.focus();
                                                            }, 0);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // Handle backspace
                                                        if (e.key === 'Backspace' && !field.value?.[index] && index > 0) {
                                                            inputRefs.current[index - 1]?.focus();
                                                        } else if (e.key === 'Backspace' && field.value?.[index]) {
                                                            // Clear current and go to previous
                                                            const newValue = field.value || '';
                                                            const updatedValue = newValue.split('');
                                                            updatedValue[index] = '';
                                                            field.onChange(updatedValue.join(''));
                                                            if (index > 0) {
                                                                setTimeout(() => {
                                                                    inputRefs.current[index - 1]?.focus();
                                                                }, 0);
                                                            }
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Back Button */}
                        {onBack && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={onBack}
                            >
                                Back
                            </Button>
                        )}

                        {/* Submit */}
                        <ButtonLoading
                            type="submit"
                            text="Verify Email"
                            loading={loading}
                            className="w-full"
                        />

                        {/* Resend OTP */}
                        <p className="text-center text-sm text-muted-foreground">
                            Didn't receive the code?{" "}
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-primary font-medium hover:underline"
                                onClick={handleResendOTP}
                                disabled={resendLoading || resendTimer > 0}
                            >
                                {resendLoading ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                            </Button>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default OTPVerification