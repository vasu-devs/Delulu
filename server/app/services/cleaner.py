import re

def clean_transaction_text(raw_text: str) -> str:
    """
    Deterministic Cleaning Layer (Python Port)
    """
    # Split by dynamic separators
    lines = re.split(r'\n|\s{3,}', raw_text)
    cleaned_lines = []

    # Garbage patterns
    garbage_patterns = [
        r'Page \d+ of \d+',
        r'System generated statement',
        r'For any queries, contact us',
        r'https://support\.phonepe\.com',
        r'^Date\s+Type\s+Amount'
    ]

    # Date pattern (e.g., Jun 05, 2025)
    date_pattern = r'[A-Z][a-z]{2}\s+\d{1,2},?\s+\d{4}'

    current_transaction = ""

    for line in lines:
        trimmed = line.strip()
        if not trimmed:
            continue
            
        # Filter garbage (only short segments that match patterns)
        if len(trimmed) < 100 and any(re.search(p, trimmed, re.I) for p in garbage_patterns):
            continue

        if re.search(date_pattern, trimmed):
            if current_transaction:
                cleaned_lines.append(current_transaction)
            current_transaction = trimmed
        else:
            if current_transaction:
                current_transaction += " " + trimmed
            else:
                current_transaction = trimmed

    if current_transaction:
        cleaned_lines.append(current_transaction)

    final_result = "\n".join(cleaned_lines).strip()
    return final_result if final_result else raw_text[:5000].strip()
