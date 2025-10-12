import re

def classify_request(text):
    """
    Classify the extracted text into one of three categories:
    - Cease: Requests to stop communication.
    - Uncertain: Requests that require manual review.
    - Irrelevant: Requests that are not related to "Cease."
    """
    text = text.lower()  # Convert to lowercase for case-insensitive matching

    # Keywords for "Cease"
    cease_keywords = [
        "cease and desist",
        "stop communication",
        "do not contact me",
        "cease all communications",
        "stop all communications",
        "do not reach out",
        "do not email me",
        "do not call me",
        "stop contacting me",
        "no further communication",
        # OCR variations
        "do nct contact me",  # OCR misreads "not" as "nct"
        "do nat contact me",  # OCR misreads "not" as "nat"
        "do no contact me",   # OCR misses the "t" in "not"
        "cease al communications",  # OCR misreads "all" as "al"
        "stop communicatien",  # OCR misreads "communication" as "communicatien"
    ]

    # Keywords for "Uncertain"
    uncertain_keywords = [
        "review",
        "manual review",
        "requires further clarification",
        "needs clarification",
        "unclear request"
    ]

    # Check for "Cease"
    if any(keyword in text for keyword in cease_keywords):
        return "Cease"

    # Check for "Uncertain"
    if any(keyword in text for keyword in uncertain_keywords):
        return "Uncertain"

    # Default to "Irrelevant"
    return "Irrelevant"