"""Unit tests for the Hindi text preprocessor."""

import pytest
from src.preprocessor import (
    clean_hindi_text,
    validate_text,
    batch_clean_hindi_text,
    HINDI_STOPWORDS,
)


def test_validate_text_valid_input():
    result = validate_text("  नमस्ते भारत  ")
    assert result == "नमस्ते भारत"


def test_validate_text_empty_raises_value_error():
    with pytest.raises(ValueError, match="empty or whitespace only"):
        validate_text("")

    with pytest.raises(ValueError, match="empty or whitespace only"):
        validate_text("    ")


def test_validate_text_non_string_raises_type_error():
    with pytest.raises(TypeError, match="Expected a string"):
        validate_text(12345)

    with pytest.raises(TypeError, match="Expected a string"):
        validate_text(None)


def test_clean_hindi_text_removes_danda_and_punctuation():
    text = "छात्र परीक्षा दे रहे हैं। क्या वे पास होंगे? हाँ!"
    cleaned = clean_hindi_text(text)
    assert "।" not in cleaned
    assert "?" not in cleaned
    assert "!" not in cleaned
    assert "छात्र परीक्षा दे रहे हैं क्या वे पास होंगे हाँ" == cleaned


def test_clean_hindi_text_removes_numerals():
    text = "कक्षा १० में २५ छात्र और 25 छात्राएं हैं।"
    cleaned = clean_hindi_text(text)
    # Check Hindi numerals ०-९ are removed
    assert "१०" not in cleaned
    assert "२५" not in cleaned
    # Check Arabic numerals 0-9 are removed
    assert "25" not in cleaned
    assert "कक्षा में छात्र और छात्राएं हैं" == cleaned


def test_clean_hindi_text_stopword_removal():
    text = "छात्रों ने परीक्षा की तैयारी के लिए अध्ययन किया।"
    cleaned = clean_hindi_text(text, remove_stopwords=True)
    # Common function words should be filtered
    for stopword in ["ने", "की", "के", "लिए"]:
        tokens = cleaned.split()
        assert stopword not in tokens
    assert "छात्रों" in cleaned
    assert "परीक्षा" in cleaned
    assert "तैयारी" in cleaned
    assert "अध्ययन" in cleaned


def test_clean_hindi_text_unicode_nfc():
    # Verify that combining characters remain consistent
    text = "हिंदी"
    cleaned = clean_hindi_text(text)
    assert cleaned == "हिंदी"


def test_batch_clean_hindi_text():
    texts = [
        "आज वर्षा होगी।",
        "क्रिकेट मैच शुरू हुआ!",
    ]
    results = batch_clean_hindi_text(texts)
    assert len(results) == 2
    assert results[0] == "आज वर्षा होगी"
    assert results[1] == "क्रिकेट मैच शुरू हुआ"

