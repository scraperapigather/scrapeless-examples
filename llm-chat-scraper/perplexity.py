"""Perplexity Scraper — capture Perplexity's cited answer as data.

Docs: https://docs.scrapeless.com/en/llm-chat-scraper/scrapers/perplexity/
Run:  SCRAPELESS_API_KEY=sk_... python llm-chat-scraper/perplexity.py

Two-call async flow: create a task, then poll the result by task_id.
Verified live: returns result_text + web_results[] (name/url/snippet), related_prompt[], media_items[].
Set web_search=True for a grounded, cited answer.
"""
import os
import time

import requests

API_KEY = os.environ["SCRAPELESS_API_KEY"]
BASE = "https://api.scrapeless.com"
HEADERS = {"x-api-token": API_KEY, "Content-Type": "application/json"}


def ask_perplexity(prompt: str, country: str = "US") -> dict:
    created = requests.post(
        f"{BASE}/api/v2/scraper/request",
        headers=HEADERS,
        json={
            "actor": "scraper.perplexity",
            "input": {"prompt": prompt, "country": country, "web_search": True},
        },
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
    result = ask_perplexity("Recommended attractions in New York")
    answer = result["task_result"]
    print(answer["result_text"][:500], "\n")
    for w in answer.get("web_results", []):
        print("-", w.get("name"), w.get("url"))
    print("\nfollow-ups:", answer.get("related_prompt", []))
