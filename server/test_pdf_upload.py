import requests
import fitz # PyMuPDF

# Create a dummy PDF
doc = fitz.open()
page = doc.new_page()
page.insert_text((50, 50), "Date Merchant Amount\n2024-01-01 Uber 500\n2024-01-02 Zomato 300")
doc.save("dummy_test.pdf")

url = "http://127.0.0.1:8000/api/v1/analyze"
files = {'file': ('dummy_test.pdf', open('dummy_test.pdf', 'rb'), 'application/pdf')}

try:
    print(f"Uploading PDF to {url}...")
    resp = requests.post(url, files=files)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
except Exception as e:
    print(f"Request failed: {e}")
