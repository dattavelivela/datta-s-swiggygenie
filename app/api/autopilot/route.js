import { NextResponse } from "next/server";

const plans = new Map();

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const planId = crypto.randomUUID();

  plans.set(planId, {
    id: planId,
    createdAt: new Date().toISOString(),
    status: "draft",
    plan: body
  });

  return NextResponse.json({
    success: true,
    planId,
    message: "Autopilot draft saved. Add durable storage before using this in production."
  });
}
