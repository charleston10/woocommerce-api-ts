import crypto from "crypto";
import { signBaseString } from "../lib/oauth/sign-base-string";

describe("signBaseString functions", () => {
  it("signNodeBaseString should generate correct HMAC SHA1 signature", async () => {
    const baseString = "Hello, world!";
    const signingKey = "secret-key";

    const hmac = crypto.createHmac("sha1", signingKey);
    const expectedSignature = hmac.update(baseString).digest("base64");

    const result = await signBaseString(baseString, signingKey);

    expect(result).toBe(expectedSignature);
  });
});
