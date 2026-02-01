import { dbConnect } from "@/lib/database-connection"
import { NextResponse } from "next/server"

export async function GET() {
    await dbConnect()
    return NextResponse.json({ success: true })
}
