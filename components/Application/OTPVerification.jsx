import React from 'react'

const OTPVerification = ({ email, onSubmit, loading }) => {

    const formSchema = zSchema.pick({
        otp: true, email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email
        }
    })
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">

        </div>
    )
}

export default OTPVerification