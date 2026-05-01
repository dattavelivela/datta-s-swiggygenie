import { NextResponse } from "next/server";
import { callSwiggyFoodTool, FOOD_TOOLS, getStoredToken, normalizeToolResult } from "@/lib/swiggy";

const MUTATING_TOOLS = new Set([
  "flush_food_cart",
  "update_food_cart",
  "apply_food_coupon",
  "place_food_order"
]);

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { tool, arguments: args = {} } = body;

  if (!FOOD_TOOLS.has(tool)) {
    return NextResponse.json({ success: false, error: { message: "Unsupported Swiggy Food tool." } }, { status: 400 });
  }

  if (tool === "place_food_order") {
    return NextResponse.json({
      success: false,
      error: {
        message: "Use /api/swiggy/place-order so cart refresh, ₹1000 cap, COD payment, and check-then-retry guards are enforced."
      }
    }, { status: 409 });
  }

  const token = await getStoredToken();
  if (!token) {
    return NextResponse.json({
      success: false,
      requiresAuth: true,
      error: {
        message: "Connect Swiggy before calling MCP tools."
      }
    }, { status: 401 });
  }

  try {
    const result = await callSwiggyFoodTool(token.accessToken, tool, args);
    return NextResponse.json({
      success: true,
      mutating: MUTATING_TOOLS.has(tool),
      result: normalizeToolResult(result)
    });
  } catch (error) {
    const status = error?.status === 401 || String(error?.message || "").includes("-32001") ? 401 : 500;
    return NextResponse.json({
      success: false,
      requiresAuth: status === 401,
      error: {
        message: error.message || "Swiggy MCP call failed."
      }
    }, { status });
  }
}
