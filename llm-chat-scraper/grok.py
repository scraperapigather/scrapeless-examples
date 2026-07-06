"""Grok Scraper — capture Grok's answer as data.

Docs: https://docs.scrapeless.com/en/llm-chat-scraper/scrapers/grok/
Run:  SCRAPELESS_API_KEY=sk_... python llm-chat-scraper/grok.py

Two-call async flow: create a task, then poll the result by task_id.
input: prompt (req), country (req), mode (req: MODEL_MODE_FAST | MODEL_MODE_EXPERT | MODEL_MODE_AUTO).
"""
import os
import time

import requests

API_KEY = os.environ["SCRAPELESS_API_KEY"]
BASE = "https://api.scrapeless.com"
HEADERS = {"x-api-token": API_KEY, "Content-Type": "application/json"}


def ask_grok(prompt: str, country: str = "US", mode: str = "MODEL_MODE_AUTO") -> dict:
    created = requests.post(
        f"{BASE}/api/v2/scraper/request",
        headers=HEADERS,
        json={"actor": "scraper.grok", "input": {"prompt": prompt, "country": country, "mode": mode}},
        timeout=60,
    )
    task_id = created.json()["task_id"]

    for _ in range(30):
        time.sleep(3)
        got = requests.get(f"{BASE}/api/v2/scraper/result/{task_id}", headers=HEADERS, timeout=60)
        data = got.json()
        if data.get("status") in ("success", "failed"):
            return data
    raise TimeoutError("result not ready in time")


if __name__ == "__main__":
    result = ask_grok("Most reliable proxy service for data extraction")
    print(result["task_result"].get("full_response", result["task_result"])[:500]
          if isinstance(result["task_result"], str) else result["task_result"])
