"""Unit tests for the classification pipeline and model behavior."""

import pytest
import numpy as np
from src.pipeline import (
    create_hindi_classifier,
    save_model,
    load_model,
)

SAMPLE_TRAIN_TEXTS = [
    "छात्रों ने परीक्षा की तैयारी की।",
    "विश्वविद्यालय में नया शैक्षणिक सत्र शुरू हुआ।",
    "भारतीय क्रिकेट टीम ने मैच जीत लिया।",
    "स्ट्राइकर ने फाइनल मैच में गोल किया।",
    "मौसम विभाग ने भारी बारिश की चेतावनी दी।",
    "तापमान में भारी गिरावट से ठंड बढ़ गई।",
    "मशीन लर्निंग सॉफ्टवेयर नए प्रोग्राम बना रहे हैं।",
    "स्मार्टफोन और कंप्यूटर तकनीक तेजी से बदल रही है।",
]

SAMPLE_LABELS = [
    "education",
    "education",
    "sports",
    "sports",
    "weather",
    "weather",
    "technology",
    "technology",
]


def test_pipeline_creation_valid():
    pipeline_nb = create_hindi_classifier(classifier_type="multinomial_nb", feature_mode="word")
    assert "vectorizer" in pipeline_nb.named_steps
    assert "classifier" in pipeline_nb.named_steps

    pipeline_lr = create_hindi_classifier(classifier_type="logistic_regression", feature_mode="char_wb")
    assert "vectorizer" in pipeline_lr.named_steps
    assert "classifier" in pipeline_lr.named_steps


def test_pipeline_creation_invalid_type():
    with pytest.raises(ValueError, match="Unsupported classifier_type"):
        create_hindi_classifier(classifier_type="random_forest")  # type: ignore

    with pytest.raises(ValueError, match="Unsupported feature_mode"):
        create_hindi_classifier(feature_mode="byte")  # type: ignore


def test_pipeline_training_and_prediction():
    pipeline = create_hindi_classifier(classifier_type="logistic_regression", feature_mode="char_wb")
    pipeline.fit(SAMPLE_TRAIN_TEXTS, SAMPLE_LABELS)

    # Test prediction on a sample
    test_query = ["छात्रों की परीक्षा"]
    prediction = pipeline.predict(test_query)
    assert len(prediction) == 1
    assert prediction[0] in {"education", "sports", "weather", "technology"}


def test_predict_proba_sums_to_one():
    pipeline = create_hindi_classifier(classifier_type="logistic_regression", feature_mode="char_wb")
    pipeline.fit(SAMPLE_TRAIN_TEXTS, SAMPLE_LABELS)

    test_queries = [
        "आज बारिश हो सकती है।",
        "क्रिकेट मैच बहुत रोमांचक रहा।",
    ]
    probas = pipeline.predict_proba(test_queries)

    assert probas.shape == (2, 4)
    # Each row must sum to 1.0 (within float tolerance)
    for row in probas:
        assert np.isclose(np.sum(row), 1.0, atol=1e-5)


def test_out_of_vocabulary_words_dont_crash():
    pipeline = create_hindi_classifier(classifier_type="logistic_regression", feature_mode="char_wb")
    pipeline.fit(SAMPLE_TRAIN_TEXTS, SAMPLE_LABELS)

    # Completely novel words that were not in training vocabulary
    unseen_sentence = ["एक अजीब अज्ञात परिदृश्य"]
    prediction = pipeline.predict(unseen_sentence)
    assert len(prediction) == 1
    assert prediction[0] in {"education", "sports", "weather", "technology"}


def test_model_save_and_load(tmp_path):
    pipeline = create_hindi_classifier(classifier_type="logistic_regression", feature_mode="char_wb")
    pipeline.fit(SAMPLE_TRAIN_TEXTS, SAMPLE_LABELS)

    save_dest = tmp_path / "test_model.joblib"
    save_model(pipeline, save_dest)
    assert save_dest.exists()

    loaded_pipeline = load_model(save_dest)
    sample_text = ["कंप्यूटर और सॉफ्टवेयर"]
    original_pred = pipeline.predict(sample_text)
    loaded_pred = loaded_pipeline.predict(sample_text)

    assert original_pred[0] == loaded_pred[0]


def test_load_nonexistent_model_raises_error(tmp_path):
    missing_path = tmp_path / "does_not_exist.joblib"
    with pytest.raises(FileNotFoundError, match="Model artifact not found"):
        load_model(missing_path)
