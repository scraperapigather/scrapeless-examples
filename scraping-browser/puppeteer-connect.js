// Scraping Browser — connect with Puppeteer (direct wss + SDK helper).
// Docs: https://docs.scrapeless.com/en/scraping-browser/libraries/puppeteer/
// Run:  SCRAPELESS_API_KEY=sk_... node scraping-browser/puppeteer-connect.js
import puppeteer from "puppeteer-core";
import { Puppeteer } from "@scrapeless-ai/sdk";

const apiKey = process.env.SCRAPELESS_API_KEY || "your_api_key_here";

// Option A — connect directly to the cloud browser over the WebSocket endpoint.
async function directConnect() {
  const connectionURL =
    `wss://browser.scrapeless.com/api/v2/browser?token=${apiKey}` +
    `&sessionTTL=180&proxyCountry=ANY`;
  const browser = await puppeteer.connect({ browserWSEndpoint: connectionURL });
  const page = await browser.newPage();
  await page.goto("https://www.scrapeless.com");
  console.log("direct  ->", await page.title());
  await browser.close();
}

// Option B — let the SDK mint the session and connect in one call.
async function sdkConnect() {
  const browser = await Puppeteer.connect({
    apiKey,
    sessionName: "sdk_test",
    sessionTTL: 180,
    proxyCountry: "US",
    sessionRecording: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://www.scrapeless.com");
  console.log("sdk     ->", await page.title());
  await browser.close();
}

await directConnect();
await sdkConnect();
