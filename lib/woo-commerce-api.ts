import { WcSettings } from "./common/model/wc-settings";
import { generateOAuthUrl } from "./oauth/oauth";
import axios from "axios";

export const WooCommerceApi = (settings: WcSettings) => {
  return {
    request: async (
      method: string,
      endpoint: string,
      data: any,
      params: any,
    ) => {
      const url = `${settings.url}/${settings.version}/${endpoint}`;

      try {
        const oauthUrl = await generateOAuthUrl(
          method,
          url,
          settings.consumerKey,
          settings.consumerSecret,
          params,
        );

        const response = await axios(oauthUrl, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        });

        return response.data;
      } catch (e) {
        console.error(`${method} ${url}`, e);
      }
    },
  };
};
