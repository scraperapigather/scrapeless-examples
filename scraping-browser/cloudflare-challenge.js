// Scraping Browser — clear a Cloudflare challenge page and read the real DOM.
// Docs: https://docs.scrapeless.com/en/scraping-browser/guides/cloudflare-bypass-in-web-scraping/
// Run:  SCRAPELESS_API_KEY=sk_... node scraping-browser/cloudflare-challenge.js
//
// The cloud browser renders the challenge JavaScript on clean residential egress
// and solves the interstitial automatically. You wait for the post-challenge
// content, then scrape as usual.
import puppeteer from "puppeteer-core";
import { createPuppeteerCDPSession } from "@scrapeless-ai/sdk";

const apiKey = process.env.SCRAPELESS_API_KEY || "your_api_key_here";
const TARGET = "https://www.scrapingcourse.com/cloudflare-challenge";

const params = new URLSearchParams({
  token: apiKey,
  sessionTTL: "180",
  proxyCountry: "US",
});
const connectionURL = `wss://browser.scrapeless.com/api/v2/browser?${params}`;

const browser = await puppeteer.connect({ browserWSEndpoint: connectionURL });
const page = await browser.newPage();

// Let the built-in solver auto-clear detected challenges on this session.
const cdp = await createPuppeteerCDPSession(page);
await cdp.solveCaptcha({ timeout: 60000 }).catch(() => {});

await page.goto(TARGET, { waitUntil: "domcontentloaded", timeout: 60000 });

// The challenge is cleared once the post-interstitial content is present.
await page.waitForSelector("main.page-content .challenge-info", { timeout: 60000 });

console.log("title   ->", await page.title());
console.log("cleared ->", await page.$eval("main.page-content", (el) => el.innerText.slice(0, 200)));
await browser.close();
