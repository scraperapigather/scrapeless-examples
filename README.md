# Scrapeless Examples

Runnable, copy-pasteable examples for the [Scrapeless](https://www.scrapeless.com) API — one folder per product, each built straight from the official docs at [docs.scrapeless.com](https://docs.scrapeless.com).

Every example reads your key from the `SCRAPELESS_API_KEY` environment variable. Get a free key at [app.scrapeless.com](https://app.scrapeless.com).

```bash
cp .env.example .env      # then put your key in it
export SCRAPELESS_API_KEY=sk_...
```

## Products

| Folder | Product | Docs |
|---|---|---|
| [`scraping-browser/`](scraping-browser/) | Scraping Browser — anti-detection cloud browser (Puppeteer/Playwright over CDP) | [docs](https://docs.scrapeless.com/en/scraping-browser/quickstart/introduction/) |
| [`universal-scraping-api/`](universal-scraping-api/) | Universal Scraping API — Web Unlocker + JS render | [docs](https://docs.scrapeless.com/en/universal-scraping-api/quickstart/introduction/) |
| [`crawl/`](crawl/) | Crawl — single-page scrape, batch, recursive crawl | [docs](https://docs.scrapeless.com/en/crawl/quickstart/introduction/) |
| [`llm-chat-scraper/`](llm-chat-scraper/) | LLM Chat Scraper — capture answers from ChatGPT, Gemini, Perplexity, Grok, Copilot, Google AI | [docs](https://docs.scrapeless.com/en/llm-chat-scraper/quickstart/introduction/) |

## Setup

**Node examples** (`.js`):
```bash
npm install          # installs @scrapeless-ai/sdk, puppeteer-core, playwright-core
node scraping-browser/puppeteer-connect.js
```

**Python examples** (`.py`) use only `requests`:
```bash
pip install requests
python universal-scraping-api/unlocker.py
```

## Example index

### Scraping Browser
- `puppeteer-connect.js` — connect over CDP (direct wss + SDK helper)
- `playwright-connect.js` — connect with Playwright (`connectOverCDP` + SDK helper)
- `proxies.js` — pin residential egress by country / state / city
- `custom-fingerprint.js` — supply a consistent browser fingerprint
- `cloudflare-challenge.js` — clear a Cloudflare challenge page and read the real DOM

### Universal Scraping API
- `unlocker.js` — Web Unlocker via the Node SDK
- `unlocker.py` — Web Unlocker via raw HTTP
- `js-render.py` — render JS and return Markdown (`html | plaintext | markdown | png | jpeg | network | content`)

### Crawl
- `scrape.js` — single-page scrape, batch scrape, recursive crawl

### LLM Chat Scraper
- `ai_chat_scrape.py` — create task + poll result (any `scraper.*` actor)
- `ai_chat_scrape.sh` — the same workflow with raw curl

## Notes

- Never commit your real API key. The examples fall back to a `your_api_key_here` placeholder so they don't leak a secret if run without the env var.
- The Scraping Browser connection string is `wss://browser.scrapeless.com/api/v2/browser?token=...`; the REST APIs authenticate with the `x-api-token` header.
- License: [MIT](LICENSE).
