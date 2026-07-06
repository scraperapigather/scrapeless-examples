// Scraping Browser — control proxy egress by country/state/city.
// Docs: https://docs.scrapeless.com/en/scraping-browser/features/advanced-privacy-anti-detection/proxies/
// Run:  SCRAPELESS_API_KEY=sk_... node scraping-browser/proxies.js
import puppeteer from "puppeteer-core";

const apiKey = process.env.SCRAPELESS_API_KEY || "your_api_key_here";

// Pin residential egress to a specific geography. proxyCountry accepts an ISO
// code or "ANY"; proxyState/proxyCity narrow it further (US shown here).
const params = new URLSearchParams({
  token: apiKey,
  sessionTTL: "180",
  proxyCountry: "US",
  proxyState: "CA",
  proxyCity: "Los Angeles",
});
const connectionURL = `wss://browser.scrapeless.com/api/v2/browser?${params}`;

const browser = await puppeteer.connect({ browserWSEndpoint: connectionURL });
const page = await browser.newPage();
// httpbin echoes the exit IP so you can confirm the egress geography.
await page.goto("https://httpbin.io/ip", { waitUntil: "domcontentloaded" });
console.log(await page.evaluate(() => document.body.innerText));
await browser.close();
