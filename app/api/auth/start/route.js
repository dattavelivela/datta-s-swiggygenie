import { NextResponse } from "next/server";
import { createPkcePair, getBaseUrl, getRequiredEnv, randomToken, setOAuthCookies } from "@/lib/swiggy";

export async function GET(request) {
  const clientId = getRequiredEnv("SWIGGY_CLIENT_ID");
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/callback`;
  const state = randomToken(24);
  const { verifier, challenge } = createPkcePair();

  await setOAuthCookies(state, verifier);

  const authorizeUrl = new URL("https://mcp.swiggy.com/auth/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("scope", "mcp:tools mcp:resources mcp:prompts");

  return NextResponse.redirect(authorizeUrl);
}
