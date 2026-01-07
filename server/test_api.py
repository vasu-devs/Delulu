import requests

try:
    resp = requests.post(
        "http://127.0.0.1:8000/api/v1/analyze",
        data={"text": "2024-01-01 Uber 500 Food"}
    )
    print(f"Status: {resp.status_code}")
    print(f"Content: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
