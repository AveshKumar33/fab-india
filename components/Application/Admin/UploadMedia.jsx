'use client'

import React from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { FiPlus } from "react-icons/fi"

const UploadMedia = ({ isMultiple }) => {
    const handleOnError = (error) => {
        console.log(error)
    }

    const handleOnQueueEnd = (result) => {
        console.log(result)
    }

    const handleOnSuccess = (result) => {
        console.log("Upload successful:", result)
    }

    return (
        <CldUploadWidget
            signatureEndpoint="/api/cloudinary-signature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onQueuesEnd={handleOnQueueEnd}
            onSuccess={handleOnSuccess}
            config={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
            }}
            options={{
                multiple: isMultiple,
                sources: ['local', 'url', 'camera']
            }}
        >
            {({ open }) => (
                <Button
                    onClick={() => open()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                >
                    <FiPlus className="h-4 w-4" />
                    {isMultiple ? 'Upload Multiple Files' : 'Upload Single File'}
                </Button>
            )}
        </CldUploadWidget>
    )
}

export default UploadMedia
