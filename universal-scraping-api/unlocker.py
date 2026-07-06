"""Universal Scraping API — fetch a page through the Web Unlocker (raw HTTP).

Docs: https://docs.scrapeless.com/en/universal-scraping-api/quickstart/getting-started/
Run:  SCRAPELESS_API_KEY=sk_... python universal-scraping-api/unlocker.py
"""
import json
import os

import requests

API_KEY = os.environ.get("SCRAPELESS_API_KEY", "your_api_key_here")
url = "https://api.scrapeless.com/api/v2/unlocker/request"

payload = json.dumps(
    {
        "actor": "unlocker.webunlocker",
        "input": {
            "url": "https://www.example.com",
            "redirect": False,
            "method": "GET",
        },
        "proxy": {
            "country": "ANY",
        },
    }
)
headers = {
    "Content-Type": "application/json",
    "x-api-token": API_KEY,
}

response = requests.post(url, headers=headers, data=payload, timeout=60)
print(response.text)
