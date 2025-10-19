import re
from app.llm_utils import get_llm_response

def classify_request(text, language="en"):
    """
    Classify the extracted text into one of three categories:
    - Cease: Requests to stop communication.
    - Uncertain: Requests that require manual review.
    - Irrelevant: Requests that are not related to "Cease."
    """
    # Preprocess the text based on the detected language
    if language != "en":
        print(f"Preprocessing text for language: {language}")
        # Add language-specific preprocessing here (e.g., translation, normalization)

    # Define the classification prompt for OpenAI
    prompt = f"""
    Classify the following text into one of three categories: "Cease", "Uncertain", or "Irrelevant".
    Text: {text}
    Classification:
    """

    # Try to classify using OpenAI
    try:
        classification = get_llm_response(prompt)
        return classification.strip()  # Ensure no extra whitespace
    except Exception as e:
        print(f"LLM classification failed: {str(e)}")
        print("Falling back to pattern-based classification.")

    # Fallback to pattern-based classification
    text = text.lower()  # Convert to lowercase for case-insensitive matching

    # Regular expressions for "Cease"
    cease_patterns = [
        r"cease and desist",
        r"stop communication",
        r"do\s?n[oa]t contact me",  # Matches "do not", "do nct", "do nat", etc.
        r"cease all communications",
        r"stop all communications",
        r"do not reach out",
        r"do not email me",
        r"do not call me",
        r"stop contacting me",
        r"no further communication",
        r"refrain from initiating further direct contact",  # Specific legal phrasing
    ]

    # Keywords for "Uncertain"
    uncertain_keywords = [
        "manual review",
        "requires further clarification",
        "needs clarification",
        "unclear request",
        "pending confirmation",
        "verification of authority",
    ]

    # Check for "Cease" patterns
    for pattern in cease_patterns:
        if re.search(pattern, text):
            return "Cease"

    # Check for "Uncertain" keywords
    for keyword in uncertain_keywords:
        if keyword in text:
            return "Uncertain"

    # Default to "Irrelevant" if no patterns match
    return "Irrelevant"