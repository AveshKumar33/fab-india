import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

export async function POST(request) {
    try {
        const payload = await request.json();
        const { paramsToSign } = payload;

        // Add required parameters for Cloudinary signature
        const signatureParams = {
            ...paramsToSign,
            timestamp: Math.round(Date.now() / 1000),
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            source: paramsToSign.source || 'auto'
        };

        const signature = cloudinary.utils.api_sign_request(signatureParams, process.env.CLOUDINARY_API_SECRET);

        console.log('Signature payload:', signatureParams);
        console.log('Generated signature:', signature);

        return NextResponse.json({
            signature,
            timestamp: signatureParams.timestamp,
            api_key: signatureParams.api_key
        });
    } catch (error) {
        console.error('Signature generation error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}