import {
  generateOAuthUrl,
  encodeParameters,
  buildBaseString,
  buildFinalUrl,
  generateOAuthSignature,
} from "../lib/oauth/oauth";

jest.mock("../lib/oauth/nonce", () => {
  return {
    generateNonce: jest.fn(() => "mockNonce"),
  };
});

jest.mock("../lib/oauth/sign-base-string", () => {
  return {
    signBaseString: jest.fn(() => Promise.resolve("mockSignature")),
  };
});

describe("OAuth URL Generator", () => {
  it("encodeParameters should correctly encode and join parameters", () => {
    const params = {
      test: "value",
      key: "secret",
    };
    const result = encodeParameters(params);
    expect(result).toBe("key=secret&test=value");
  });

  it("buildBaseString should correctly build base string for OAuth1.0", () => {
    const method = "GET";
    const baseUrl = "http://example.com";
    const params = {
      oauth_consumer_key: "testKey",
      oauth_nonce: "testNonce",
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: "12345678",
      oauth_version: "1.0",
    };
    const result = buildBaseString(method, baseUrl, params);

    expect(result).toBe(
      "GET&http%3A%2F%2Fexample.com&oauth_consumer_key%3DtestKey%26oauth_nonce%3DtestNonce%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D12345678%26oauth_version%3D1.0",
    );
  });

  it("buildFinalUrl should correctly append OAuth parameters to base URL", () => {
    const baseUrl = "http://example.com";

    const params = {
      oauth_consumer_key: "testKey",
      oauth_nonce: "testNonce",
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: "12345678",
      oauth_version: "1.0",
    };
    const result = buildFinalUrl(baseUrl, params);

    expect(result).toBe(
      "http://example.com?oauth_consumer_key=testKey&oauth_nonce=testNonce&oauth_signature_method=HMAC-SHA1&oauth_timestamp=12345678&oauth_version=1.0",
    );
  });

  it("generateOAuthSignature should correctly generate signature", async () => {
    const method = "GET";
    const baseUrl = "http://example.com";
    const consumerKey = "testKey";
    const consumerSecret = "testSecret";

    const result = await generateOAuthSignature(
      method,
      baseUrl,
      consumerKey,
      consumerSecret,
    );

    expect(result).toEqual({
      oauth_consumer_key: "testKey",
      oauth_nonce: "mockNonce",
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: expect.any(String), // since this is dynamic
      oauth_version: "1.0",
      oauth_signature: "mockSignature",
    });
  });

  it("generateOAuthUrl should correctly generate final OAuth URL", async () => {
    const method = "GET";
    const baseUrl = "http://example.com";
    const consumerKey = "testKey";
    const consumerSecret = "testSecret";

    const result = await generateOAuthUrl(
      method,
      baseUrl,
      consumerKey,
      consumerSecret,
    );
    const expectedParams = [
      "oauth_consumer_key=testKey",
      "oauth_nonce=mockNonce",
      "oauth_signature_method=HMAC-SHA1",
      "oauth_signature=mockSignature",
      "oauth_version=1.0",
      /oauth_timestamp=\d+/, // This uses a regex to match any timestamp value
    ];

    for (const param of expectedParams) {
      if (typeof param === "string") {
        expect(result).toContain(param);
      } else {
        expect(result).toMatch(param);
      }
    }
  });
});
