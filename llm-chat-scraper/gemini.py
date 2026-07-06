"""Gemini Scraper — capture Google Gemini's answer and citations as data.

Docs: https://docs.scrapeless.com/en/llm-chat-scraper/scrapers/gemini/
Run:  SCRAPELESS_API_KEY=sk_... python llm-chat-scraper/gemini.py

Two-call async flow: create a task, then poll the result by task_id.
Verified live: returns result_text + a citations[] array (title/url/website_name/snippet/favicon/highlights).
"""
import os
import time

import requests

API_KEY = os.environ["SCRAPELESS_API_KEY"]
BASE = "https://api.scrapeless.com"
HEADERS = {"x-api-token": API_KEY, "Content-Type": "application/json"}


def ask_gemini(prompt: str, country: str = "US") -> dict:
    created = requests.post(
        f"{BASE}/api/v2/scraper/request",
        headers=HEADERS,
        json={"actor": "scraper.gemini", "input": {"prompt": prompt, "country": country}},
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
    result = ask_gemini("Recommended attractions in New York")
    answer = result["task_result"]
    print(answer["result_text"][:500], "\n")
    for c in answer.get("citations", []):
        print("-", c.get("website_name"), c.get("url"))
