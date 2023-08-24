import { bufferToBase64 } from "../lib/oauth/buffer-base64";

describe("bufferToBase64", () => {
  it("should convert ArrayBuffer to base64 in Node.js environment", async () => {
    const buffer = Buffer.from("Hello World");
    const arrayBuffer = Uint8Array.from(buffer).buffer;
    const base64 = await bufferToBase64(arrayBuffer);

    expect(base64).toBe(buffer.toString("base64"));
  });
});
