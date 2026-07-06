// Scrapeless Crawl — single-page scrape, batch scrape, and recursive crawl.
// Docs: https://docs.scrapeless.com/en/crawl/quickstart/getting-started/
// Run:  SCRAPELESS_API_KEY=sk_... node crawl/scrape.js
import { ScrapingCrawl } from "@scrapeless-ai/sdk";

const client = new ScrapingCrawl({
  apiKey: process.env.SCRAPELESS_API_KEY || "your_api_key_here",
});

async function main() {
  // 1) Scrape a single page, choosing which formats to return.
  const page = await client.scrapeUrl("https://example.com", {
    formats: ["markdown", "html", "links"],
    onlyMainContent: false,
    timeout: 15000,
  });
  console.log("scrape:", page?.status, Object.keys(page?.data ?? page ?? {}));

  // 2) Batch scrape several URLs in one call.
  const batch = await client.batchScrapeUrls(
    ["https://example.com", "https://scrapeless.com"],
    {
      formats: ["markdown", "links"],
      browserOptions: { proxyCountry: "ANY", sessionTTL: 900 },
    }
  );
  console.log("batch:", batch?.status, batch?.total);

  // 3) Recursively crawl a site up to `limit` pages.
  const crawl = await client.crawlUrl("https://example.com", {
    limit: 2,
    scrapeOptions: { formats: ["markdown"], onlyMainContent: false },
    browserOptions: { proxyCountry: "ANY", sessionTTL: 900 },
  });
  console.log("crawl:", crawl?.status, `${crawl?.completed}/${crawl?.total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
