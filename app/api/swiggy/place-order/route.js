import { NextResponse } from "next/server";
import {
  callSwiggyFoodTool,
  getArrayFromToolData,
  getCartTotal,
  getStoredToken,
  getToolData,
  isRetryableMcpError,
  normalizeToolResult,
  sleep
} from "@/lib/swiggy";

function summarizeOrder(order) {
  if (!order) return null;
  return {
    orderId: order.orderId || order.id,
    status: order.status || order.orderStatus,
    createdAt: order.createdAt || order.orderTime || order.created_at
  };
}

async function placeFoodOrder(accessToken) {
  const result = await callSwiggyFoodTool(accessToken, "place_food_order", {
    paymentMethod: "COD"
  });
  return normalizeToolResult(result);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { confirmed = false } = body;

  const token = await getStoredToken();
  if (!token) {
    return NextResponse.json({
      success: false,
      requiresAuth: true,
      error: {
        message: "Connect Swiggy before placing an order."
      }
    }, { status: 401 });
  }

  const cartResult = await callSwiggyFoodTool(token.accessToken, "get_food_cart");
  const cart = getToolData(cartResult);
  const total = getCartTotal(cart);

  if (!total) {
    return NextResponse.json({
      success: false,
      error: {
        message: "Cart is empty or missing total. Add items before placing the order."
      },
      cart
    }, { status: 409 });
  }

  if (total > 1000) {
    return NextResponse.json({
      success: false,
      error: {
        message: "Builders Club food orders are capped at ₹1000. Reduce the cart before placing."
      },
      cart,
      total
    }, { status: 409 });
  }

  if (!confirmed) {
    return NextResponse.json({
      success: false,
      requiresConfirmation: true,
      paymentMethod: "COD",
      cart,
      total
    }, { status: 409 });
  }

  try {
    const order = await placeFoodOrder(token.accessToken);
    return NextResponse.json({
      success: true,
      paymentMethod: "COD",
      cart,
      total,
      order
    });
  } catch (error) {
    if (!isRetryableMcpError(error)) {
      return NextResponse.json({
        success: false,
        error: {
          message: error.message || "Swiggy order placement failed."
        }
      }, { status: 500 });
    }

    await sleep(2500);
    const ordersResult = await callSwiggyFoodTool(token.accessToken, "get_food_orders");
    const orders = getArrayFromToolData(getToolData(ordersResult), ["orders", "foodOrders"]);
    const newestOrder = summarizeOrder(orders[0]);

    if (newestOrder?.orderId) {
      return NextResponse.json({
        success: true,
        recoveredFromPlacementError: true,
        paymentMethod: "COD",
        cart,
        total,
        order: newestOrder
      });
    }

    try {
      const retryOrder = await placeFoodOrder(token.accessToken);
      return NextResponse.json({
        success: true,
        retriedAfterOrderCheck: true,
        paymentMethod: "COD",
        cart,
        total,
        order: retryOrder
      });
    } catch (retryError) {
      return NextResponse.json({
        success: false,
        checkedExistingOrders: true,
        error: {
          message: retryError.message || "Swiggy order placement retry failed."
        }
      }, { status: 502 });
    }
  }
}
