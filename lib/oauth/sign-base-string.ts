import crypto from "crypto";
import { bufferToBase64 } from "./buffer-base64";

export async function signBaseString(
  baseString: string,
  signingKey: string,
): Promise<string> {
  if (typeof window !== "undefined") {
    return signBrowserBaseString(baseString, signingKey);
  } else if (typeof module !== "undefined") {
    return signNodeBaseString(baseString, signingKey);
  } else {
    throw new Error("Environment not supported");
  }
}

export async function signBrowserBaseString(
  baseString: string,
  signingKey: string,
) {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(signingKey),
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"],
  );
  const signature = await window.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(baseString),
  );
  return bufferToBase64(signature);
}

export async function signNodeBaseString(
  baseString: string,
  signingKey: string,
) {
  const hmac = crypto.createHmac("sha1", signingKey);
  return hmac.update(baseString).digest("base64");
}
