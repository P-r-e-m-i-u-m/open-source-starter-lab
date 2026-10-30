"""Model training script for the Hindi Text Classifier.

This script loads the corpus, performs a stratified train/test split to prevent
data leakage, fits the pipeline on training data, evaluates initial accuracy,
and exports the model artifact.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split

from src.pipeline import create_hindi_classifier, save_model, ClassifierType, FeatureMode

DEFAULT_DATA_PATH = Path("data/raw/hindi_corpus.csv")
DEFAULT_MODEL_PATH = Path("models/hindi_classifier.joblib")
DEFAULT_TEST_DATA_PATH = Path("data/test_split.csv")


def load_data(csv_path: Path) -> pd.DataFrame:
    """Loads and validates the Hindi corpus CSV."""
    if not csv_path.exists():
        raise FileNotFoundError(f"Corpus file not found at: {csv_path.resolve()}")

    df = pd.read_csv(csv_path, encoding="utf-8")
    if "text" not in df.columns or "category" not in df.columns:
        raise ValueError("Corpus CSV must contain 'text' and 'category' columns.")

    df = df.dropna(subset=["text", "category"])
    df["text"] = df["text"].astype(str)
    df["category"] = df["category"].astype(str)
    return df


def train_and_export(
    data_path: Path = DEFAULT_DATA_PATH,
    model_output_path: Path = DEFAULT_MODEL_PATH,
    test_split_path: Path = DEFAULT_TEST_DATA_PATH,
    classifier_type: ClassifierType = "logistic_regression",
    feature_mode: FeatureMode = "char_wb",
    test_size: float = 0.25,
    random_state: int = 42,
) -> dict[str, float]:
    """Trains the classification pipeline and exports the trained artifact.

    Args:
        data_path: Path to raw dataset CSV.
        model_output_path: Destination path for .joblib model artifact.
        test_split_path: Destination path to persist held-out test split.
        classifier_type: Type of classifier ('logistic_regression' or 'multinomial_nb').
        feature_mode: Type of feature extraction ('char_wb' or 'word').
        test_size: Proportion of dataset allocated to held-out test set.
        random_state: Random seed for reproducible splitting.

    Returns:
        Dictionary containing train_accuracy and test_accuracy scores.
    """
    print(f"[*] Loading corpus from: {data_path}")
    df = load_data(data_path)
    print(f"[*] Total loaded records: {len(df)}")
    print(f"[*] Category distribution:\n{df['category'].value_counts().to_string()}\n")

    X = df["text"]
    y = df["category"]

    # Stratified split ensures equal class representation in train and test splits
    # and strictly prevents data leakage.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        stratify=y,
        random_state=random_state,
    )

    print(f"[*] Train set size: {len(X_train)} samples")
    print(f"[*] Test set size:  {len(X_test)} samples")

    # Save held-out test split for independent evaluation in evaluate.py
    test_df = pd.DataFrame({"text": X_test, "category": y_test})
    test_split_path.parent.mkdir(parents=True, exist_ok=True)
    test_df.to_csv(test_split_path, index=False, encoding="utf-8")
    print(f"[*] Saved held-out test split to: {test_split_path}")

    # Build and fit the pipeline strictly on training data
    print(
        f"[*] Building pipeline (Classifier: {classifier_type}, Feature Mode: {feature_mode})..."
    )
    pipeline = create_hindi_classifier(
        classifier_type=classifier_type,
        feature_mode=feature_mode,
    )

    print("[*] Training pipeline on training split...")
    pipeline.fit(X_train, y_train)

    # Compute actual accuracies
    train_acc = float(pipeline.score(X_train, y_train))
    test_acc = float(pipeline.score(X_test, y_test))

    print(f"\n[+] Training Accuracy:      {train_acc * 100:.2f}%")
    print(f"[+] Held-out Test Accuracy: {test_acc * 100:.2f}%")

    # Serialize trained pipeline artifact
    saved_path = save_model(pipeline, model_output_path)
    print(f"[+] Successfully exported model artifact to: {saved_path}\n")

    return {
        "train_accuracy": train_acc,
        "test_accuracy": test_acc,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Train the Hindi Text Classification model."
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=DEFAULT_DATA_PATH,
        help="Path to input corpus CSV.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_MODEL_PATH,
        help="Destination path for trained model artifact.",
    )
    parser.add_argument(
        "--classifier",
        type=str,
        choices=["logistic_regression", "multinomial_nb"],
        default="logistic_regression",
        help="Classifier algorithm to use.",
    )
    parser.add_argument(
        "--features",
        type=str,
        choices=["char_wb", "word"],
        default="char_wb",
        help="Feature mode ('char_wb' subword character n-grams or 'word' n-grams).",
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.25,
        help="Fraction of dataset to use for test split.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducibility.",
    )

    args = parser.parse_args()
    train_and_export(
        data_path=args.data,
        model_output_path=args.output,
        classifier_type=args.classifier,
        feature_mode=args.features,
        test_size=args.test_size,
        random_state=args.seed,
    )


if __name__ == "__main__":
    main()
