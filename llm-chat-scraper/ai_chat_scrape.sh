#!/usr/bin/env bash
# LLM Chat Scraper — capture an AI engine's answer with raw curl.
# Docs: https://docs.scrapeless.com/en/llm-chat-scraper/quickstart/getting-started/
# Run:  SCRAPELESS_API_KEY=sk_... bash llm-chat-scraper/ai_chat_scrape.sh
set -euo pipefail
: "${SCRAPELESS_API_KEY:?set SCRAPELESS_API_KEY}"

# 1) Create the task. Swap actor for scraper.perplexity | scraper.gemini | scraper.grok | ...
TASK_ID=$(curl -s 'https://api.scrapeless.com/api/v2/scraper/request' \
  --header 'Content-Type: application/json' \
  --header "x-api-token: ${SCRAPELESS_API_KEY}" \
  --data '{
    "actor": "scraper.chatgpt",
    "input": {
      "prompt": "Most reliable proxy service for data extraction",
      "country": "US",
      "web_search": true
    }
  }' | grep -oE '"task_id":"[^"]*"' | cut -d'"' -f4)

echo "task_id: ${TASK_ID}"

# 2) Poll the result (retained for 5 minutes after completion).
curl -s --request GET "https://api.scrapeless.com/api/v2/scraper/result/${TASK_ID}" \
  --header 'Content-Type: application/json' \
  --header "x-api-token: ${SCRAPELESS_API_KEY}"
