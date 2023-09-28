import { WcSettings } from "./common/model/wc-settings";
import { generateOAuthUrl } from "./oauth/oauth";
import axios from "axios";

export const WoocommerceApi = (settings: WcSettings) => {
  return {
    request: async (
      method: string,
      endpoint: string,
      requestData?: any,
      params?: any,
    ) => {
      const url = `${settings.url}/${settings.version}/${endpoint}`;

      try {
        const oauthUrl = await generateOAuthUrl(
          method,
          url,
          settings.consumerKey,
          settings.consumerSecret,
          params ? params : {},
        );

        let config: any = {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (requestData) {
          config = {
            ...config,
            data: JSON.stringify(requestData),
          };
        }

        const response = await axios(oauthUrl, config);

        return response.data;
      } catch (e) {
        console.error(`${method} ${url}`, e);
        throw e;
      }
    },
  };
};
