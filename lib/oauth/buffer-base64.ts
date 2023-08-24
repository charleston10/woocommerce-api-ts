export async function bufferToBase64(buf: ArrayBuffer): Promise<string> {
  if (typeof window !== "undefined") {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buf], { type: "application/octet-stream" });
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const dataUrl = event.target.result;
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } else if (typeof module !== "undefined") {
    return Buffer.from(buf).toString("base64");
  } else {
    throw new Error("Environment not supported");
  }
}
