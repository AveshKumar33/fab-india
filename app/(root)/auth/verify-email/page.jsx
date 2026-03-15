"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

import VerifiedLogo from "@/public/assets/images/verified.gif"
import FailedLogo from "@/public/assets/images/verification-failed.gif"

const VerifyEmail = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [status, setStatus] = useState("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Invalid or missing verification token")
            return
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || "Verification failed")
                }

                setStatus("success")
                setMessage("Your email has been verified successfully 🎉")

                setTimeout(() => {
                    router.push("/auth/login")
                }, 3000)

            } catch (err) {
                setStatus("error")
                setMessage(err.message)
            }
        }

        verifyEmail()
    }, [token, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
                <CardContent className="space-y-6 py-10 text-center">

                    {/* Image Section */}
                    <div className="flex justify-center">
                        {status === "success" && (
                            <Image
                                src={VerifiedLogo}
                                alt="Verified"
                                width={120}
                                height={120}
                                className="object-contain"
                                priority
                            />
                        )}

                        {status === "error" && (
                            <Image
                                src={FailedLogo}
                                alt="Failed"
                                width={120}
                                height={120}
                                className="object-contain"
                                priority
                            />
                        )}

                        {status === "loading" && (
                            <div className="h-24 w-24 flex items-center justify-center">
                                <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Text Section */}
                    {status === "loading" && (
                        <>
                            <h2 className="text-xl font-semibold">
                                Verifying your email...
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Please wait a moment
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <h2 className="text-xl font-semibold text-green-600">
                                Email Verified
                            </h2>
                            <p className="text-gray-600 text-sm">{message}</p>
                            <Link
                                href="/auth/login"
                                className="inline-block mt-2 text-blue-600 font-medium hover:underline"
                            >
                                Go to Login
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <h2 className="text-xl font-semibold text-red-600">
                                Verification Failed
                            </h2>
                            <p className="text-gray-600 text-sm">{message}</p>
                            <Link
                                href="/auth/login"
                                className="inline-block mt-2 text-blue-600 font-medium hover:underline"
                            >
                                Back to Login
                            </Link>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmail