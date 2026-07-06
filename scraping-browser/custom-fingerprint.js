// Scraping Browser — supply a custom, internally-consistent browser fingerprint.
// Docs: https://docs.scrapeless.com/en/scraping-browser/features/advanced-privacy-anti-detection/custom-fingerprint/
// Run:  SCRAPELESS_API_KEY=sk_... node scraping-browser/custom-fingerprint.js
import puppeteer from "puppeteer-core";

const apiKey = process.env.SCRAPELESS_API_KEY || "your_api_key_here";

// The fingerprint keeps user agent, platform, screen, locale and timezone
// consistent so the anti-detection check reads a coherent identity.
const fingerprint = {
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.1.2.3 Safari/537.36",
  platform: "Windows",
  screen: { width: 1280, height: 1024 },
  localization: { languages: ["zh-HK", "en-US", "en"], timezone: "Asia/Hong_Kong" },
  args: { "--window-size": "1280,1024" },
};

const params = new URLSearchParams({
  token: apiKey,
  sessionTTL: "180",
  proxyCountry: "ANY",
  fingerprint: encodeURIComponent(JSON.stringify(fingerprint)),
});
const connectionURL = `wss://browser.scrapeless.com/api/v2/browser?${params}`;

const browser = await puppeteer.connect({ browserWSEndpoint: connectionURL });
const page = await browser.newPage();
await page.goto("https://httpbin.io/user-agent", { waitUntil: "domcontentloaded" });
console.log(await page.evaluate(() => document.body.innerText));
await browser.close();
