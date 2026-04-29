import { NextResponse } from "next/server";
import { getStoredToken } from "@/lib/swiggy";

export async function GET() {
  try {
    const token = await getStoredToken();
    return NextResponse.json({
      connected: Boolean(token),
      configured: Boolean(process.env.SWIGGY_CLIENT_ID && process.env.SESSION_SECRET),
      expiresAt: token?.expiresAt || null,
      scope: token?.scope || ""
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      configured: Boolean(process.env.SWIGGY_CLIENT_ID && process.env.SESSION_SECRET),
      error: error.message
    });
  }
}
