import { OAuthParams } from "../common/model/oauth-params";
import { generateNonce } from "./nonce";
import { signBaseString } from "./sign-base-string";

export async function generateOAuthUrl(
  method: string,
  baseUrl: string,
  consumerKey: string,
  consumerSecret: string,
  params: { [key: string]: string } = {},
): Promise<string> {
  const oauthParams = await generateOAuthSignature(
    method,
    baseUrl,
    consumerKey,
    consumerSecret,
  );
  return buildFinalUrl(baseUrl, { ...oauthParams, ...params });
}

export function encodeParameters(params: { [key: string]: string }): string {
  return Object.keys(params)
    .sort()
    .map((k) => {
      return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    })
    .join("&");
}

export function buildBaseString(
  method: string,
  baseUrl: string,
  params: OAuthParams,
): string {
  return (
    method.toUpperCase() +
    "&" +
    encodeURIComponent(baseUrl) +
    "&" +
    encodeURIComponent(encodeParameters(params))
  );
}

export async function generateOAuthSignature(
  method: string,
  baseUrl: string,
  consumerKey: string,
  consumerSecret: string,
): Promise<OAuthParams> {
  let params: OAuthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  };

  const baseString = buildBaseString(method, baseUrl, params);
  const signingKey = encodeURIComponent(consumerSecret) + "&";
  params.oauth_signature = await signBaseString(baseString, signingKey);

  return params;
}

export function buildFinalUrl(
  baseUrl: string,
  oauthParams: OAuthParams,
): string {
  const queryString = encodeParameters(oauthParams);
  return `${baseUrl}?${queryString}`;
}
