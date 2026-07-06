"""Universal Scraping API — render JavaScript and return the page as Markdown.

Docs: https://docs.scrapeless.com/en/universal-scraping-api/features/js-render/
Run:  SCRAPELESS_API_KEY=sk_... python universal-scraping-api/js-render.py

jsRender.response.type can be: html | plaintext | markdown | png | jpeg | network | content.
"""
import os

import requests

API_KEY = os.environ.get("SCRAPELESS_API_KEY", "your_api_key_here")

payload = {
    "actor": "unlocker.webunlocker",
    "proxy": {"country": "ANY"},
    "input": {
        "url": "https://www.example.com",
        "jsRender": {
            "enabled": True,
            "response": {"type": "markdown"},
        },
    },
}

response = requests.post(
    "https://api.scrapeless.com/api/v2/unlocker/request",
    json=payload,
    headers={"x-api-token": API_KEY, "Content-Type": "application/json"},
    timeout=60,
)

data = response.json()
if data.get("code") == 200:
    with open("response.md", "w", encoding="utf-8") as f:
        f.write(data["data"])
    print("saved response.md")
else:
    print("error:", data)
