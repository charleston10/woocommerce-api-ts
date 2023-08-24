import { generateOAuthUrl } from "./lib/oauth/oauth";

generateOAuthUrl(
  "GET",
  "http://localhost/wp-json/wc/v3/orders",
  "ck_7644a791d1ba617a48f49a429647a4307f15d989",
  "cs_51162e49ea1ff02f31bae622ce90a5e52b2cd06d",
).then((result) => {
  console.log(result);
});
