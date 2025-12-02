import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { config } from "../config.js";

export const googleClient = new OAuth2Client({
  clientId: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  redirectUri: config.GOOGLE_REDIRECT_URI,
});

export const GOOGLE_SCOPES = ["openid", "email", "profile"];

export async function verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub) {
    throw new Error("Invalid Google token payload");
  }

  return payload;
}
