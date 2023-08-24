import { generateNonce } from "../lib/oauth/nonce";

describe("generateNonce", () => {
  it("should generate nonce of specified length", () => {
    const nonceLength = 10;
    const nonce = generateNonce(nonceLength);

    expect(nonce.length).toBe(nonceLength);
  });

  it("should generate nonce with valid characters", () => {
    const validChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const nonce = generateNonce(15);
    for (let char of nonce) {
      expect(validChars).toContain(char);
    }
  });

  it("should generate unique nonces (not an absolute test, but probabilistically checks uniqueness)", () => {
    const nonces = new Set<string>();
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      nonces.add(generateNonce(8));
    }
    // If all nonces are unique, the size of the set must equal the number of iterations.
    expect(nonces.size).toBe(iterations);
  });
});
