"""Text preprocessing module for Hindi Devanagari text.

This module handles Unicode normalization, punctuation stripping (including Hindi
purna viram / danda), numeral removal, whitespace cleaning, and input validation.
"""

from __future__ import annotations

import re
import unicodedata
from typing import Sequence

# Common Hindi Devanagari stopwords (function words)
HINDI_STOPWORDS: tuple[str, ...] = (
    "है", "हैं", "हो", "होता", "होती", "होते", "था", "थे", "थी", "में",
    "से", "को", "का", "के", "की", "ने", "पर", "और", "या", "यह", "वह",
    "तो", "ही", "भी", "द्वारा", "लिए", "कर", "किया", "गया", "गए", "गई",
    "रहा", "रहे", "रही", "सकता", "सकते", "सकती", "एक", "इन", "उन", "इस",
    "उस", "जो", "जिस", "जब", "तब", "अब", "तक", "साथ", "बाद", "पहले"
)

# Regular expression matching Hindi and English punctuation and symbols
PUNCTUATION_PATTERN = re.compile(
    r"[।॥!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~0-9०-९\s]+"
)


def validate_text(text: object) -> str:
    """Validates that the input is a non-empty string.

    Args:
        text: Input object to check.

    Returns:
        The validated string.

    Raises:
        TypeError: If the input is not a string.
        ValueError: If the input is empty or whitespace only.
    """
    if not isinstance(text, str):
        raise TypeError(f"Expected a string, got {type(text).__name__}")
    stripped = text.strip()
    if not stripped:
        raise ValueError("Input text cannot be empty or whitespace only.")
    return stripped


def clean_hindi_text(text: str, remove_stopwords: bool = False) -> str:
    """Cleans and normalizes Hindi Devanagari text.

    Steps performed:
    1. Validate input text.
    2. Normalize Unicode using NFC (Canonical Decomposition followed by Canonical Composition).
    3. Replace Devanagari danda (। / ॥) and punctuation with single spaces.
    4. Remove Arabic and Devanagari numerals.
    5. Optionally filter out frequent Devanagari stop words.
    6. Normalize multiple consecutive spaces.

    Args:
        text: Raw Hindi sentence.
        remove_stopwords: If True, removes words present in HINDI_STOPWORDS.

    Returns:
        Cleaned, normalized Devanagari string.
    """
    valid_text = validate_text(text)

    # Unicode normalization ensures consistent character representations (e.g., nukta letters)
    normalized = unicodedata.normalize("NFC", valid_text)

    # Tokenize by splitting around punctuation and numbers
    tokens = [t for t in PUNCTUATION_PATTERN.split(normalized) if t]

    if remove_stopwords:
        stopword_set = set(HINDI_STOPWORDS)
        tokens = [t for t in tokens if t not in stopword_set]

    cleaned = " ".join(tokens).strip()

    # If all tokens were stripped (e.g. input was only numbers/punctuation)
    if not cleaned:
        return ""

    return cleaned


def batch_clean_hindi_text(
    texts: Sequence[str], remove_stopwords: bool = False
) -> list[str]:
    """Cleans a sequence of Hindi texts."""
    return [clean_hindi_text(t, remove_stopwords=remove_stopwords) for t in texts]

