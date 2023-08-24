export type WcSettings = {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
  params?: { [key: string]: string };
};
