"""LLM Chat Scraper — capture an AI engine's answer (create task, then poll).

Docs: https://docs.scrapeless.com/en/llm-chat-scraper/quickstart/getting-started/
Run:  SCRAPELESS_API_KEY=sk_... python llm-chat-scraper/ai_chat_scrape.py

Actors: scraper.chatgpt | scraper.perplexity | scraper.copilot | scraper.gemini
        scraper.aimode (Google AI Mode) | scraper.overview (Google AI Overview) | scraper.grok
Results are retained for 5 minutes after completion, so fetch promptly (or use a webhook).
"""
import os
import time

import requests

API_KEY = os.environ.get("SCRAPELESS_API_KEY", "your_api_key_here")
BASE = "https://api.scrapeless.com"
HEADERS = {"Content-Type": "application/json", "x-api-token": API_KEY}


def create_task(actor: str, payload_input: dict) -> str:
    resp = requests.post(
        f"{BASE}/api/v2/scraper/request",
        headers=HEADERS,
        json={"actor": actor, "input": payload_input},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["task_id"]


def poll_result(task_id: str, tries: int = 30, delay: float = 3.0) -> dict:
    for _ in range(tries):
        resp = requests.get(
            f"{BASE}/api/v2/scraper/result/{task_id}", headers=HEADERS, timeout=60
        )
        data = resp.json()
        if data.get("status") in ("success", "failed"):
            return data
        time.sleep(delay)
    raise TimeoutError("result not ready in time")


if __name__ == "__main__":
    task_id = create_task(
        "scraper.chatgpt",
        {
            "prompt": "Most reliable proxy service for data extraction",
            "country": "US",
            "web_search": True,
        },
    )
    print("task_id:", task_id)
    print(poll_result(task_id))
