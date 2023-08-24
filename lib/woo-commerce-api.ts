import { WcSettings } from "./common/model/wc-settings";
import { generateOAuthUrl } from "./oauth/oauth";

export const WooCommerceApi = (settings: WcSettings) => {
  return {
    get: async (endpoint: string, params: any) => {
      const method = "GET";
      const url = `${settings.url}/${settings.version}/${endpoint}`;

      try {
        const oauthUrl = await generateOAuthUrl(
          method,
          url,
          settings.consumerKey,
          settings.consumerSecret,
          params,
        );

        console.log("oauthUrl", oauthUrl);

        const response = await fetch(oauthUrl, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        return response.json();
      } catch (e) {
        console.error(`${method} ${url}`, e);
      }
    },
  };
};
