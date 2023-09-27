const { WooCommerceApi } = require("./../dist/index.js");

const wc = WooCommerceApi({
  url: "http://localhost/wp-json",
  consumerKey: "ck_7644a791d1ba617a48f49a429647a4307f15d989",
  consumerSecret: "cs_51162e49ea1ff02f31bae622ce90a5e52b2cd06d",
  version: "wc/v3",
});

wc.request("GET", "orders").then((orders) => {
  console.log(orders);
});
