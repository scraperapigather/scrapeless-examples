// Scraping Browser — connect with Playwright (direct CDP + SDK helper).
// Docs: https://docs.scrapeless.com/en/scraping-browser/libraries/playwright/
// Run:  SCRAPELESS_API_KEY=sk_... node scraping-browser/playwright-connect.js
import { chromium } from "playwright-core";
import { Playwright } from "@scrapeless-ai/sdk";

const apiKey = process.env.SCRAPELESS_API_KEY || "your_api_key_here";

// Option A — connect directly over CDP to the cloud browser.
async function directConnect() {
  const connectionURL =
    `wss://browser.scrapeless.com/api/v2/browser?token=${apiKey}` +
    `&sessionTTL=180&proxyCountry=ANY`;
  const browser = await chromium.connectOverCDP(connectionURL);
  const page = await browser.newPage();
  await page.goto("https://www.scrapeless.com");
  console.log("direct  ->", await page.title());
  await browser.close();
}

// Option B — SDK mints the session, then reuse its default context.
async function sdkConnect() {
  const browser = await Playwright.connect({
    apiKey,
    sessionName: "sdk_test",
    sessionTTL: 180,
    proxyCountry: "US",
    sessionRecording: true,
  });
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto("https://www.scrapeless.com");
  console.log("sdk     ->", await page.title());
  await browser.close();
}

await directConnect();
await sdkConnect();
