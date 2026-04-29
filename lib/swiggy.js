import crypto from "node:crypto";
import { cookies } from "next/headers";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const TOKEN_COOKIE = "swiggy_token";
const OAUTH_STATE_COOKIE = "swiggy_oauth_state";
const PKCE_COOKIE = "swiggy_pkce_verifier";

export const FOOD_TOOLS = new Set([
  "get_addresses",
  "search_restaurants",
  "get_restaurant_menu",
  "search_menu",
  "flush_food_cart",
  "update_food_cart",
  "get_food_cart",
  "fetch_food_coupons",
  "apply_food_coupon",
  "place_food_order",
  "get_food_orders",
  "get_food_order_details",
  "track_food_order",
  "report_error"
]);

export function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function getBaseUrl(request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function createPkcePair() {
  const verifier = randomToken(32);
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

function getCookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  };
}

function getSecret() {
  return crypto.createHash("sha256").update(getRequiredEnv("SESSION_SECRET")).digest();
}

export function encryptJson(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getSecret(), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptJson(value) {
  const raw = Buffer.from(value, "base64url");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getSecret(), iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8"));
}

export async function setOAuthCookies(state, verifier) {
  const jar = await cookies();
  jar.set(OAUTH_STATE_COOKIE, state, getCookieOptions(10 * 60));
  jar.set(PKCE_COOKIE, verifier, getCookieOptions(10 * 60));
}

export async function readOAuthCookies() {
  const jar = await cookies();
  return {
    state: jar.get(OAUTH_STATE_COOKIE)?.value,
    verifier: jar.get(PKCE_COOKIE)?.value
  };
}

export async function clearOAuthCookies() {
  const jar = await cookies();
  jar.delete(OAUTH_STATE_COOKIE);
  jar.delete(PKCE_COOKIE);
}

export async function setTokenCookie(tokenResponse) {
  const expiresIn = Number(tokenResponse.expires_in || 432000);
  const expiresAt = Date.now() + expiresIn * 1000;
  const encrypted = encryptJson({
    accessToken: tokenResponse.access_token,
    scope: tokenResponse.scope || "",
    expiresAt
  });
  const jar = await cookies();
  jar.set(TOKEN_COOKIE, encrypted, getCookieOptions(expiresIn));
}

export async function clearTokenCookie() {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
}

export async function getStoredToken() {
  const jar = await cookies();
  const encrypted = jar.get(TOKEN_COOKIE)?.value;
  if (!encrypted) return null;

  const token = decryptJson(encrypted);
  if (!token.accessToken || token.expiresAt <= Date.now() + 60 * 1000) {
    return null;
  }
  return token;
}

export async function callSwiggyFoodTool(accessToken, name, args = {}) {
  if (!FOOD_TOOLS.has(name)) {
    throw new Error(`Unsupported Swiggy Food tool: ${name}`);
  }

  const client = new Client({
    name: "swiggy-genie",
    version: "0.1.0"
  });

  const transport = new StreamableHTTPClientTransport(new URL("https://mcp.swiggy.com/food"), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });

  await client.connect(transport);
  try {
    return await client.callTool({
      name,
      arguments: args
    });
  } finally {
    await client.close();
  }
}

export function normalizeToolResult(result) {
  if (result?.structuredContent) {
    return result.structuredContent;
  }

  const textBlock = result?.content?.find((item) => item.type === "text" && item.text);
  if (!textBlock) return result;

  try {
    return JSON.parse(textBlock.text);
  } catch {
    return {
      success: true,
      data: {
        text: textBlock.text
      }
    };
  }
}
