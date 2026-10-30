"""Machine Learning pipeline construction for Hindi text classification.

This module builds a scikit-learn Pipeline combining Devanagari text cleaning,
Unicode-aware subword / word TF-IDF vectorization, and statistical classification.
"""

from __future__ import annotations

import joblib
from pathlib import Path
from typing import Literal

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

from src.preprocessor import clean_hindi_text, HINDI_STOPWORDS

# Unicode range for Devanagari characters: \u0900-\u097F
DEVANAGARI_TOKEN_PATTERN = r"[\u0900-\u097F]+|[a-zA-Z]+"

ClassifierType = Literal["multinomial_nb", "logistic_regression"]
FeatureMode = Literal["char_wb", "word"]


def create_hindi_classifier(
    classifier_type: ClassifierType = "logistic_regression",
    feature_mode: FeatureMode = "char_wb",
    ngram_range: tuple[int, int] | None = None,
    sublinear_tf: bool = True,
    max_features: int | None = 3500,
) -> Pipeline:
    """Creates a scikit-learn Pipeline for Hindi text classification.

    The pipeline consists of:
    1. TfidfVectorizer:
       - Uses `clean_hindi_text` as the preprocessor.
       - If `feature_mode='char_wb'`: Uses subword character n-grams (3 to 5 chars),
         which captures Hindi morphological roots and inflections (e.g. 'खिलाड़ी' vs 'खिलाड़ियों').
       - If `feature_mode='word'`: Uses intact Devanagari word n-grams (1 to 2 words).
       - Applies sublinear TF scaling (1 + log(tf)) to reduce length bias.
    2. Classifier:
       - 'logistic_regression': L2-regularized Logistic Regression (C=1.0).
       - 'multinomial_nb': Multinomial Naive Bayes with Laplace smoothing (alpha=0.5).

    Args:
        classifier_type: Algorithm choice ('logistic_regression' or 'multinomial_nb').
        feature_mode: 'char_wb' (subword character n-grams) or 'word' (word n-grams).
        ngram_range: n-gram boundaries. Defaults to (3, 5) for char_wb, (1, 2) for word.
        sublinear_tf: Apply sublinear tf scaling, replacing tf with 1 + log(tf).
        max_features: Maximum vocabulary size (None for unlimited).

    Returns:
        A compiled scikit-learn Pipeline ready to fit.
    """
    if feature_mode == "char_wb":
        effective_ngram = ngram_range if ngram_range is not None else (3, 5)
        vectorizer = TfidfVectorizer(
            preprocessor=clean_hindi_text,
            analyzer="char_wb",
            ngram_range=effective_ngram,
            sublinear_tf=sublinear_tf,
            max_features=max_features,
        )
    elif feature_mode == "word":
        effective_ngram = ngram_range if ngram_range is not None else (1, 2)
        vectorizer = TfidfVectorizer(
            preprocessor=clean_hindi_text,
            analyzer="word",
            token_pattern=DEVANAGARI_TOKEN_PATTERN,
            ngram_range=effective_ngram,
            stop_words=list(HINDI_STOPWORDS),
            sublinear_tf=sublinear_tf,
            max_features=max_features,
        )
    else:
        raise ValueError(
            f"Unsupported feature_mode '{feature_mode}'. Choose 'char_wb' or 'word'."
        )

    if classifier_type == "logistic_regression":
        clf = LogisticRegression(
            C=1.0,
            max_iter=1000,
            random_state=42,
            solver="lbfgs",
        )
    elif classifier_type == "multinomial_nb":
        clf = MultinomialNB(alpha=0.5)
    else:
        raise ValueError(
            f"Unsupported classifier_type '{classifier_type}'. Choose 'logistic_regression' or 'multinomial_nb'."
        )

    pipeline = Pipeline(
        steps=[
            ("vectorizer", vectorizer),
            ("classifier", clf),
        ]
    )

    return pipeline


def save_model(pipeline: Pipeline, file_path: str | Path) -> Path:
    """Serializes the trained pipeline artifact to disk using joblib."""
    path = Path(file_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, path)
    return path


def load_model(file_path: str | Path) -> Pipeline:
    """Loads a previously trained pipeline artifact from disk."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(
            f"Model artifact not found at {path}. Run train.py first to train the model."
        )
    return joblib.load(path)
