// Universal Scraping API — fetch a page through the Web Unlocker (Node SDK).
// Docs: https://docs.scrapeless.com/en/universal-scraping-api/quickstart/getting-started/
// Run:  SCRAPELESS_API_KEY=sk_... node universal-scraping-api/unlocker.js
import { Scrapeless } from "@scrapeless-ai/sdk";

const client = new Scrapeless({
  apiKey: process.env.SCRAPELESS_API_KEY || "your_api_key_here",
});

client.universal
  .scrape({
    actor: "unlocker.webunlocker",
    input: {
      url: "https://www.example.com",
      redirect: false,
      method: "GET",
    },
    proxy: {
      country: "ANY",
    },
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
