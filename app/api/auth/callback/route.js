import { NextResponse } from "next/server";
import { clearOAuthCookies, getBaseUrl, getRequiredEnv, readOAuthCookies, setTokenCookie } from "@/lib/swiggy";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${getBaseUrl(request)}/?auth=error&reason=${encodeURIComponent(error)}`);
  }

  const { state, verifier } = await readOAuthCookies();
  if (!code || !state || !verifier || returnedState !== state) {
    return NextResponse.redirect(`${getBaseUrl(request)}/?auth=error&reason=invalid_state`);
  }

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/callback`;
  const tokenResponse = await fetch("https://mcp.swiggy.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
      client_id: getRequiredEnv("SWIGGY_CLIENT_ID"),
      redirect_uri: redirectUri
    })
  });

  const payload = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !payload.access_token) {
    await clearOAuthCookies();
    return NextResponse.redirect(`${baseUrl}/?auth=error&reason=token_exchange_failed`);
  }

  await setTokenCookie(payload);
  await clearOAuthCookies();
  return NextResponse.redirect(`${baseUrl}/?auth=connected`);
}
